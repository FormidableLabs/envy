import { CatFact, Cocktail, Dog } from './types';

export async function fetchCatFact(): Promise<CatFact> {
  const res = await fetch('https://cat-fact.herokuapp.com/facts');
  const data = await res.json();
  const allFacts = data.map((fact: CatFact) => ({
    id: fact._id,
    text: fact.text,
  }));

  const randomIdx = Math.floor(Math.random() * allFacts.length);
  return allFacts[randomIdx];
}

export async function fetchRandomCocktail(): Promise<Cocktail> {
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

  return {
    id: item.idDrink,
    name: item.strDrink,
    ingredients,
    instructions: item.strInstructions,
    imageUrl: item.strDrinkThumb,
  };
}

export async function fetchRandomDog(): Promise<Dog> {
  const url = 'https://dog.ceo/api/breeds/image/random';
  const resp = await fetch(url);
  const item = await resp.json();

  return {
    imageUrl: item.message,
  };
}
