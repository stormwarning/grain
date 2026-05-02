<script lang="ts">
  import DetailHeader from '$lib/components/molecules/DetailHeader.svelte'
  import GallerySectionRow from '$lib/components/molecules/GallerySectionRow.svelte'
  import OGMeta from '$lib/components/atoms/OGMeta.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { camerasQuery } from '$lib/queries'

  const cameras = createQuery(() => camerasQuery())
</script>

<OGMeta title="Cameras - grain" />
<DetailHeader label="Cameras" />

<div class="index-page">
  {#if cameras.isLoading}
    <div class="state">Loading…</div>
  {:else if !cameras.data?.length}
    <div class="state">No cameras yet.</div>
  {:else}
    {#each cameras.data as c (c.camera)}
      <GallerySectionRow
        kind="camera"
        camera={c.camera}
        href="/camera/{encodeURIComponent(c.camera)}"
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
