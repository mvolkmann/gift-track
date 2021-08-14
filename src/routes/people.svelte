<script context="module">
  export async function load({fetch}) {
    const res = await fetch('/api/person');
    const people = await res.json();
    return {props: {people}};
  }
</script>

<script type="ts">
  import {
    faPencilAlt,
    faSave,
    faTrash,
    faUserPlus
  } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Person} from '$lib/types';

  export let people: Person[];

  let adding = false;

  let name = '';
  let month = 1;
  let day = 1;
  let year: number | undefined;

  $: canAdd = Boolean(name && month && day);

  function addPerson() {
    adding = true;
  }

  async function createPerson() {
    const person: Person = {name, month, day};
    if (year) person.year = year;

    try {
      const res = await fetch('/api/person', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(person)
      });
      console.log('people.svelte x: res =', res);
      const json = await res.json();
      console.log('people.svelte x: json =', json);
      editing = false;
    } catch (e) {
      console.error('people.svelte createPerson: e =', e);
    }
  }

  async function deletePerson(person: Person) {
    //TODO: Confirm delete.
    const url = '/api/person/' + person.id;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      console.log('people.svelte deletePerson: res =', res);
      //const text = await res.text();
      //console.log('people.svelte deletePerson: text =', text);
      people = people.filter(p => p.id !== person.id);
    } catch (e) {
      console.error('people.svelte deletePerson: e =', e);
    }
  }

  function editPerson(event: Event, person: Person) {
    const input = getInput(event);
    input.focus();
    person.editing = true;
    people = people; // trigger reactivity
  }

  function getBirthday(person: Person): string {
    const {day, month, year} = person;
    let bd = `${month}/${day}`;
    if (year) bd += `/${year}`;
    return bd;
  }

  function getInput(event: Event) {
    const element = event.target as HTMLElement;
    const container = element.closest('.person');
    return container.querySelector('input');
  }

  async function updatePerson(event: Event, person: Person) {
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input');
    person.name = input.value;
    const url = '/api/person/' + person.id;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(person)
      });
      console.log('people.svelte savePerson: res =', res);
      //const text = await res.text();
      //console.log('people.svelte deletePerson: text =', text);

      input.blur();
      person.editing = false;
      people = people; // trigger reactivity
    } catch (e) {
      console.error('people.svelte deletePerson: e =', e);
    }
  }
</script>

<section class="people">
  <h2>
    People
    <IconButton color="white" icon={faUserPlus} on:click={addPerson} />
  </h2>
  <section class="scroll">
    {#if adding}
      <form on:submit|preventDefault={createPerson}>
        <LabelledInput label="Name" name="name" bind:value={name} />
        <LabelledInput
          label="Month"
          name="month"
          type="number"
          bind:value={month}
        />
        <LabelledInput label="Day" name="day" type="number" bind:value={day} />
        <LabelledInput
          label="Year"
          name="year"
          type="number"
          bind:value={year}
        />
        <button class="add-btn" disabled={!canAdd}>Add</button>
      </form>
    {:else}
      {#each people as person}
        <form
          class="person"
          class:editing={person.editing}
          on:submit|preventDefault={e => updatePerson(e, person)}
        >
          <input
            class="name"
            type="text"
            readonly={!person.editing}
            value={person.name}
          />
          <div class="birthday">{getBirthday(person)}</div>
          <div class="buttons">
            {#if person.editing}
              <IconButton icon={faSave} type="submit" />
            {:else}
              <IconButton
                icon={faPencilAlt}
                on:click={e => editPerson(e, person)}
              />
            {/if}
            <IconButton icon={faTrash} on:click={() => deletePerson(person)} />
          </div>
        </form>
      {/each}
    {/if}
  </section>
</section>

<style>
  .add-btn {
    color: black;
  }

  .buttons {
    display: flex;
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 1rem;

    margin: 0;
  }

  input {
    border: 1px solid lightgray;
    border-radius: 0.25rem;
    padding: 0.5rem;
    flex-grow: 1;
    margin-right: 1rem;
    /* width: 4rem; */
  }

  input[readonly] {
    border-color: transparent;
  }

  .name {
    flex-grow: 1;
    min-width: 0; /* so input can shrink below default min-width */
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

  .person {
    display: flex;
    align-items: center;

    background-color: white;
    border-radius: 0.5rem;
    box-sizing: border-box;
    margin-bottom: 1rem;
    padding-left: 0.5rem;
    width: 100%;
  }

  .scroll {
    flex-grow: 1;
    overflow-y: scroll;
  }
</style>
