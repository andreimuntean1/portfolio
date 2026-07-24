<script lang="ts">
   import type { ResolvedPathname } from '$app/types';

   let {
      num,
      label,
      id,
      href,
      linkLabel,
      meta,
   }: {
      num: string;
      label: string;
      id?: string;
      href?: ResolvedPathname;
      linkLabel?: string;
      meta?: string;
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
   {:else if meta}
      <span class="section-header__meta">{meta}</span>
   {/if}
</div>
