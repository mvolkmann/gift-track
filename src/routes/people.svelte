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
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/IconButton.svelte';
  import type {Person} from '$lib/types';

  export let people: Person[];

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

  function getInput(event: Event) {
    const element = event.target as HTMLElement;
    const container = element.closest('.person');
    return container.querySelector('input');
  }

  async function savePerson(event: Event, person: Person) {
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

<h2>People</h2>

<div class="people">
  {#each people as person}
    <form
      class="person"
      class:editing={person.editing}
      on:submit|preventDefault={e => savePerson(e, person)}
    >
      <input type="text" readonly={!person.editing} value={person.name} />
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
</div>

<style>
  input {
    border: 1px solid lightgray;
    border-radius: 0.25rem;
    padding: 0.5rem;
    flex-grow: 1;
    margin-right: 1rem;
  }

  input[readonly] {
    border-color: transparent;
  }

  .person {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: white;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
</style>
