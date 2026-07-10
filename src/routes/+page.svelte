<!--
  Example home page: your loom/bloom hero + a shadcn-svelte Button.
  Run `pnpm dlx shadcn-svelte@latest add button` so the import below resolves.
-->
<script>
  import KineticLoom from '$lib/components/KineticLoom.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
</script>

<svelte:head>
  <title>Curtis Hoffmann — Weaving Biological &amp; Cultural Lineages</title>
  <meta
    name="description"
    content="Curtis Hoffmann — researcher weaving biological and cultural lineages, with interactive atlases on exoplanets, human evolution, biodefense, and the RNA virome."
  />
</svelte:head>

<main class="page">
  <header>
    <div class="prefix">Tikkun Mada • תִּיקּוּן עוֹלָם</div>
    <h1>Curtis Hoffmann</h1>
    <p class="tagline">weaving biological and cultural lineages</p>
  </header>

  <div class="loom-wrap">
    <KineticLoom />
  </div>

  <footer>
    <!-- shadcn-svelte Button, restyled to the brand via CSS vars -->
    <Button href="mailto:ch1620@georgetown.edu" variant="outline" class="cv-button">
      Contact Me
    </Button>
  </footer>
</main>

<style>
  .page {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: calc(1.5rem + env(safe-area-inset-top, 0px)) 1.25rem calc(1.25rem + env(safe-area-inset-bottom, 0px));
    color: var(--color-bone, #e2e8f0);
    background: radial-gradient(circle at center, #1a2a44 0%, #000b18 100%);
    overflow: hidden;
  }
  header { flex-shrink: 0; }
  .prefix {
    font-size: clamp(0.55rem, 2.4vw, 0.65rem);
    letter-spacing: 0.7em; color: #c5a059; text-transform: uppercase;
    margin-bottom: 1.1rem; padding-left: 0.7em;
  }
  h1 {
    font-size: clamp(1.9rem, 8vw, 3.2rem); font-weight: 200;
    letter-spacing: 0.28em; text-transform: uppercase; padding-left: 0.28em;
  }
  .tagline {
    font-size: clamp(0.8rem, 3.6vw, 0.9rem); font-style: italic;
    letter-spacing: 0.18em; color: #7c8aa0; margin-top: 0.8rem;
  }
  .loom-wrap { flex: 1 1 auto; min-height: 0; width: 100vw; }
  footer { flex-shrink: 0; margin-top: 0.5rem; }
</style>
