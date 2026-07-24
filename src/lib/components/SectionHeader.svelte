<script lang="ts">
   import type { ResolvedPathname } from '$app/types';

   let {
      num,
      label,
      id,
      href,
      linkLabel,
   }: {
      num: string;
      label: string;
      id?: string;
      href?: ResolvedPathname;
      linkLabel?: string;
   } = $props();
</script>

<div class="section-header">
   <h2 class="section-header__heading" {id}>
      <span class="section-header__num">{num} /</span>
      {label}
   </h2>
   <span class="section-header__rule" aria-hidden="true"></span>
   {#if href && linkLabel}
      <a class="section-header__link" {href}>{linkLabel}</a>
   {/if}
</div>
