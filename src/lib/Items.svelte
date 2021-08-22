<script lang="ts">
  import {faPlus} from '@fortawesome/free-solid-svg-icons';

  import IconButton from '$lib/IconButton.svelte';
  import ItemAddForm from '$lib/ItemAddForm.svelte';
  import ItemEditForm from '$lib/ItemEditForm.svelte';
  import type {Item, ItemKind} from '$lib/types';
  import {sortObjects} from '$lib/util';

  export let items: Item[];
  export let kind: ItemKind;
  export let title: string;

  let adding = false;

  $: sortedItems = sortObjects(items, 'name') as Item[];

  function addItem(event: CustomEvent) {
    const newItem = event.detail as Item;
    items.push(newItem);
    adding = false;
    updatePeople();
  }

  function deleteItem(event: CustomEvent) {
    const id = event.detail as number;
    items = items.filter(p => p.id !== id);
  }

  function updatePeople() {
    items = items; // trigger reactivity
  }
</script>

<section class="items">
  <h2>
    {title}
    <IconButton
      icon={faPlus}
      title="Add {kind}"
      on:click={() => (adding = true)}
    />
  </h2>
  <section class="scroll">
    {#if adding}
      <ItemAddForm {kind} on:add={addItem} on:cancel={() => (adding = false)} />
    {:else}
      <!-- Using a key in this #each is required for
           proper updates after an item is deleted. -->
      {#each sortedItems as item (item.id)}
        <ItemEditForm
          {item}
          {kind}
          on:delete={deleteItem}
          on:update={updatePeople}
        />
      {/each}
    {/if}
  </section>
</section>

<style>
  h2 {
    display: flex;
    align-items: center;
    gap: 1rem;

    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  .items {
    display: flex;
    flex-direction: column;

    flex-grow: 1;
    height: 100%;
  }

  .scroll {
    flex-grow: 1;
    overflow-y: scroll;
  }
</style>
