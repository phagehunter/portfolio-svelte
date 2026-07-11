import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// NOTE: in this sv template the adapter + kit options live in vite.config.ts
// (inside the sveltekit() plugin), so this file only handles preprocessing.
/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess()
};

export default config;
