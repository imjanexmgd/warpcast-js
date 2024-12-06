import axios from 'axios';
import { loggerFailed, loggerSuccess } from '../utils/logger.js';

export default async (token, castHash, idempotencyKey) => {
  try {
    const { data } = await axios.put(
      'https://client.warpcast.com/v2/recasts',
      {
        castHash: castHash,
      },
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.6',
          authorization: token,
          'cache-control': 'no-cache',
          'content-type': 'application/json; charset=utf-8',
          'idempotency-key': idempotencyKey,
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
      }
    );
    loggerSuccess(`success recast, hash ${data.result.castHash}`);
    return data;
  } catch (error) {
    const reason = error.response.data.errors[0].message || 'unkown';
    loggerFailed(`failed recast ${castHash} reason ${reason}`);
  }
};
