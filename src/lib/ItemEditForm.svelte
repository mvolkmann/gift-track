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
  import type {Item, ItemKind} from '$lib/types';

  export let item: Item;
  export let kind: ItemKind;

  const dispatch = createEventDispatcher();

  let dialog: HTMLDialogElement;
  let savedItem: Item;
  let selectedItem: Item;

  function cancelEdit(item: Item) {
    // Restore previous values.
    item.name = savedItem.name;
    item.month = savedItem.month;
    item.day = savedItem.day;
    item.year = savedItem.year;

    item.editing = false;
    dispatch('update');
  }

  async function confirmDelete(event: Event, item: Item) {
    selectedItem = item;
    dialog.showModal();
  }

  async function deleteItem() {
    const url = `/api/${kind}/${selectedItem.id}`;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      console.log('ItemEditForm.svelte deleteItem: res =', res);
      dispatch('delete', selectedItem.id);
      selectedItem = null;
      dialog.close();
    } catch (e) {
      console.error('ItemEditForm.svelte deleteItem: e =', e);
    }
  }

  function editItem(event: Event, item: Item) {
    // Copy current data so it can be restored if editing is cancelled.
    savedItem = {...item};

    // Move focus into the name input.
    const input = getFirstInput(event);
    input.focus();

    item.editing = true;
    dispatch('update');
  }

  function getFirstInput(event: Event) {
    const element = event.target as HTMLElement;
    const container = element.closest('form');
    return container.querySelector('input');
  }

  async function updateItem(event: Event, item: Item) {
    const url = `/api/${kind}/${item.id}`;
    delete item.editing;

    //TODO: Don't allow duplicate names.

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
      });
      console.log('ItemEditForm.svelte updateItem: res =', res);
      //const text = await res.text();
      //console.log('ItemEditForm.svelte updateItem: text =', text);

      // Move focus out of the input that has it.
      const form = event.target as HTMLFormElement;
      const input = form.querySelector('input:focus') as HTMLInputElement;
      input?.blur();

      dispatch('update');
    } catch (e) {
      console.error('ItemEditForm.svelte updateItem: e =', e);
    }
  }
</script>

<form
  class:editing={item.editing}
  on:submit|preventDefault={e => updateItem(e, item)}
>
  <input
    class="name"
    type="text"
    readonly={!item.editing}
    bind:value={item.name}
  />
  <DateInput
    editing={item.editing}
    bind:month={item.month}
    bind:day={item.day}
    bind:year={item.year}
  />
  <div class="buttons">
    {#if item.editing}
      <IconButton icon={faSave} type="submit" />
      <IconButton icon={faTimes} on:click={() => cancelEdit(item)} />
    {:else}
      <IconButton icon={faPencilAlt} on:click={e => editItem(e, item)} />
      <IconButton icon={faTrash} on:click={e => confirmDelete(e, item)} />
    {/if}
  </div>
</form>

<Dialog bind:dialog title="Confirm Delete">
  <div class="question">
    Are you sure you want to delete {selectedItem ? selectedItem.name : ''}?
    This will also delete all of the associated gifts.
  </div>
  <div class="buttons">
    <button on:click={deleteItem}>Yes</button>
    <button on:click={() => dialog.close()}>No</button>
  </div>
</Dialog>

<style>
  .buttons {
    display: flex;
    justify-content: center;
    column-gap: 0.5rem;
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

  form > .buttons {
    margin-left: 1rem;
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
