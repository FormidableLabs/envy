import CatFact from './components/CatFact';
import Cocktail from './components/Cocktail';
import RandomDogImage from './components/RandomeDogImage';

function App() {
  return (
    <main className="container my-8 mx-auto">
      <h1>Envy - Example website with Express server</h1>
      <p>
        This website will make calls to the example express server, which will send request telemetry over websockets
        for Envy to display in one of the Network Viewer UIs.
      </p>
      <hr className="my-8" />
      <div className="content">
        <CatFact />
        <Cocktail />
        <RandomDogImage />
      </div>
    </main>
  );
}

export default App;
