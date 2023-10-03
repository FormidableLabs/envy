import { CatFactWidget } from '@/shared';
import { fetchCatFact } from '@/utils/query';

export async function CatFact() {
  const fact = await fetchCatFact();
  return <CatFactWidget fact={fact} />;
}
