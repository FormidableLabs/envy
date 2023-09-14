/* eslint-disable no-console */
import chalk from 'chalk';

const { name } = require('../package.json');

export default {
  info: (msg: string, ...args: unknown[]) => console.log(chalk.green(`✅ ${name}`, msg), ...args),
  warn: (msg: string, ...args: unknown[]) => console.log(chalk.yellow(`🚸 ${name}`, msg), ...args),
  error: (msg: string, ...args: unknown[]) => console.log(chalk.red(`❌ ${name}`, msg), ...args),
  debug: (msg: string, ...args: unknown[]) => console.log(chalk.cyan(`🔧 ${name}`, msg), ...args),
};
