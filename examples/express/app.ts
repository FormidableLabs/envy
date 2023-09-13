import express from 'express';

const app = express();
const port = 4000;

app.get('/api/cat-fact', async (_, response) => {
  const res = await fetch('https://cat-fact.herokuapp.com/facts');
  const data = await res.json();
  const allFacts = data.map((fact: { _id: string; text: string }) => ({
    id: fact._id,
    text: fact.text,
  }));
  const randomIdx = Math.floor(Math.random() * allFacts.length);
  return response.send({ data: allFacts[randomIdx].text });
});

app.get('/api/cocktail', async (_, response) => {
  const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
  const resp = await fetch(url);
  const json = await resp.json();
  const item = json.drinks[0];

  const ingredients = [];
  for (let i = 1; i <= 15; i += 1) {
    const ingredient = item[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  return response.send({
    data: {
      id: item.idDrink,
      name: item.strDrink,
      ingredients,
      instructions: item.strInstructions,
      imageUrl: item.strDrinkThumb,
    },
  });
});

app.get('/api/dog', async (_, response) => {
  const url = 'https://dog.ceo/api/breeds/image/random';
  const resp = await fetch(url);
  const item = await resp.json();

  return response.send({
    data: {
      imageUrl: item.message,
    },
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Express Sever running on http://localhost:${port}`));
