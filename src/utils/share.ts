export function constructShareText(scoreA: number, scoreB: number) {
  const url = window.location.origin;
  return `I scored Track A ${scoreA} vs Track B ${scoreB} in Trolley’d! Play here: ${url}`;
}

export async function shareResults(scoreA: number, scoreB: number) {
  const text = constructShareText(scoreA, scoreB);
  const url = window.location.origin;
  if (navigator.share) {
    await navigator.share({ text, url });
    return "shared" as const;
  }

  await navigator.clipboard.writeText(`${text}`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, "_blank", "noopener,noreferrer");
  return "copied" as const;
}
