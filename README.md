[![Envy — Formidable, We build the modern web](https://raw.githubusercontent.com/FormidableLabs/envy/main/envy-hero.png)](https://formidable.com/open-source/envy)

# Envy

Zero Config Node.js Telemetry &amp; Network Viewer

## Usage

There are two parts to using Envy:

1. Install and run the viewer
2. Install and run one or more senders

### Running the browser viewer

The `@envy/browser` package allows you to start a web socket server and a browser-based application to display traces sent by various sender packages. You should install it like this:

For now, this can be run from this repo by running

```
yarn workspace @envy/broswer start
```

TODO: Allow this package to be installed and run standalone from another codebase.

### Sending traces from a node-based application

Install the `@envy/node` sender package in your node application:

```
yarn add @envy/node
```

Import and invoke the `enableTracing` function to the root of your app before any other code.

```ts
import { enableTracing } from '@envy/node';
enableTracing({ serviceName: 'your-node-app-name' });

// ... your app code
```

### Sending traces froma website

Install the `@envy/web` sender package in your website:

```
yarn add @envy/web
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

## Development

Builds are executed using [TurboRepo](https://turbo.build/repo/docs) by running the following command

```
$ yarn build
```

and packages are automatically linked using [Yarn](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
