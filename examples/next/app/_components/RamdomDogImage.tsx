import { fetchRandomDog } from '@/utils/query';

export async function RandomDogImage() {
  const comic = await fetchRandomDog();

  return (
    <div className="thingy">
      <h2>Random Dog Image:</h2>
      <div>
        <img src={comic.imageUrl} />
      </div>
    </div>
  );
}
