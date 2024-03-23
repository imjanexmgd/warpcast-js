import fs from 'fs';

import getFollowingCh from './src/func/getFollowingCh.js';
import delay from './src/utils/delay.js';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import castAtCh from './src/func/castAtCh.js';
import getMe from './src/func/getMe.js';
import random from 'random';
import inquirer from 'inquirer';

const emotFile = fs.readFileSync('emot.txt', 'utf-8');
const jsonList = fs.readFileSync('acc.json');
const listed = JSON.parse(jsonList);

const processGetFollowingCh = async (token, fid) => {
   try {
      let listFollowingCh = [];
      let getChannel;
      while (true) {
         getChannel = await getFollowingCh(token, fid);
         if (getChannel.result.channels.length == 0) {
            loggerInfo('No channel !!!');
            break;
         }
         for (const channel of getChannel.result.channels) {
            const feedKey = channel.key;
            listFollowingCh.push(feedKey);
         }
         break;
      }
      if (getChannel.next) {
         let cursor;
         cursor = getChannel.next.cursor;
         while (true) {
            loggerInfo('fetch more');
            let getChannel;
            getChannel = await getFollowingCh(token, fid, cursor);
            for (const channel of getChannel.result.channels) {
               const feedKey = channel.key;
               listFollowingCh.push(feedKey);
            }
            if (getChannel.next) {
               cursor = getChannel.next.cursor;
            } else {
               loggerInfo('No more :(');
               break;
            }
         }
         return listFollowingCh;
      } else {
         loggerInfo('No more following ch to get');
         return listFollowingCh;
      }
   } catch (error) {
      throw error;
   }
};
(async () => {
   try {
      process.stdout.write('\x1Bc');
      const emotArr = emotFile.split('\n');
      const list = listed.map((item) => item.username);
      const { selected } = await inquirer.prompt({
         type: 'list',
         message: 'Pilih username:',
         name: 'selected',
         choices: list,
      });
      const selectedUser = listed.find((item) => item.username === selected);
      const { token, username } = selectedUser;
      process.stdout.write('\x1Bc');
      console.log(`AUTO CAST CH BY FOLLOWING CH\ncreated with ♡ by janexmgd`);
      const { result } = await getMe(token);
      const { user } = result;
      loggerSuccess(`Success get me`);
      loggerInfo(`Login as @${username} with fid ${user.fid}`);
      loggerInfo(`Get Channel by following me`);
      const myFollowingCh = await processGetFollowingCh(token, user.fid);
      loggerSuccess(`Success get following by channel me`);
      loggerInfo(
         `@${user.username} Following Channel total is ${myFollowingCh.length}`
      );
      for (const ch of myFollowingCh) {
         const emot = emotArr[Math.floor(Math.random() * emotArr.length)];
         const count = random.integer(1, 5);
         const text = emot.repeat(count);
         loggerInfo(`Trying sending cast ${text} to ${ch}`);
         try {
            const r = await castAtCh(token, ch, text);
            if (r.result.cast) {
               loggerSuccess(`Success cast hash ${r.result.cast.hash}`);
               const m = random.choice([3, 4, 5, 7, 8, 9, 6]);
               const ms = m * 10000;
               await delay(ms);
            }
         } catch (error) {
            loggerFailed(`Fail cast at ${ch}`);
         }
      }
   } catch (error) {
      console.log(error);
   }
})();
