<script type="ts">
  import {createEventDispatcher} from 'svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Person} from '$lib/types';

  const dispatch = createEventDispatcher();

  let name = '';
  let month = 1;
  let day = 1;
  let year = new Date().getFullYear();

  async function createPerson() {
    const person: Person = {name, month, day};
    // year is not required.
    if (year) person.year = year;

    try {
      const res = await fetch('/api/person', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(person)
      });
      const newPerson = await res.json();
      dispatch('added', newPerson);
    } catch (e) {
      console.error('people.svelte createPerson: e =', e);
    }
  }
</script>

<form class="add-form" on:submit|preventDefault={createPerson}>
  <LabelledInput label="Name" name="name" required bind:value={name} />
  <div class="birthday-inputs">
    <LabelledInput
      label="Month"
      name="month"
      required
      type="number"
      bind:value={month}
    />
    <LabelledInput
      label="Day"
      name="day"
      required
      type="number"
      bind:value={day}
    />
    <LabelledInput label="Year" name="year" type="number" bind:value={year} />
  </div>
  <button class="add-btn">Add</button>
</form>

<style>
  .add-btn {
    color: black;
  }

  .birthday-inputs {
    display: flex;
    gap: 1rem;

    box-sizing: border-box;
    width: 100%;
  }

  .birthday-inputs > :global(.labelled-input > input) {
    width: 2.5rem;
  }
</style>
