<script lang="ts">
  import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
  import Icon from 'fa-svelte';

  import Dialog from '$lib/Dialog.svelte';
  import ConfirmDialog from '$lib/ConfirmDialog.svelte';
  import {occasionStore, personStore, toastStore} from '$lib/stores';
  import type {Occasion, Person} from '$lib/types';
  import {sortObjects} from '$lib/util';

  $: occasions = sortObjects(Object.values($occasionStore), 'name');

  $: people = sortObjects(Object.values($personStore), 'name');

  let confirmDialog: HTMLDialogElement;
  let deleteType = '';
  let dialog: HTMLDialogElement;
  let gifts = [];
  let question = '';
  let selectedOccasion: Occasion | null = null;
  let selectedPerson: Person | null = null;

  function addPerson() {
    dialog.showModal();
  }

  function confirmed() {
    const isPerson = deleteType === 'person';

    const store = isPerson ? personStore : occasionStore;
    const id = isPerson ? selectedPerson.id : selectedOccasion.id;
    store.update(map => {
      delete map[id];
      return map;
    });

    const name = isPerson ? selectedPerson.name : selectedOccasion.name;
    $toastStore = 'Deleted ' + name;

    if (isPerson) {
      selectedPerson = null;
    } else {
      selectedOccasion = null;
    }
  }

  function deleteOccasion() {
    deleteType = 'occasion';
    question = `Are you sure you want to delete ${selectedOccasion.name}?`;
    confirmDialog.showModal();
    //TODO: Confirm
    occasionStore.update(map => {
      delete map[selectedOccasion.id];
      return map;
    });
  }

  function deletePerson() {
    deleteType = 'person';
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
      <!-- TODO: Why is this key needed? -->
      <!-- Without it the value doesn't get cleared after a person is deleted. -->
      {#key selectedPerson}
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
      {/key}
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
    {#each gifts as gift}{/each}
  </form>
</section>

<Dialog bind:dialog title="Add Person">
  Add form for adding a person here.
</Dialog>

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

    margin-bottom: 0.5rem;
  }
</style>
