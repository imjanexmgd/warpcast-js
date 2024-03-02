import axios from 'axios';

const getFeed = async (token, timestamp, excludeitem) => {
   try {
      let data;
      if (!timestamp) {
         data = {
            feedKey: 'lp',
            viewedCastHashes: '',
            updateState: true,
         };
      } else {
         data = {
            feedKey: 'lp',
            olderThan: timestamp,
            latestMainCastTimestamp: timestamp,
            excludeItemIdPrefixes: excludeitem,
            viewedCastHashes: '',
            updateState: true,
         };
      }
      const response = await axios.post(
         'https://client.warpcast.com/v2/feed-items',
         data,
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
      return response.data;
   } catch (error) {
      throw error;
   }
};
export default getFeed;
