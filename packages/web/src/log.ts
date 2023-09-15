/* eslint-disable no-console */

const { name } = require('../package.json');

export default {
  info: (msg: string, ...args: unknown[]) => console.log(`✅ %c${name} ${msg}`, 'color: green', ...args),
  warn: (msg: string, ...args: unknown[]) => console.log(`🚸 %c${name} ${msg}`, 'color: yellow', ...args),
  error: (msg: string, ...args: unknown[]) => console.log(`❌ %c${name} ${msg}`, 'color: red', ...args),
  debug: (msg: string, ...args: unknown[]) => console.log(`🔧 %c$${name} ${msg}`, 'color: cyan', ...args),
};
