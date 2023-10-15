import path from 'path';
import fs from 'fs';

const MOCKS_DIRECTORY = "__storybook__mocks__";

// based on https://github.com/gebeto/storybook-addon-manual-mocks
// modified to work with a different directory to avoid
// conflicts with jest mocks
export async function viteFinal(config) {
  const { mergeConfig } = await import("vite");
  function parcelMocksPlugin() {
    return {
      name: "mocks-plugin",
      load(_importPath) {
        const importPath = _importPath.replace(/\0/g, "");
        const basePath = path.parse(importPath);
        const mockPath = path.join(
          basePath.dir,
          MOCKS_DIRECTORY,
          basePath.base
        );
        const isReplacementPathExists = fs.existsSync(mockPath);
        if (isReplacementPathExists) {
          return fs.readFileSync(mockPath, { encoding: "utf8" });
        }
      },
    };
  }

  return mergeConfig(config, {
    plugins: [parcelMocksPlugin()],
  });
}
