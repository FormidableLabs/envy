type SafeParseJsonResult<T> = {
  value?: T;
  error?: any;
};

export function safeParseJson<T = any>(data: string | null | undefined): SafeParseJsonResult<T> {
  if (!data) return {};
  try {
    const value = JSON.parse(data) as T;
    return { value };
  } catch (error) {
    return { error };
  }
}
