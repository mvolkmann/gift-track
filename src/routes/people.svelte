<script context="module" lang="ts">
  export async function load({fetch}) {
    const res = await fetch('/api/person');
    const people = await res.json();
    people.sort((p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
    return {props: {people}};
  }
</script>

<script type="ts">
  import {faUserPlus} from '@fortawesome/free-solid-svg-icons';

  import IconButton from '$lib/IconButton.svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import PersonForm from '$lib/PersonForm.svelte';
  import type {Person} from '$lib/types';

  export let people: Person[];

  let adding = false;

  let name = '';
  let month = 1;
  let day = 1;
  let year = new Date().getFullYear();

  function addPerson() {
    adding = true;
  }

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
      people.push(newPerson);
      adding = false;
    } catch (e) {
      console.error('people.svelte createPerson: e =', e);
    }
  }

  function deletePerson(event: CustomEvent) {
    const id = event.detail as number;
    people = people.filter(p => p.id !== id);
  }

  function updatePeople() {
    people = people; // trigger reactivity
  }
</script>

<section class="people">
  <h2>
    People
    <IconButton color="white" icon={faUserPlus} on:click={addPerson} />
  </h2>
  <section class="scroll">
    {#if adding}
      <!-- Render form for adding a new person. -->
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
          <LabelledInput
            label="Year"
            name="year"
            type="number"
            bind:value={year}
          />
        </div>
        <button class="add-btn">Add</button>
      </form>
    {:else}
      <!-- Render list of people. -->
      {#each people as person}
        <PersonForm
          {person}
          on:delete={deletePerson}
          on:update={updatePeople}
        />
      {/each}
    {/if}
  </section>
</section>

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

  /* .birthday-inputs > :global(.labelled-input) {
    flex-grow: 1;
  } */

  .birthday-inputs > :global(.labelled-input > input) {
    width: 2.5rem;
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 1rem;

    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  .people {
    display: flex;
    flex-direction: column;

    flex-grow: 1;
    height: 100%;
  }

  .people :global(svg) {
    font-size: 1.5rem;
  }

  .scroll {
    flex-grow: 1;
    overflow-y: scroll;
  }
</style>
