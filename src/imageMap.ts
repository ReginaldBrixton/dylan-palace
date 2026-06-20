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

export function img(path: string): string {
  const resolved = normalizedPaths.get(path);
  if (!resolved) {
    console.error(`Missing local image: ${path}`);
    return '';
  }
  return resolved;
}
