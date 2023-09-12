import fetch from 'node-fetch';

export default {
  Query: {
    async randomCatFact() {
      const url = 'https://cat-fact.herokuapp.com/facts';
      const resp = await fetch(url);
      const json = await resp.json();

      const allFacts = json.map((x: any) => ({
        id: x._id,
        fact: x.text,
      }));

      const randomIdx = Math.floor(Math.random() * allFacts.length);
      const randomFact = allFacts[randomIdx];

      return randomFact;
    },
  },
};
