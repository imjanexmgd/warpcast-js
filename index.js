import axios from 'axios';
import { loggerInfo, loggerSuccess } from './src/logger.js';
import delay from './src/delay.js';
import sendNotifTele from './sendTelegram.js';
import fs from 'fs';
import path from 'path';
const filePath = path.join(process.cwd(), 'acc.txt');
const acc = fs.readFileSync(filePath, 'utf-8');
const username = acc.split(' || ')[0];
const getThread = async (cursor) => {
   try {
      let params;
      if (!cursor) {
         params = new URLSearchParams({
            castHashPrefix: '0x237df661',
            username: 'deployer',
            limit: '100',
         });
      } else {
         params = new URLSearchParams({
            castHashPrefix: '0x237df661',
            username: 'deployer',
            limit: '100',
            cursor: `${cursor}`,
         });
      }
      const response = await axios.get(
         `https://client.warpcast.com/v2/user-thread-casts?${params}`,
         {
            headers: {
               'User-Agent':
                  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
               Accept: '*/*',
               'Accept-Language': 'en-US,en;q=0.5',
               'Accept-Encoding': 'gzip, deflate, br',
               Referer: 'https://warpcast.com/',
               'Content-Type': 'application/json; charset=utf-8',
               Authorization:
                  'Bearer MK-o8YusyvW3Y6L0jNcPJC9HxSmKHJoR4CclEn10CAKzdbD7csnMYutdkQR2Wd7td4a/4LoiDONbdJxiCNh5DRqlA==',
            },
         }
      );
      //    console.log(response.data.result.casts[2].replies.casts[0]);
      return response.data;
   } catch (error) {
      console.log(error.request.data);
      throw error;
   }
};
const getRandomMeatAmount = () => {
   return Math.floor(Math.random() * 10) + 1;
};
const replying = async (hash) => {
   try {
      const response = await axios.post(
         'https://client.warpcast.com/v2/casts',
         {
            text: '🍖'.repeat(getRandomMeatAmount()),
            parent: {
               //    hash: '0xb7fdce315681985e076b51f6fb5340d0108a00a8',
               hash: hash,
            },
            embeds: [],
         },
         {
            headers: {
               'User-Agent':
                  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
               Accept: '*/*',
               'Accept-Language': 'en-US,en;q=0.5',
               'Accept-Encoding': 'gzip, deflate, br',
               Referer: 'https://warpcast.com/',
               'Content-Type': 'application/json; charset=utf-8',
               Authorization:
                  'Bearer MK-o8YusyvW3Y6L0jNcPJC9HxSmKHJoR4CclEn10CAKzdbD7csnMYutdkQR2Wd7td4a/4LoiDONbdJxiCNh5DRqlA==',
            },
         }
      );
      // console.log(response.data.result);
      return response.data;
   } catch (error) {
      throw error;
   }
};

(async () => {
   try {
      process.stdout.write('\x1Bc');
      let thread = await getThread();
      let listCast = [];
      listCast.push(...thread.result.casts);
      if (thread.next) {
         while (true) {
            thread = await getThread(thread.next.cursor);
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
      loggerSuccess(`Success get ${listCast.length} cast`);
      await sendNotifTele(`Success get ${listCast.length} cast`);
      let i = 1;
      for (const key in listCast) {
         //   console.log(thread.result.casts[key]);
         if (listCast[key].parentHash) {
            if (listCast[key].author.username == username) {
               loggerInfo(
                  `skipping because it your own cast [${i}] / [${listCast.length}]`
               );
            } else {
               if (listCast[key].replies.casts.length > 0) {
                  const replyingCast = listCast[key].replies.casts;
                  // check is already reply
                  const filteredArray = replyingCast.filter(
                     (cast) => cast.author.username === username
                  );
                  if (filteredArray.length > 0) {
                     loggerInfo(
                        `skipping replying because ur already replying [${i}] / [${listCast.length}]`
                     );
                  } else {
                     const reply = await replying(listCast[key].hash);
                     const json = {
                        hash: reply.result.cast.hash,
                        timestamp: reply.result.cast.timestamp,
                        text: reply.result.cast.text,
                     };
                     loggerSuccess(
                        `SEND ${JSON.stringify(json)} [${i}] / [${
                           listCast.length
                        }]`
                     );
                     await sendNotifTele(
                        `SEND ${JSON.stringify(json)} [${i}] / [${
                           listCast.length
                        }]`
                     );
                     await delay(30000);
                  }
               } else {
                  const reply = await replying(listCast[key].hash);
                  const json = {
                     hash: reply.result.cast.hash,
                     timestamp: reply.result.cast.timestamp,
                     text: reply.result.cast.text,
                  };
                  loggerSuccess(
                     `SEND ${JSON.stringify(json)} [${i}] / [${
                        listCast.length
                     }]`
                  );
                  await sendNotifTele(
                     `SEND ${JSON.stringify(json)} [${i}] / [${
                        listCast.length
                     }]`
                  );
                  await delay(30000);
               }
            }
         } else {
            loggerInfo(
               `Skipping because not have parent [${i}] / [${listCast.length}]`
            );
         }
         i++;
      }
      await sendNotifTele(`Process done`);
   } catch (error) {
      await sendNotifTele(`Process closed, ${error.message}`);
      console.log(error);
   }
})();
