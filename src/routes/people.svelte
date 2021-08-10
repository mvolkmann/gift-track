<script lang="ts">
  import Dialog from '$lib/Dialog.svelte';
  import {personStore} from '$lib/stores';
  import type {Person} from '$lib/types';
  import {sortObjects} from '$lib/util';

  $: people = sortObjects(Object.values($personStore), 'name');
  $: console.log('people.svelte x: people =', people);

  let dialog: HTMLDialogElement;
  let selectedPerson: Person | null = null;
  $: console.log('people.svelte x: selectedPerson =', selectedPerson);

  function addPerson() {
    dialog.showModal();
  }

  function deletePerson() {
    //TODO: Confirm
    personStore.update(map => {
      delete map[selectedPerson.id];
      return map;
    });
  }

  function selectPerson(event: Event) {
    const element = event.target as HTMLSelectElement;
    const personId = element.value;
    selectedPerson = $personStore[personId];
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
