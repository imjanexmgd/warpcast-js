import axios from 'axios';

const castAtCh = async (token, channelKey, text) => {
  try {
    const response = await axios.post(
      'https://client.warpcast.com/v2/casts',
      {
        text: text,
        embeds: [],
        channelKey: channelKey,
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
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default castAtCh;
