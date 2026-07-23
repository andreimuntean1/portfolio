<script lang="ts">
   let { children }: { children: import('svelte').Snippet } = $props();
</script>

<aside class="maker-note">
   <span class="maker-note__prefix">n.b. —</span>
   {@render children()}
</aside>
