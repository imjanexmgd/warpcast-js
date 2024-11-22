import axios from 'axios';
import { loggerFailed, loggerSuccess } from '../utils/logger.js';
export default async (token, castHash) => {
  try {
    const { data } = await axios.delete(
      'https://client.warpcast.com/v2/casts',
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.6',
          authorization: token,
          'cache-control': 'no-cache',
          'content-type': 'application/json; charset=utf-8',
          'fc-amplitude-device-id': 'uZ8eElhFd3CJoaPPWYiZHC',
          'fc-amplitude-session-id': '1732286726426',
          'idempotency-key': '46e78fbe-1ebf-5801-941d-e59a2fee39e1',
          origin: 'https://warpcast.com',
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: 'https://warpcast.com/',
          'sec-ch-ua':
            '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
        data: {
          castHash: `${castHash}`,
        },
      }
    );
    if (data.result.success == true) {
      loggerSuccess(`success delete cast ${castHash}`);
    } else {
      loggerFailed(`failed delete cast ${castHash}`);
    }
    return data;
  } catch (error) {
    loggerFailed('failed deleting data');
    console.log(error);
    console.log(error.response.data);

    loggerFailed(error.response.data.errors.message || 'unkown error');
    throw error;
  }
};
