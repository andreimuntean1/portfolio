<script lang="ts">
   let { items }: { items: { label: string; value: string }[] } = $props();
</script>

<ul class="metrics">
   {#each items as metric (metric.label)}
      <li class="metrics__item">
         <span class="metrics__value">{metric.value}</span>
         <span class="metrics__label">{metric.label}</span>
      </li>
   {/each}
</ul>
