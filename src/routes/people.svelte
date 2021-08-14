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
    faTimes,
    faTrash,
    faUserPlus
  } from '@fortawesome/free-solid-svg-icons';
  import {tick} from 'svelte';

  import DateInput from '$lib/DateInput.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Person} from '$lib/types';

  export let people: Person[];

  let adding = false;

  let deletePopup: HTMLDivElement;
  let name = '';
  let month = 1;
  let day = 1;
  let year: number | undefined;
  let savedPerson: Person;
  let selectedPerson: Person;

  $: canAdd = Boolean(name && month && day);

  function addPerson() {
    adding = true;
  }

  function cancelEdit(person: Person) {
    person.name = savedPerson.name;
    person.month = savedPerson.month;
    person.day = savedPerson.day;
    person.year = savedPerson.year;
    person.editing = false;
    people = people; // trigger reactivity
  }

  async function confirmDelete(event: Event, person: Person) {
    selectedPerson = person;
    deletePopup.classList.add('show');
    // The popup must be rendered in order to get its size, so wait for that.
    await tick();

    // Position the popup so its bottom is a little above the button top
    // and its right is at the button right.
    const button = event.target as HTMLButtonElement;
    const buttonRect = button.getBoundingClientRect();
    const popupRect = deletePopup.getBoundingClientRect();
    deletePopup.style.top =
      Math.max(buttonRect.y - popupRect.height - 5, 0) + 'px';
    deletePopup.style.left =
      Math.max(buttonRect.x + buttonRect.width - popupRect.width, 0) + 'px';
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
      person.editing = false;
    } catch (e) {
      console.error('people.svelte createPerson: e =', e);
    }
  }

  async function deletePerson() {
    hidePopup();
    const url = '/api/person/' + selectedPerson.id;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      console.log('people.svelte deletePerson: res =', res);
      people = people.filter(p => p.id !== selectedPerson.id);
      selectedPerson = null;
    } catch (e) {
      console.error('people.svelte deletePerson: e =', e);
    }
  }

  function editPerson(event: Event, person: Person) {
    savedPerson = {...person};
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

  function hidePopup() {
    deletePopup.classList.remove('show');
  }

  async function updatePerson(event: Event, person: Person) {
    const url = '/api/person/' + person.id;
    delete person.editing;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(person)
      });
      console.log('people.svelte savePerson: res =', res);
      //const text = await res.text();
      //console.log('people.svelte updatePerson: text =', text);

      const form = event.target as HTMLFormElement;
      const input = form.querySelector('input');
      input.blur();
      people = people; // trigger reactivity
    } catch (e) {
      console.error('people.svelte updatePerson: e =', e);
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
            bind:value={person.name}
          />
          <!-- <div class="birthday">{getBirthday(person)}</div> -->
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
              <IconButton
                icon={faPencilAlt}
                on:click={e => editPerson(e, person)}
              />
              <IconButton
                icon={faTrash}
                on:click={e => confirmDelete(e, person)}
              />
            {/if}
          </div>
        </form>
      {/each}
    {/if}
  </section>

  <div class="delete-popup" bind:this={deletePopup}>
    <div class="question">
      Are you sure you<br />
      want to delete {selectedPerson ? selectedPerson.name : ''}?
    </div>
    <div class="buttons">
      <button on:click={deletePerson}>Yes</button>
      <button on:click={hidePopup}>No</button>
    </div>
  </div>
</section>

<style>
  .add-btn {
    color: black;
  }

  .buttons {
    display: flex;
  }

  .delete-popup {
    --shadow: 5px;

    background-color: linen;
    box-shadow: 0 0 var(--shadow) var(--shadow) gray;
    display: none;
    padding: 0.5rem;
    position: absolute;
    width: 10rem;
  }

  .delete-popup:global(.show) {
    display: block;
  }

  .delete-popup > .buttons {
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    margin-top: 0.5rem;
    width: 100%;
  }

  .delete-popup button {
    background-color: var(--secondary-color);
    flex-grow: 1;
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
    margin-right: 0.5rem;
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
