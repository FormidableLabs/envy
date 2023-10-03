import { CocktailWidget } from '@/shared';
import { fetchRandomCocktail } from '@/utils/query';

export async function Cocktail() {
  const cocktail = await fetchRandomCocktail();
  return <CocktailWidget cocktail={cocktail} />;
}
