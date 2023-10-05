import path from 'path';

import { NextjsTracingOptions } from '.';

// we don't actually care what the real shape is
type NextBuildOptions = { dir: string };
type NextConfig = Record<string, string> & {
  webpack: (config: WebpackConfig, options: NextBuildOptions) => WebpackConfig;
};

type WebpackEntry = Record<string, string | string[]>;

type WebpackConfig = {
  name: string;
  entry: () => Promise<WebpackEntry> | WebpackEntry;
  mode: 'development' | 'production';
  module?: {
    rules?: {
      test: RegExp;
      use: {
        loader: string;
        options: any;
      };
    }[];
  };
};

export function withEnvy(userNextConfig: NextConfig, envyConfig: NextjsTracingOptions) {
  return {
    ...userNextConfig,
    webpack: function (webpackConfig: WebpackConfig, nextBuildOptions: NextBuildOptions): WebpackConfig {
      // ignore production builds
      if (webpackConfig.mode === 'production') {
        return webpackConfig;
      }

      let customConfig = { ...webpackConfig };

      // execute the users custom webpack first
      if ('webpack' in userNextConfig && typeof userNextConfig.webpack === 'function') {
        customConfig = userNextConfig.webpack(webpackConfig, nextBuildOptions);
      }

      // setup module loader rules to inject the config
      customConfig.module = customConfig.module || {};
      customConfig.module.rules = customConfig.module.rules || [];

      // inject the envy global config
      customConfig.module.rules.unshift({
        test: /(web|server)\.loader\.js$/,
        use: {
          loader: path.resolve(__dirname, 'loaders', 'config.loader.js'),
          options: {
            ...envyConfig,
            serviceName: `${envyConfig.serviceName}:${webpackConfig.name}`,
          },
        },
      });

      // wrap react server components
      customConfig.module.rules.unshift({
        test: /[\\/]page\.(js|jsx|tsx)$/,
        use: {
          loader: path.resolve(__dirname, 'loaders', 'page.loader.js'),
          options: {
            ...envyConfig,
            serviceName: `${envyConfig.serviceName}:${webpackConfig.name}`,
          },
        },
      });

      // inject the sender libraries into the correct parts of the application
      const origEntryProperty = customConfig.entry;
      customConfig.entry = async () => {
        const customEntryProperty =
          typeof origEntryProperty === 'function' ? await origEntryProperty() : { ...(origEntryProperty as any) };

        const modulePath = path.dirname(require.resolve('@envyjs/nextjs'));

        // inject the web client sender
        if (webpackConfig.name === 'client') {
          const shim = path.join(modulePath, 'loaders', 'web.loader.js');

          // entry point for "pages" router "static/chunks/pages/_app.js" file
          shimEntryPoint(customEntryProperty, 'pages/_app', shim);

          // entry point for "app" router "static/chunks/main-app.js"
          shimEntryPoint(customEntryProperty, 'main-app', shim);
        }

        // inject the node.js server sender
        if (webpackConfig.name === 'server') {
          const shim = path.join(modulePath, 'loaders', 'server.loader.js');

          // entry point for pages router "server/pages/_app.js" file
          shimEntryPoint(customEntryProperty, 'pages/_app', shim);
        }

        return customEntryProperty;
      };

      return customConfig;
    },
  };
}

function shimEntryPoint(entry: WebpackEntry, name: string, shim: string) {
  let entryPoint = entry[name];
  if (entryPoint) {
    if (typeof entryPoint === 'string') {
      entryPoint = [shim, entryPoint];
    } else if (Array.isArray(entryPoint)) {
      if (!entryPoint.find(x => x.indexOf(shim) > -1)) {
        entryPoint = [shim, ...entryPoint];
      }
    }
    entry[name] = entryPoint;
  }
}
