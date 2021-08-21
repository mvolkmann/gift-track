<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Item, ItemKind} from '$lib/types';
  import {getLastDayInMonth} from '$lib/util';

  export let kind: ItemKind;

  const dispatch = createEventDispatcher();

  let name = '';
  let month = 1;
  let day = 1;
  let year = new Date().getFullYear();

  $: lastDayInMonth = getLastDayInMonth(year, month);

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

<form on:submit|preventDefault={createItem}>
  <LabelledInput label="Name" name="name" required bind:value={name} />
  <div class="date-inputs">
    <LabelledInput
      label="Month"
      max={12}
      min={1}
      name="month"
      type="number"
      bind:value={month}
    />
    <LabelledInput
      label="Day"
      max={lastDayInMonth}
      min={1}
      name="day"
      type="number"
      bind:value={day}
    />
    <LabelledInput
      label="Year"
      max={2100}
      min={1920}
      name="year"
      type="number"
      bind:value={year}
    />
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

  .date-inputs :global(input[name='month']),
  .date-inputs :global(input[name='day']) {
    width: 2.5rem;
  }

  .date-inputs :global(input[name='year']) {
    width: 3.5rem;
  }

  form {
    padding: 0 2px; /* so focus outline is not too close to edges */
  }

  form :global(.labelled-input),
  form :global(.labelled-select) {
    margin-bottom: 1rem;
  }
</style>
