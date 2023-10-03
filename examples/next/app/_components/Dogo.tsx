import { DogWidget } from '@/shared';
import { fetchRandomDog } from '@/utils/query';

export async function Dogo() {
  const comic = await fetchRandomDog();
  return <DogWidget dogo={comic} />;
}
