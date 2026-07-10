import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Prerender the whole site to static files for GitHub Pages.
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      // In `dev` the base is empty. In CI the deploy workflow sets BASE_PATH:
      //  - project page (repo != <user>.github.io) -> "/repo-name"
      //  - user/root page  (curtishoffmann.com)     -> "" (empty)
      // The GitHub Pages action computes this for you via configure-pages.
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH || ''
    }
  }
};

export default config;
