<script lang="ts">
  import type {Gift} from '$lib/types';

  export let gift: Gift;
</script>

{#if gift}
  <div class="gift">
    <div class="name">
      {gift.name}
      {#if gift.price}
        <span class="price">- ${gift.price}</span>
      {/if}
    </div>
    {#if gift.description}
      <div class="description">{gift.description}</div>
    {/if}
    {#if gift.location}
      <div class="location">{gift.location}</div>
    {/if}
    {#if gift.url}
      <a href={gift.url} rel="noopener" target="_blank">website</a>
    {/if}
  </div>
{/if}

<style>
  .gift {
    background-color: var(--secondary-color);
    border: none;
    border-radius: 0.5rem;
    color: black;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }

  .name {
    font-weight: bold;
  }
</style>
