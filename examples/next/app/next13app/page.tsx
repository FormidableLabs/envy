import { CatFact, Cocktail, Dogo } from '@/app/_components';
import { CatFactContainer, CocktailContainer, DogContainer } from '@/shared';

export default function Home() {
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
      <h3 className="m-5">Server Components</h3>
      <div className="content">
        <CatFact />
        <Cocktail />
        <Dogo />
      </div>
      <h3 className="m-5">Client Components</h3>
      <div className="content">
        <CatFactContainer />
        <CocktailContainer />
        <DogContainer />
      </div>
    </main>
  );
}
