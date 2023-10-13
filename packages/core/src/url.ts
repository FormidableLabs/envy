export function tryParseURL(url: string | URL, base?: string): URL | undefined {
  // implement cross platform `URL.canParse` since this function
  // only exists in the DOM and not in Node
  try {
    return new URL(url, base);
  } catch {}
}
