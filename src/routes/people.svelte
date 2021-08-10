<script>
  import Dialog from '$lib/Dialog.svelte';
  import {personStore} from '$lib/stores';
  import {sortObjects} from '$lib/util';

  $: people = sortObjects(Object.values($personStore), 'name');
  $: console.log('people.svelte x: people =', people);

  let dialog;

  function addPerson() {
    dialog.showModal();
  }
</script>

<section class="people">
  <h2>
    People
    <button class="bare" on:click={addPerson}>➕</button>
  </h2>
  {#each people as person}
    <div class="person-row">
      <button class="person truncate">{person.name}</button>
      <button class="bare">🗑</button>
    </div>
  {/each}
</section>

<Dialog bind:dialog title="Add Person">
  Add form for adding a person here.
</Dialog>

<style>
  h2 {
    margin: 0 0 0.5rem 0;
  }

  .people {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    outline: 1px dashed red;
  }

  .person-row {
    display: flex;
    align-items: center;
  }

  button.person {
    width: 5rem;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
