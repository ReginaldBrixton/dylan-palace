/// <reference types="vite/client" />

const imageModules = import.meta.glob('./assets/images/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const normalizedPaths = new Map<string, string>();

Object.entries(imageModules).forEach(([key, value]) => {
  // key: './assets/images/shirts/boxy_camp_collar_shirt.jpg'
  const relativePath = key.replace('./assets/images/', '');
  normalizedPaths.set(relativePath, value);
});

const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">' +
  '<rect width="400" height="500" fill="#F4F4F3"/>' +
  '<text x="200" y="250" font-family="sans-serif" font-size="14" fill="#8B8B8A" text-anchor="middle" dominant-baseline="middle">' +
  'Dylan\'s Palace' +
  '</text>' +
  '</svg>'
)}`;

export function img(path: string): string {
  const resolved = normalizedPaths.get(path);
  if (!resolved) {
    console.warn(`Missing local image: ${path}`);
    return FALLBACK_SVG;
  }
  return resolved;
}
