export function timestampId(now = new Date().getTime()) {
  return Math.round(now / 1000).toString(36);
}
