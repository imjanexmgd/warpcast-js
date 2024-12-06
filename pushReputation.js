import inquirer from 'inquirer';
import fs from 'fs';
import { randomUUID } from 'crypto';
import random from 'random';

import { loggerFailed, loggerSuccess, loggerInfo } from './src/utils/logger.js';
import delay from './src/utils/delay.js';
import getMe from './src/func/getMe.js';
import castHome from './src/func/castHome.js';
import likeCast from './src/func/likeCast.js';
import recastCast from './src/func/recastCast.js';
const clear = () => {
  process.stdout.write('\x1Bc');
};
(async () => {
  try {
    clear();
    const jsonList = fs.readFileSync('acc.json');
    const listed = JSON.parse(jsonList);
    const listLive = [];
    const listDie = [];
    loggerInfo(`Checking each list token`);
    for await (const [index, list] of listed.entries()) {
      try {
        loggerInfo(`check ${listed[index].username} token`);
        const me = await getMe(list.token);
        loggerSuccess(`${me.result.user.username} token LIVE`);
        listLive.push({
          username: me.result.user.username,
          token: list.token,
          fid: me.result.user.fid,
        });
      } catch (error) {
        loggerFailed(`${listed[index].username} token DIE`);
        listDie.push({
          username: list.username,
          token: list.token,
        });
      }
    }
    if (listDie.length !== 0) {
      loggerFailed(
        `Found ${listDie.length} token expired or die, please fix first`
      );
      console.log(listDie);
      return;
    }
    clear();
    console.log(`
+++++++++++++++++++++++++++++++++++++++++++
+                                         +
+                                         +
+        WARPCAST PUSH REPUTATION         +
+        MADE WITH  ♡ BY JANEXMGD         +
+                                         +
+                                         +
+++++++++++++++++++++++++++++++++++++++++++
            `);
    while (true) {
      const list = listLive.map((item) => item.username);
      const { selected } = await inquirer.prompt({
        type: 'list',
        message: 'Select username to create cast',
        name: 'selected',
        choices: list,
      });
      const selectedUser = listLive.find((item) => item.username === selected);
      const { token } = selectedUser;
      const { inputCast } = await inquirer.prompt({
        type: 'input',
        message: 'Input your text to cast',
        name: 'inputCast',
      });
      const doCast = await castHome(token, inputCast);
      loggerSuccess(`Success creating cast (${doCast.result.cast.hash})`);
      const targetCast = {
        author: doCast.result.cast.author.username,
        hash: doCast.result.cast.hash,
      };
      const listNotContainAuthor = listLive.filter(
        (item) => item.username != targetCast.author
      );
      // change listNotContainAuthor to listLive is you want include accont who create cast
      for (const acc of listNotContainAuthor) {
        try {
          loggerInfo(`interact with ${acc.username}`);
          loggerInfo(`trying like cast (${targetCast.hash})`);
          await likeCast(acc.token, targetCast.hash, randomUUID());
          loggerInfo(`trying recast cast (${targetCast.hash})`);
          await recastCast(acc.token, targetCast.hash, randomUUID());
          const int = random.integer(5, 7);
          const ms = int * 1000;
          await delay(ms);
        } catch (error) {
          loggerFailed(`fail using ${acc.username}` || error.message);
        }
      }
      const { isMore } = await inquirer.prompt({
        type: 'confirm',
        message: 'do you want other account ?',
        name: 'isMore',
      });
      if (isMore) {
        continue;
      }
      break;
    }
  } catch (error) {
    loggerFailed(error.message);
    console.error(error);
  }
})();
