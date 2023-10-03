import Link from 'next/link';

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
      <div className="flex">
        <div className="flex-1">
          <Link
            href="/next13app"
            className="text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            App Router
            <br />
            Example
          </Link>
        </div>
        <div className="flex-1">
          <Link
            href="/next13pages"
            className="text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            Pages Router
            <br />
            Example
          </Link>
        </div>
      </div>
    </main>
  );
}
