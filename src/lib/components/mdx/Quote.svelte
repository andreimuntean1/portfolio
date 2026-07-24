<script lang="ts">
   import { reveal } from '$lib/motion/reveal';

   let { text, author, role }: { text: string; author: string; role?: string } = $props();
</script>

<figure class="quote" use:reveal>
   <blockquote class="quote__text">{text}</blockquote>
   <figcaption class="quote__author">
      {author}{#if role}
         · {role}{/if}
   </figcaption>
</figure>
