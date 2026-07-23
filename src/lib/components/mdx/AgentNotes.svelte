<script lang="ts">
   let { did, decided, verified }: { did: string; decided: string; verified: string } = $props();
</script>

<section class="agent-notes">
   <h3 class="agent-notes__title">Agent notes</h3>
   <dl class="agent-notes__grid">
      <dt>What agents did</dt>
      <dd>{did}</dd>
      <dt>What I decided</dt>
      <dd>{decided}</dd>
      <dt>What verified it</dt>
      <dd>{verified}</dd>
   </dl>
</section>
