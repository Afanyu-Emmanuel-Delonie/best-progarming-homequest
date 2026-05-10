/**
 * fmtCurrency — abbreviated: RWF 1.25M, RWF 920K, RWF 3.2B
 * Used everywhere a compact number is needed (tables, cards, stat strips)
 */
export const fmtCurrency = (n) => {
  const v = n ?? 0
  if (v >= 1_000_000_000) return `RWF ${+(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000)     return `RWF ${+(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)         return `RWF ${+(v / 1_000).toFixed(1)}K`
  return `RWF ${v.toLocaleString()}`
}

/**
 * fmtCurrencyFull — full precision with commas: RWF 1,250,000
 * Used in detail drawers where exact figures matter
 */
export const fmtCurrencyFull = (n) => {
  const v = n ?? 0
  return `RWF ${v.toLocaleString("en-US")}`
}

/**
 * fmtPct — percentage: 0.03 → "3.0%"
 */
export const fmtPct = (n) => `${(n * 100).toFixed(1)}%`

/**
 * fmtDate — "Jul 10, 2025"
 */
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
