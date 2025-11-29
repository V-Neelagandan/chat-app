export function buildWsUrl(relativePath) {
  const WS_BASE = import.meta.env.VITE_WS_BASE_URL; 
  return `${WS_BASE}${relativePath}`;
}
