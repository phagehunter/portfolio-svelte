// Prerender every route to static HTML at build time (required for adapter-static).
export const prerender = true;

// No client-side router base surprises: all pages are static files.
export const trailingSlash = 'always';
