[![Envy — Formidable, We build the modern web](https://raw.githubusercontent.com/FormidableLabs/envy/main/envy-hero.png)](https://formidable.com/open-source/envy)

# Envy

Zero Config Node.js Telemetry &amp; Network Viewer

## Usage

Install the Envy ecosystem in your project using `yarn`, `npm`, or your favorite tool.

```
yarn add @envy/node @envy/browser
```

Import the tracing package into your applications entry point. These lines must be at the top of the file prior to any other import statements.

```
import { enableTracing } from '@envy/node';
enableTracing({ serviceName: 'name-of-your-app' });
```

Start your application and then launch the `@envy/browser` in a new terminal to start viewing network traces

```
npx start @envy/browser
```

## Development

Builds are executed using [TurboRepo](https://turbo.build/repo/docs) by running the following command

```
$ yarn build
```

and packages are automatically linked using [Yarn](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
