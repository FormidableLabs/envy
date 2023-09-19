<div align="center">
  <a href="https://formidable.com/open-source/" target="_blank">
    <img alt="Envy — Formidable, We build the modern web" src="https://raw.githubusercontent.com/FormidableLabs/envy/main//envy-hero.png" />
  </a>

  <strong>
    Zero Config Node.js Telemetry &amp; Network Viewer
  </strong>

  <br />
  <br />
</div>

# Envy

## Contents

- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Getting Started

### 1. Install the Envy Browser to view application telemetry in your browser

```sh
# npm
$ npm i --save-dev @envy/browser
# or yarn
$ yarn add --dev @envy/browser
```

### 2. Install a telemetry package for your application

- [Node.js Application](#nodejs-application)
- [Web Client Application](#web-client-application)

### 3. Run the browser and start collecting telemetry

Run the browser in a seperate terminal session

```
npx @envy/browser
```

or optionally, add it to your NPM scripts using a tool like [concurrently](https://www.npmjs.com/package/concurrently)

```json
"scripts": {
  "start": "<your application start command>",
  "start:withenvy": "concurrently \"npx @envy/browser\" \"npm start\""
},
```

## Available Telemetry Packages

### Node.js Application

Install the `@envy/node` sender package in your node application:

```sh
# npm
$ npm i --save-dev @envy/node
# or yarn
$ yarn add --dev @envy/node
```

Import and invoke the `enableTracing` function to the root of your app before any other code.

```ts
import { enableTracing } from '@envy/node';
enableTracing({ serviceName: 'your-node-app-name' });

// ... your app code
```

### Web Client Application

Install the `@envy/web` sender package in your website:

```sh
# npm
$ npm i --save-dev @envy/web
# or yarn
$ yarn add --dev @envy/web
```

Import the `enableTracing` function to the root of your app, and invoke it before mounting your application.

For example, in a simple React application:

```ts
import { enableTracing } from '@envy/web';
import { createRoot } from 'react-dom/client';

import { App } from './App';

const container = document.getElementById('app');
const root = createRoot(container);

enableTracing({ serviceName: 'your-website-name' }).then(() => {
  root.render(<App />);
});
```

## Contributing

Please see the [Contributing guide](CONTRIBUTING.md).

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome.
