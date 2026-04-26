export const isEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
export const isPhone    = (v) => /^\+?[\d\s\-()]{7,15}$/.test(v)
export const isRequired = (v) => v !== null && v !== undefined && String(v).trim() !== ""
export const minLength  = (n) => (v) => String(v ?? "").length >= n
export const maxLength  = (n) => (v) => String(v ?? "").length <= n
export const isPositive = (v) => Number(v) > 0
