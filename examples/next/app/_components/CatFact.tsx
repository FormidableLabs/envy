import { fetchCatFact } from '@/utils/query';

export async function CatFact() {
  const { text } = await fetchCatFact();

  return (
    <div className="thingy">
      <h2>Random cat fact:</h2>
      <p>{text}</p>
    </div>
  );
}
