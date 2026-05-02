<script lang="ts">
  import DetailHeader from '$lib/components/molecules/DetailHeader.svelte'
  import GallerySectionRow from '$lib/components/molecules/GallerySectionRow.svelte'
  import OGMeta from '$lib/components/atoms/OGMeta.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { locationsQuery } from '$lib/queries'

  const locations = createQuery(() => locationsQuery())
</script>

<OGMeta title="Locations - grain" />
<DetailHeader label="Locations" />

<div class="index-page">
  {#if locations.isLoading}
    <div class="state">Loading…</div>
  {:else if !locations.data?.length}
    <div class="state">No locations yet.</div>
  {:else}
    {#each locations.data as loc (loc.h3Index)}
      <GallerySectionRow
        kind="location"
        h3={loc.h3Index}
        name={loc.name}
        href="/location/{encodeURIComponent(loc.h3Index)}?name={encodeURIComponent(loc.name)}"
      />
    {/each}
  {/if}
</div>

<style>
  .index-page {
    display: flex;
    flex-direction: column;
  }
  .state {
    padding: 32px 16px;
    text-align: center;
    color: var(--text-muted);
  }
</style>
