import axios from 'axios';
import delay from './src/utils/delay.js';
import sendNotifTele from './sendTelegram.js';
(async () => {
   try {
      process.stdout.write('\x1Bc');
      console.log(`-------checker allowance-------`);
      while (true) {
         const response = await axios.get(
            'https://farcaster.dep.dev/lp/tips/377225',
            {
               headers: {
                  'User-Agent':
                     'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
                  Accept: '*/*',
                  'Accept-Language': 'en-US,en;q=0.5',
                  'Accept-Encoding': 'gzip, deflate, br',
                  Referer: 'https://based.thelp.xyz/',
                  Origin: 'https://based.thelp.xyz',
                  Connection: 'keep-alive',
                  'Sec-Fetch-Dest': 'empty',
                  'Sec-Fetch-Mode': 'cors',
                  'Sec-Fetch-Site': 'cross-site',
               },
            }
         );
         console.log(response.data);
         const { allowance, used, received } = response.data;
         await sendNotifTele(
            `info notif acc @janex\nalllowance : ${allowance},\nused : ${used},\nreceived : ${received}`
         );
         await delay(900000);
      }
   } catch (error) {
      console.log(error);
   }
})();
