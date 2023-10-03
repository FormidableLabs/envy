import { fetchCatFact, fetchRandomCocktail, fetchRandomDog } from '@/utils/query';
import { CatFact, Cocktail, Dog } from '@/utils/types';
import { CatFactContainer, CocktailContainer, DogContainer } from '@/shared';

type Props = { fact: CatFact; cocktail: Cocktail; dog: Dog };

export default function Home({ fact, cocktail, dog }: Props) {
  return (
    <main className="container my-8 mx-auto">
      <div>
        <h1>Envy - Example website with Next JS</h1>
        <p>
          This website will make calls to a few endpoints using server render components, which will send request
          telemetry over websockets for Envy to display in one of the Network Viewer UIs.
        </p>
      </div>
      <hr className="my-8" />
      <div className="content">
        <CatFactContainer initialCatFact={fact} />
        <CocktailContainer initialCocktail={cocktail} />
        <DogContainer initialDog={dog} />
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const fact = await fetchCatFact();
  const dog = await fetchRandomDog();
  const cocktail = await fetchRandomCocktail();

  return {
    props: {
      fact,
      cocktail,
      dog,
    },
  };
}
