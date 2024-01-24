'use client';

const API_ROUTE_URL = 'http://localhost:3000/api/swapi';
const SWAPI_URL = 'https://swapi.dev/api/people/1';

export default function ApiRouteExample() {
  async function makeSwapiCall() {
    await fetch(API_ROUTE_URL);
  }

  const swapiUrl = <code className="text-pink-600 bg-pink-100 px-2 py-1 rounded-xl font-bold">{SWAPI_URL}</code>;
  const apiRouteUrl = (
    <code className="text-green-700 bg-green-100 px-2 py-1 rounded-xl font-bold">{API_ROUTE_URL}</code>
  );

  const button = (
    <button className="inline-block px-4 py-2 rounded-xl" onClick={makeSwapiCall}>
      Make SWAPI call
    </button>
  );

  return (
    <main className="container my-8 mx-auto">
      <div className="space-y-4">
        <h1>Calling an API route which makes an upstream request</h1>
        <p>Click the button to make a call to an API route from this page.</p>
        <p>
          This will call {apiRouteUrl}, where that API route will call {swapiUrl}
        </p>
      </div>
      <div className="mt-8">{button}</div>
    </main>
  );
}
