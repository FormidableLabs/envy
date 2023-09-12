import fetch from 'node-fetch';

export default {
  Query: {
    async latestXkcd() {
      const url = 'https://xkcd.com/info.0.json';
      const resp = await fetch(url);
      const json = await resp.json();
      const item = json;

      const xkcd = {
        id: Buffer.from(item.img).toString('base64'),
        title: item.title,
        imageUrl: item.img,
      };

      return xkcd;
    },
  },
};
