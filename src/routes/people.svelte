<script lang="ts">
  import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
  import Icon from 'fa-svelte';

  import Dialog from '$lib/Dialog.svelte';
  import ConfirmDialog from '$lib/ConfirmDialog.svelte';
  import {occasionStore, personStore} from '$lib/stores';
  import Toast from '$lib/Toast.svelte';
  import type {Occasion, Person} from '$lib/types';
  import {sortObjects} from '$lib/util';

  $: occasions = sortObjects(Object.values($occasionStore), 'name');
  $: console.log('people.svelte x: occasions =', occasions);

  $: people = sortObjects(Object.values($personStore), 'name');
  $: console.log('people.svelte x: people =', people);

  let confirmDialog: HTMLDialogElement;
  let dialog: HTMLDialogElement;
  let question = '';
  let selectedOccasion: Occasion | null = null;
  let selectedPerson: Person | null = null;
  let toastMessage = '';

  function addPerson() {
    dialog.showModal();
  }

  function confirmed() {
    personStore.update(map => {
      delete map[selectedPerson.id];
      return map;
    });
    toastMessage = 'Deleted ' + selectedPerson.name;
  }

  function deleteOccasion() {
    //TODO: Confirm
    occasionStore.update(map => {
      delete map[selectedOccasion.id];
      return map;
    });
  }

  function deletePerson() {
    question = `Are you sure you want to delete ${selectedPerson.name}?`;
    confirmDialog.showModal();
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
        <Icon icon={faTrash} />
      </button>
      <button class="bare" on:click={addPerson}>
        <Icon icon={faPlus} />
      </button>
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
        <Icon icon={faTrash} />
      </button>
      <button class="bare" on:click={addPerson}>
        <Icon icon={faPlus} />
      </button>
    </div>

    <!-- After a person is selected, show all their gifts.
         If an occasion is also selected,
         only show those gifts and the total.
         Allow deleting a gift with confirmation.
         Allow adding a gift when both are selected. -->
  </form>
</section>

<Dialog bind:dialog title="Add Person">
  Add form for adding a person here.
</Dialog>

<Toast message={toastMessage} />

<ConfirmDialog bind:dialog={confirmDialog} {question} on:yes={confirmed} />

<style>
  button.bare:not(:first-of-type) {
    margin-left: 0;
  }

  label {
    text-align: right;
    width: 5rem;
  }

  .row {
    display: flex;
    align-items: center;
  }
</style>
