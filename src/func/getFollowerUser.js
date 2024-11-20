import axios from 'axios';

// const response = await
// });
export default async (token, fid, limit, cursor) => {
  let params;
  if (!cursor) {
    params = new URLSearchParams({
      // cursor: cursor || '',
      fid: fid,
      limit: limit,
    });
  } else {
    params = new URLSearchParams({
      cursor,
      fid: fid,
      limit: limit,
    });
  }
  const { data } = await axios.get(
    `https://client.warpcast.com/v2/followers?${params}`,
    {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        authorization: token,
        'cache-control': 'no-cache',
        'content-type': 'application/json; charset=utf-8',
        'fc-amplitude-device-id': 'uZ8eElhFd3CJoaPPWYiZHC',
        'fc-amplitude-session-id': '1732091657939',
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
};
