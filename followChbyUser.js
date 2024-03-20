import fs from 'fs';
import inquirer from 'inquirer';

import getFollowingCh from './src/func/getFollowingCh.js';
import delay from './src/utils/delay.js';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import followCh from './src/func/followCh.js';
import getMe from './src/func/getMe.js';

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
      const list = listed.map((item) => item.username);
      const { selected } = await inquirer.prompt({
         type: 'list',
         message: 'Pilih username:',
         name: 'selected',
         choices: list,
      });
      process.stdout.write('\x1Bc');
      console.log(
         `\nAuto following Channel by Fid\ncreated with ♡ by janexmgd\n\n`
      );
      const selectedUser = listed.find((item) => item.username === selected);
      const { token, username } = selectedUser;
      const { result } = await getMe(token);
      const { user } = result;
      loggerSuccess(`Success get me`);
      loggerInfo(`Login as @${user.username} with fid ${user.fid}`);
      loggerInfo(`Get Channel by following me`);
      const myFollowingCh = await processGetFollowingCh(token, user.fid);
      loggerSuccess(`Success get following by channel me`);
      loggerInfo(
         `@${username} Following Channel total is ${myFollowingCh.length}`
      );
      console.log();
      const { fid } = await inquirer.prompt({
         type: 'input',
         message: `insert target fid`,
         name: 'fid',
      });
      console.log();
      loggerInfo(`Get following Channel fid ${fid}`);
      const targetFollowingCh = await processGetFollowingCh(token, fid);
      loggerSuccess(`Success following Channel fid ${fid}`);
      loggerInfo(`Total following fid ${fid} ${targetFollowingCh.length}`);
      const nonFollowingChannel = targetFollowingCh.filter(
         (channel) => !myFollowingCh.includes(channel)
      );
      loggerInfo(`You will Following ${nonFollowingChannel.length} channel`);
      console.log();
      const { isWant } = await inquirer.prompt({
         type: 'confirm',
         message: `Do you want follow ${nonFollowingChannel.length} channel ?`,
         name: 'isWant',
      });
      console.log();
      if (isWant) {
         for (const channel of nonFollowingChannel) {
            const r = await followCh(token, channel);
            if (r.result.success == true) {
               loggerSuccess(`Success following Channel ${channel}`);
               const ms = 2000;
               await delay(ms);
            } else {
               loggerFailed(`Fail following Channel ${channel}`);
            }
         }
      } else {
         loggerInfo('stopped');
      }
   } catch (error) {
      console.log(error);
   }
})();
