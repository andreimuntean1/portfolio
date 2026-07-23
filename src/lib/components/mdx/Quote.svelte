<script lang="ts">
   let { text, author, role }: { text: string; author: string; role?: string } = $props();
</script>

<figure class="quote">
   <blockquote class="quote__text">{text}</blockquote>
   <figcaption class="quote__author">
      {author}{#if role}
         · {role}{/if}
   </figcaption>
</figure>
