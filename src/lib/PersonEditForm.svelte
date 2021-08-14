<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  import {
    faPencilAlt,
    faSave,
    faTimes,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import DateInput from '$lib/DateInput.svelte';
  import Dialog from '$lib/Dialog.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import type {Person} from '$lib/types';

  export let person: Person;

  const dispatch = createEventDispatcher();

  let dialog: HTMLDialogElement;
  let savedPerson: Person;
  let selectedPerson: Person;

  function cancelEdit(person: Person) {
    // Restore previous values.
    person.name = savedPerson.name;
    person.month = savedPerson.month;
    person.day = savedPerson.day;
    person.year = savedPerson.year;

    person.editing = false;
    dispatch('update');
  }

  async function confirmDelete(event: Event, person: Person) {
    selectedPerson = person;
    dialog.showModal();
  }

  async function deletePerson() {
    const url = '/api/person/' + selectedPerson.id;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      console.log('people.svelte deletePerson: res =', res);
      dispatch('delete', selectedPerson.id);
      selectedPerson = null;
      dialog.close();
    } catch (e) {
      console.error('people.svelte deletePerson: e =', e);
    }
  }

  function editPerson(event: Event, person: Person) {
    // Copy current data so it can be restored if editing is cancelled.
    savedPerson = {...person};

    // Move focus into the name input.
    const input = getFirstInput(event);
    input.focus();

    person.editing = true;
    dispatch('update');
  }

  function getFirstInput(event: Event) {
    const element = event.target as HTMLElement;
    const container = element.closest('form');
    return container.querySelector('input');
  }

  async function updatePerson(event: Event, person: Person) {
    const url = '/api/person/' + person.id;
    delete person.editing;

    //TODO: Don't allow duplicate names.

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(person)
      });
      console.log('people.svelte savePerson: res =', res);
      //const text = await res.text();
      //console.log('people.svelte updatePerson: text =', text);

      // Move focus out of the in the input that has it.
      const form = event.target as HTMLFormElement;
      const input = form.querySelector('input:focus') as HTMLInputElement;
      input?.blur();

      dispatch('update');
    } catch (e) {
      console.error('people.svelte updatePerson: e =', e);
    }
  }
</script>

<form
  class:editing={person.editing}
  on:submit|preventDefault={e => updatePerson(e, person)}
>
  <input
    class="name"
    type="text"
    readonly={!person.editing}
    bind:value={person.name}
  />
  <DateInput
    editing={person.editing}
    bind:month={person.month}
    bind:day={person.day}
    bind:year={person.year}
  />
  <div class="buttons">
    {#if person.editing}
      <IconButton icon={faSave} type="submit" />
      <IconButton icon={faTimes} on:click={() => cancelEdit(person)} />
    {:else}
      <IconButton icon={faPencilAlt} on:click={e => editPerson(e, person)} />
      <IconButton icon={faTrash} on:click={e => confirmDelete(e, person)} />
    {/if}
  </div>
</form>

<Dialog bind:dialog title="Confirm Delete">
  <div class="question">
    Are you sure you want to delete {selectedPerson ? selectedPerson.name : ''}?
    This will also delete all of {selectedPerson ? selectedPerson.name : ''}'s
    gifts.
  </div>
  <div class="buttons">
    <button on:click={deletePerson}>Yes</button>
    <button on:click={() => dialog.close()}>No</button>
  </div>
</Dialog>

<style>
  .buttons {
    display: flex;
    justify-content: center;
    column-gap: 0.5rem;

    margin-left: 1rem;
  }

  .buttons button {
    background-color: var(--secondary-color);
    flex-grow: 1;
  }

  form {
    display: flex;
    align-items: center;

    background-color: white;
    border-radius: 0.5rem;
    box-sizing: border-box;
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
  }

  input {
    border: 1px solid lightgray;
    border-radius: 0.25rem;
    padding: 0.5rem;
    flex-grow: 1;
    margin-right: 0.5rem;
  }

  input[readonly] {
    border-color: transparent;
  }

  .name {
    flex-grow: 1;
    min-width: 0; /* so input can shrink below default min-width */
  }
</style>
