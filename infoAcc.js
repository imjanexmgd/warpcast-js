import axios from 'axios';
import delay from './src/utils/delay.js';
import sendNotifTele from './sendTelegram.js';
const checkPoint = async () => {
   try {
      const response = await axios.post(
         'https://farcaster.dep.dev/lp/auth',
         {
            state: 'completed',
            nonce: '3bwzNAFuqtZDoibO8',
            message:
               'based.thelp.xyz wants you to sign in with your Ethereum account:\n0x34Cb47EB06A31A6FfdC8B1E7B27fAAB9776c52Bc\n\nFarcaster Connect\n\nURI: https://based.thelp.xyz\nVersion: 1\nChain ID: 10\nNonce: 3bwzNAFuqtZDoibO8\nIssued At: 2024-03-01T14:12:07.434Z\nResources:\n- farcaster://fid/377225',
            signature:
               '0x1599158bd4028cd5e136f9c8311e02ba523efd6d3e191cff7deee556a246f47f03efa0e20ba49ba577bbf60146090de4ab63d884777392d4d6ce3a16e2720bab1b',
            fid: 377225,
            username: 'janex',
            displayName: 'janexmgd',
            bio: 'no life',
            pfpUrl: 'https://i.imgur.com/eeqh7ji.jpg',
            custody: '0x34Cb47EB06A31A6FfdC8B1E7B27fAAB9776c52Bc',
            verifications: [],
         },
         {
            headers: {
               'User-Agent':
                  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
               Accept: '*/*',
               'Accept-Language': 'en-US,en;q=0.5',
               'Accept-Encoding': 'gzip, deflate, br',
               Referer: 'https://based.thelp.xyz/',
               'Content-Type': 'application/json',
               Origin: 'https://based.thelp.xyz',
               Connection: 'keep-alive',
               'Sec-Fetch-Dest': 'empty',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Site': 'cross-site',
               TE: 'trailers',
            },
         }
      );
      console.log(response.data);
      return response.data;
   } catch (error) {
      throw error;
   }
};
const checkAllowance = async () => {
   try {
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
      return response.data;
   } catch (error) {
      throw error;
   }
};
(async () => {
   try {
      process.stdout.write('\x1Bc');
      console.log(`-------checker allowance-------`);
      while (true) {
         let currentTime = new Date();

         let jakartaOffset = 7 * 60;
         let jakartaTime = new Date(
            currentTime.getTime() + jakartaOffset * 60 * 1000
         );
         let formattedTime = jakartaTime
            .toISOString()
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '');

         const point = await checkPoint();
         const cAllowance = await checkAllowance();
         const { _id, fid, score, username } = point.user;
         const { allowance, used, received } = cAllowance;
         const txt = `info acc\n\n${formattedTime}\n\nACCOUNT INFO\n_id : ${_id}\nfid : ${fid}\nusername : ${username}\nscore : ${score}\n--------------------\nALLOWANCE\nalllowance : ${allowance},\nused : ${used},\nreceived : ${received}`;

         await sendNotifTele(txt);
         await delay(900000);
      }
   } catch (error) {
      await sendNotifTele(error.message);
      console.log(error);
   }
})();
