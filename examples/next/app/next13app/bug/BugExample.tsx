'use client';

import { SWAPI_URL } from '@/app/api/swapi/route';

const API_ROUTE_URL = 'http://localhost:3000/api/swapi';

export default function BugExample() {
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
      <div>
        <h1>Envy - Potential bug with Next JS</h1>
        <p className="font-bold">Follow the steps to observe the bug:</p>
      </div>
      <div className="mt-8 ml-8">
        <ol className="list-decimal space-y-8">
          <li>Make sure you're running the Envy web viewer and that this app is connected.</li>
          <li>
            Click the {button} button to make a call to the {apiRouteUrl} API route from this page
          </li>
          <li>
            Observe in Envy that one call is made to {apiRouteUrl} and one call is made to {swapiUrl}
          </li>
          <li>Reload this page (Cmd+R or Ctrl+R)</li>
          <li>Click the {button} button again to make another call to the API endpoint from this page.</li>
          <li>
            Observe in Envy this time that <span className="font-bold">two</span> calls to {swapiUrl} are shown as being
            made
          </li>
          <li>Keep clicking the button; it will always be two calls to {swapiUrl} that are shown as being made</li>
          <li>
            At this point, you can even open the API route{' '}
            <a href={API_ROUTE_URL} target="_blank" className="underline underline-offset-4">
              {apiRouteUrl}
            </a>{' '}
            in another tab and see that the call to {swapiUrl} is showing in Envy as being made twice 🤯...
          </li>
          <li>
            Keep reloading the page, and maybe even edit the code for this page (whilst running <code>next dev</code>)
            and you will notice that the number of calls to {swapiUrl} increases for each call to {apiRouteUrl}
          </li>
        </ol>
      </div>
    </main>
  );
}
