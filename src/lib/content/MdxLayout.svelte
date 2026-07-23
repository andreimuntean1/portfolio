<!--
  mdsvex wraps every `.mdx` case-study body in this layout and fills the slot
  below — it does not auto-expose components used in the body (mdsvex only
  rewrites tag names for markdown's own elements, e.g. p/img/a; custom tags
  land as raw text and are never bound). Each `.mdx` file imports what it
  needs directly, mdsvex's standard pattern:

    <script lang="ts">
       import MakerNote from '$lib/components/mdx/MakerNote.svelte';
    </script>

  Available under `$lib/components/mdx/`: MakerNote, AgentNotes, Metrics,
  Quote, Figure, Stamp.
-->
<slot />
