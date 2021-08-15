<script type="ts">
  import {createEventDispatcher} from 'svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Item, ItemKind} from '$lib/types';

  export let kind: ItemKind;

  const dispatch = createEventDispatcher();

  let name = '';
  let month = 1;
  let day = 1;
  let year = new Date().getFullYear();

  async function createItem() {
    const item: Item = {name, month, day};
    // year is not required.
    if (year) item.year = year;

    try {
      const res = await fetch('/api/' + kind, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
      });
      const newItem = await res.json();
      dispatch('add', newItem);
    } catch (e) {
      console.error('ItemAddForm.svelte createItem: e =', e);
    }
  }
</script>

<form class="add-form" on:submit|preventDefault={createItem}>
  <LabelledInput label="Name" name="name" required bind:value={name} />
  <div class="date-inputs">
    <LabelledInput
      label="Month"
      name="month"
      type="number"
      bind:value={month}
    />
    <LabelledInput label="Day" name="day" type="number" bind:value={day} />
    <LabelledInput label="Year" name="year" type="number" bind:value={year} />
  </div>
  <div class="buttons">
    <button>Add</button>
    <button type="button" on:click={() => dispatch('cancel')}>Cancel</button>
  </div>
</form>

<style>
  button {
    color: black;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }

  .date-inputs {
    display: flex;
    gap: 1rem;

    box-sizing: border-box;
    width: 100%;
  }

  .date-inputs > :global(.labelled-input > input) {
    width: 2.5rem;
  }
</style>
