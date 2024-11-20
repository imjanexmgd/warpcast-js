import getMe from './src/func/getMe.js';
import inquirer from 'inquirer';
import fs from 'fs';
import getFollowerUser from './src/func/getFollowerUser.js';
import { loggerInfo, loggerSuccess } from './src/utils/logger.js';
import random from 'random';
import castHome from './src/func/castHome.js';
import delay from './src/utils/delay.js';
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
    console.log(`AUTO CAST CH BY FOLLOWING CH\ncreated with ♡ by janexmgd`);
    const me = await getMe(token);
    let listFollowerUsername = [];
    let followers;
    let cursor = null;
    while (true) {
      followers = await getFollowerUser(
        token,
        me.result.user.fid,
        '500',
        cursor
      );
      for (const item of followers.result.users) {
        listFollowerUsername.push(item.username);
      }
      if (followers.next) {
        cursor = followers.next.cursor;
        loggerInfo(`cursor = ${cursor}`);
        continue;
      }

      break;
    }
    const textTemplate = fs
      .readFileSync('socialTextTemplate.txt', 'utf-8')
      .replace(/\r/g, '')
      .split('\n');

    for await (const [
      index,
      followersUsername,
    ] of listFollowerUsername.entries()) {
      loggerInfo(
        `PROCESSING ${followersUsername}  ${index + 1} >> ${
          listFollowerUsername.length
        } `
      );
      const text = random
        .choice(textTemplate)
        .replace(/@username/g, `@${followersUsername}`);
      loggerInfo(text);
      const castAct = await castHome(token, text);
      loggerSuccess(`Success cast ${castAct.result.cast.hash}`);
      const int = random.integer(15, 25);
      const ms = int * 1000;
      await delay(ms);
    }
  } catch (error) {
    console.log(error);
  }
})();
