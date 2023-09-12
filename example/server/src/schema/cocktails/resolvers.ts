import fetch from 'node-fetch';

export default {
  Query: {
    async randomCocktail() {
      const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
      const resp = await fetch(url);
      const json = await resp.json();
      const item = json.drinks[0];

      const ingredients = [];
      for (let i = 1; i <= 15; i += 1) {
        const ingredient = item[`strIngredient${i}`];
        if (!!ingredient) {
          ingredients.push(ingredient);
        }
      }

      const cocktail = {
        id: item.idDrink,
        name: item.strDrink,
        ingredients,
        instructions: item.strInstructions,
        imageUrl: item.strDrinkThumb,
      };

      return cocktail;
    },
  },
};
