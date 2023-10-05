export default function envyWebpackLoader(this: any, source: string) {
  const options = this.getOptions();

  let injectedCode = 'var _envGlobalObject = typeof window === "undefined" ? global : window;\n';
  injectedCode += `_envGlobalObject.envy=${JSON.stringify(options)};\n`;
  return `${injectedCode}\n${source}`;
}
