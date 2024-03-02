import axios from 'axios';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import dotenv from 'dotenv';
import delay from './src/utils/delay.js';
dotenv.config();
const sendNotifTele = async (text) => {
   const maxRetries = 3;
   let retryCount = 0;
   const BOT_TOKEN = process.env.BOT_TOKEN;
   const CHANNEL_CHAT_ID = process.env.CHANNEL_CHAT_ID;
   while (retryCount < maxRetries) {
      try {
         await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            `chat_id=${CHANNEL_CHAT_ID}&text=${text}`,
            {
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
               },
            }
         );

         loggerSuccess('success send log to telegram');
         await delay(2000);
         break;
      } catch (error) {
         loggerFailed('fail send notif');
         retryCount++;
         loggerInfo(`Retry attempt ${retryCount}`);
         if (error.message == 'Request failed with status code 429') {
            console.log(error.response.data.description);
            const ratelimitparam = `${error.response.data.parameters.retry_after}000`;
            await delay(parseInt(ratelimitparam));
         }
         if (retryCount === maxRetries) {
            loggerFailed('Max retries reached. Unable to send notification.');
            throw error;
         }

         await new Promise((resolve) => setTimeout(resolve, 1000));
      }
   }
};

// sendNotifTele();
export default sendNotifTele;
