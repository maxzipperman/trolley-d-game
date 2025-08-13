export async function fetchWithRetry(url: string, retries = 3, backoff = 300) {
  let lastError: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      console.warn(`Fetch attempt ${attempt + 1} for ${url} failed`, err);
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, backoff * (attempt + 1)));
      }
    }
  }
  throw lastError;
}
