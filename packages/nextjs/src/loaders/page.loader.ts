export default function envyPageLoader(this: any, source: string) {
  const options = this.getOptions();
  const injectedCode = `
    const { enableTracing } = require('@envyjs/nextjs');
    enableTracing(${JSON.stringify(options)});
  `;
  return `${injectedCode}\n${source}`;
}
