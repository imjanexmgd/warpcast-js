import axios from 'axios';
import { loggerSuccess, loggerFailed } from './src/utils/logger.js';
const frameAct = async () => {
  try {
    const { data } = await axios.post(
      'https://client.warpcast.com/v2/frame-action',
      {
        messageParams: {
          castFid: 18069,
          castHash: '0xb6fd36079c11843a5c1c814266d3ee5dc1f074a2',
          frameUrl:
            'https://xframes.web3.getpercs.com/cf/60bb835b-c3d0-4962-a0c9-1f5b4a723eb1/v1?ts=20241204034314761',
          postUrl:
            'https://xframes.web3.getpercs.com/cf/60bb835b-c3d0-4962-a0c9-1f5b4a723eb1/v1/8ba32c6e-2bd7-4cd0-ab4a-07e517de28db/19',
          buttonIndex: 1,
        },
        debug: false,
      },
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.8',
          authorization:
            'Bearer MK-8kFJZQBT0u1OI6vmi+f9lHohvyd074ZqO/iKdKAf8rvk2wTRtm9i05z6vSKVLcAwj71jlkZXJ4I6oay+pvIw8w==',
          'cache-control': 'no-cache',
          'content-type': 'application/json; charset=utf-8',
          'fc-amplitude-device-id': 'uZ8eElhFd3CJoaPPWYiZHC',
          'fc-amplitude-session-id': '1733282499981',
          'idempotency-key': 'efbef88c-eb98-0f96-ec93-aef92ce22614',
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
    return data;
  } catch (error) {
    throw error;
  }
};
(async () => {
  while (true) {
    try {
      const d = await frameAct();
      if (d) {
        console.log(d);
        loggerSuccess(d.data);
        break;
      }
    } catch (error) {
      loggerFailed(
        error.response.data.errors[0].message || 'fail frame action'
      );
    }
  }
})();
