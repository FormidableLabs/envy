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
      customConfig.module.rules.push({
        test: /(web|server)\.loader\.js$/,
        use: {
          loader: path.resolve(__dirname, 'loaders', 'config.loader.js'),
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

          // entry point for "pages" router
          shimEntryPoint(customEntryProperty, 'main', shim);

          // entry point for "app" router
          shimEntryPoint(customEntryProperty, 'main-app', shim);
        }

        // inject the node.js server sender
        if (webpackConfig.name === 'server') {
          const shim = path.join(modulePath, 'loaders', 'server.loader.js');
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
  if (typeof entryPoint === 'string') {
    entryPoint = [shim, entryPoint];
  } else if (entryPoint?.length) {
    if (!entryPoint.find(x => x.indexOf(shim) > -1)) {
      entryPoint = [shim, ...entryPoint];
    }
  }
  entry[name] = entryPoint;
}
