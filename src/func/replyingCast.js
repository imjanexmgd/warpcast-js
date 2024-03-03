import axios from 'axios';
import { loggerSuccess, loggerFailed } from '../utils/logger.js';
const randomText = () => {
   try {
      //    return '🍖'.repeat(Math.floor(Math.random() * 20) + 1);
      // return `🍖x${Math.floor(Math.random() * (1000 - 10 + 1)) + 10}`;
      return `🍖 x ${Math.floor(Math.random() * (1000 - 10 + 1)) + 10}`;
   } catch (error) {
      throw error;
   }
};
const replyingCast = async (token, hash) => {
   try {
      const text = randomText();
      const response = await axios.post(
         'https://client.warpcast.com/v2/casts',
         {
            text: text,
            parent: {
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
               Authorization: token,
            },
         }
      );
      loggerSuccess(`Success replying ${hash} with text ${text}`);
      return response.data;
   } catch (error) {
      loggerFailed(`Replying cast error, ${error.message}`);
      throw error;
   }
};
export default replyingCast;
