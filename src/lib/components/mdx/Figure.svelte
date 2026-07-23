<script lang="ts">
   const images = import.meta.glob('/content/projects/*/assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: { enhanced: true },
      import: 'default',
   }) as Record<string, string>;

   let { src, caption, slug }: { src: string; caption: string; slug: string } = $props();

   const resolved = $derived(images[`/content/projects/${slug}/assets/${src}`]);
</script>

<figure class="figure">
   {#if resolved}
      <enhanced:img src={resolved} alt={caption} sizes="(min-width: 1024px) 960px, 100vw" />
   {/if}
   <figcaption class="figure__caption">{caption}</figcaption>
</figure>
