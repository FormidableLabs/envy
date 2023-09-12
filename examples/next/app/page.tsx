import {
  CatFact,
  Cocktail,
  RandomDogImage,
  ClientSideCatFact,
  ClientSideCocktail,
  ClientSideRandomDogImage,
} from '@/components';

export default function Home() {
  return (
    <main className="container my-8 mx-auto">
      <div>
        <h1>Envy - Example website with Next JS</h1>
        <p>
          This website will make calls to the example Next JS, which will send request telemetry over websockets for
          Envy to display in one of the Network Viewer UIs.
        </p>
      </div>
      <hr className="my-8" />
      <h3 className="m-5">Server Components</h3>
      <div className="content">
        <CatFact />
        <Cocktail />
        <RandomDogImage />
      </div>
      <h3 className="m-5">Client Components</h3>
      <div className="content">
        <ClientSideCatFact />
        <ClientSideCocktail />
        <ClientSideRandomDogImage />
      </div>
    </main>
  );
}
