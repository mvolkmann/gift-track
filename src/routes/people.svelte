<script lang="ts">
  import Dialog from '$lib/Dialog.svelte';
  import {occasionStore, personStore} from '$lib/stores';
  import type {Occasion, Person} from '$lib/types';
  import {sortObjects} from '$lib/util';

  $: occasions = sortObjects(Object.values($occasionStore), 'name');
  $: console.log('people.svelte x: occasions =', occasions);

  $: people = sortObjects(Object.values($personStore), 'name');
  $: console.log('people.svelte x: people =', people);

  let dialog: HTMLDialogElement;
  let selectedOccasion: Occasion | null = null;
  let selectedPerson: Person | null = null;
  $: console.log('people.svelte x: selectedPerson =', selectedPerson);

  function addPerson() {
    dialog.showModal();
  }

  function deleteOccasion() {
    //TODO: Confirm
    occasionStore.update(map => {
      delete map[selectedOccasion.id];
      return map;
    });
  }

  function deletePerson() {
    //TODO: Confirm
    personStore.update(map => {
      delete map[selectedPerson.id];
      return map;
    });
  }

  function selectOccasion(event: Event) {
    const element = event.target as HTMLSelectElement;
    const id = element.value;
    selectedOccasion = $occasionStore[id];
  }

  function selectPerson(event: Event) {
    const element = event.target as HTMLSelectElement;
    const id = element.value;
    selectedPerson = $personStore[id];
  }
</script>

<section class="people">
  <form on:submit|preventDefault>
    <div class="row">
      <label for="person-select">Person</label>
      <select
        id="person-select"
        value={selectedPerson ? selectedPerson.id : 0}
        on:change={selectPerson}
      >
        <option>Select...</option>
        {#each people as person}
          <option value={person.id}>
            {person.name}
          </option>
        {/each}
      </select>
      <button class="bare" disabled={!selectedPerson} on:click={deletePerson}>
        🗑
      </button>
      <button class="bare" on:click={addPerson}>➕</button>
    </div>
    <div class="row">
      <label for="occasion-select">Occasion</label>
      <select
        id="occasion-select"
        value={selectedOccasion ? selectedOccasion.id : 0}
        on:change={selectOccasion}
      >
        <option>Select...</option>
        {#each occasions as occasion}
          <option value={occasion.id}>
            {occasion.name}
          </option>
        {/each}
      </select>
      <button
        class="bare"
        disabled={!selectedOccasion}
        on:click={deleteOccasion}
      >
        🗑
      </button>
      <button class="bare" on:click={addPerson}>➕</button>
    </div>
  </form>
</section>

<Dialog bind:dialog title="Add Person">
  Add form for adding a person here.
</Dialog>

<style>
  button.bare:not(:first-of-type) {
    margin-left: 0;
  }

  .row {
    display: flex;
    align-items: center;
  }
</style>
