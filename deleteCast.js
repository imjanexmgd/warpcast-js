import getMe from './src/func/getMe.js';
import inquirer from 'inquirer';
import fs from 'fs';
import getAllProfileCast from './src/func/getAllProfileCast.js';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import random from 'random';
import delay from './src/utils/delay.js';
import deleteCast from './src/func/deleteCast.js';
import { randomUUID } from 'crypto';
(async () => {
  try {
    process.stdout.write('\x1Bc');
    const jsonList = fs.readFileSync('acc.json');
    const listed = JSON.parse(jsonList);
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
    console.log(`AUTO Delete cast`);
    console.log(`Processing ${username}`);

    const me = await getMe(token);
    let listCasts = [];
    let cast;
    let cursor = null;
    while (true) {
      cast = await getAllProfileCast(token, me.result.user.fid, '500', cursor);
      loggerInfo(`success get ${cast.result.casts.length} cast`);
      for (const item of cast.result.casts) {
        const itemText = item.text;
        const itemHash = item.hash;
        listCasts.push({
          hash: itemHash,
          text: itemText,
        });
      }
      if (cast.next) {
        cursor = cast.next.cursor;
        loggerInfo(`cursor = ${cursor}`);
        continue;
        // break;
      }

      break;
    }
    // return;
    loggerInfo(`Total Cast ${listCasts.length}`);
    // const filteredMessages = listCasts.filter((item) => {
    //   const message = item.text.toLowerCase();
    //   return message.startsWith('claiming my @socialtoken airdrop');
    // });
    // console.log(filteredMessages);
    // for await (const [index, item] of filteredMessages.entries()) {
    //   const num = index + 1;
    //   loggerInfo(`PROCESSING ${num} / ${filteredMessages.length}`);
    //   loggerInfo(`cast hash ${item.hash}`);
    //   loggerInfo(`deleting ${item.hash}`);
    //   await deleteCast(token, item.hash);
    // }
    for await (const [index, item] of listCasts.entries()) {
      const num = index + 1;
      const idempotencyKey = randomUUID();
      loggerInfo(`PROCESSING ${num} / ${listCasts.length}`);
      loggerInfo(`cast hash ${item.hash}`);
      loggerInfo(`cast text : ${item.text}`);
      loggerInfo(`deleting ${item.hash}`);
      try {
        await deleteCast(token, item.hash, idempotencyKey);
      } catch (error) {
        loggerFailed(error.response.data.errors[0].message || 'unkown error');
      }
      loggerSuccess(`Success deleting cast ${item.hash}`);
      const int = random.integer(5, 9);
      const ms = int * 1000;
      await delay(ms);
    }
    return;
    for await (const [index, item] of listCasts.entries()) {
      const num = index + 1;
      loggerInfo(`PROCESSING ${num} / ${listCasts.length}`);
      loggerInfo(`cast hash ${item.hash}`);
      loggerInfo('check text prefix');
      // changing text if you want change text filter
      const testPrefix = /^Claiming my @socialtoken airdrop/i.test(item.text);
      if (testPrefix === true) {
        loggerInfo(`deleting ${item.hash}`);
        await deleteCast(token, item.hash);
        // await delay(1000);
      } else {
        loggerInfo(`skipping ${item.hash}`);
      }
      if (num % 100 == 0) {
        const int = random.integer(5, 9);
        const ms = int * 1000;
        await delay(ms);
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
