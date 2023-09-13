import { CatFact, Cocktail, Dog } from './types';

export async function fetchCatFact(): Promise<string> {
  const res = await fetch('/api/cat-fact');
  const { data } = await res.json();
  return data;
}

export async function fetchRandomCocktail(): Promise<Cocktail> {
  const res = await fetch('/api/cocktail');
  const { data } = await res.json();
  return data;
}

export async function fetchRandomDog(): Promise<Dog> {
  const res = await fetch('/api/dog');
  const { data } = await res.json();
  return data;
}
