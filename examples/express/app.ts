import express from 'express';

const app = express();
const port = 3000;

app.get('/', async (_, response) => {
  const res = await fetch('https://cat-fact.herokuapp.com/facts');
  const data = await res.json();
  const allFacts = data.map((fact: { _id: string; text: string }) => ({
    id: fact._id,
    text: fact.text,
  }));
  const randomIdx = Math.floor(Math.random() * allFacts.length);
  return response.send(allFacts[randomIdx].text);
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Express Sever running on http://localhost:3000`));
