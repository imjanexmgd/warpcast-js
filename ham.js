import fs from 'fs';
import inquirer from 'inquirer';
import getFeed from './src/func/getFeed.js';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import replyingCast from './src/func/replyingCast.js';
import getThread from './src/func/getThread.js';
import delay from './src/utils/delay.js';
import sendNotifTele from './sendTelegram.js';
const jsonList = fs.readFileSync('acc.json');
const listed = JSON.parse(jsonList);
const ms = 60000;
const processPerThread = async (
   username,
   token,
   Fullhash,
   castHashPrefix,
   usernametarg
) => {
   try {
      let thread = await getThread(token, castHashPrefix, usernametarg);
      let listCast = [];
      listCast.push(...thread.result.casts);
      if (thread.next) {
         while (true) {
            thread = await getThread(
               token,
               castHashPrefix,
               usernametarg,
               thread.next.cursor
            );
            loggerInfo(`push ${thread.result.casts.length} cast to listcast`);
            const { casts } = thread.result;
            for (const key in casts) {
               listCast.push(casts[key]);
            }
            if (thread.next) {
               loggerInfo(`Next cursor`);
            } else {
               loggerInfo(`No cursor, scraping stopped`);
               break;
            }
         }
      }
      const filteredArray = listCast.filter((cast) => {
         cast.author.username === username;
      });
      if (filteredArray.length > 0) {
         loggerInfo(`Skipping Reply ${listCast[0].hash} because already reply`);
      } else {
         try {
            loggerInfo(`Replying ${Fullhash}`);
            await replyingCast(token, Fullhash);
            await delay(ms);
         } catch (error) {
            loggerFailed(`Failed replying ${Fullhash}, ${error.message}`);
         }
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
      const selectedUser = listed.find((item) => item.username === selected);
      const { token, username } = selectedUser;
      let totalLooping = 1;
      while (true) {
         let feed;
         let i = 1;
         feed = await getFeed(token);
         if (feed.result.items.length == 0) {
            loggerInfo('No feed again');
            return;
         }
         let excludeitem = [];
         let idHash;
         let timestamp;
         if (feed.result.items.length == 0) {
            return console.log('No feed');
         }
         timestamp = feed.result.latestMainCastTimestamp;
         for (const key in feed.result.items) {
            loggerInfo(`PROGRESS [${i} / ${feed.result.items.length}]`);
            const { items } = feed.result;
            const { id } = items[key];
            idHash = id.substring(2, 10);
            excludeitem.push(idHash);
            if (items[key].pinned) {
               loggerInfo(`skipping hash ${id}, because its is pinned`);
            } else {
               await processPerThread(
                  username,
                  token,
                  id,
                  id.substring(0, 10),
                  items[key].cast.author.username
               );
            }
            i++;
            loggerInfo('stopping thread');
         }
         while (true) {
            i = 1;
            loggerInfo('Starting fetch again');
            feed = await getFeed(listed[0].token, timestamp, excludeitem);
            if (feed.result.items.length == 0) {
               console.log('no feed');
               break;
            }
            timestamp = feed.result.latestMainCastTimestamp;
            for (const key in feed.result.items) {
               loggerInfo(`PROGRESS [${i} / ${feed.result.items.length}]`);
               const { items } = feed.result;
               const { id } = items[key];
               idHash = id.substring(2, 10);
               excludeitem.push(idHash);
               if (items[key].pinned) {
                  console.log(`skipping hash ${id}, because its is pinned`);
               } else {
                  const { username } = items[key].cast.author;
                  await processPerThread(
                     username,
                     token,
                     id,
                     id.substring(0, 10),
                     items[key].cast.author.username
                  );
               }
               i++;
            }
         }

         loggerSuccess(`Process done looping= ${totalLooping}`);
         await sendNotifTele(`Process done looping channel ${totalLooping}`);
         await delay(1800000);
         if (totalLooping == 3) {
            break;
         }
         totalLooping++;
         continue;
      }
      await sendNotifTele(
         'Process done with total looping channel = ' + totalLooping
      );
   } catch (error) {
      console.log(error);
      await sendNotifTele('Process closed because error');
      return;
   }
})();
