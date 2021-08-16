<!--TODO: Do you still need this component?
Maybe this will be needed to add a new gift. -->
<script lang="ts">
  import {
    faPencilAlt,
    faSave,
    faTimes,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import {createEventDispatcher} from 'svelte';

  import Dialog from '$lib/Dialog.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Gift} from '$lib/types';

  export let gift: Gift;

  const dispatch = createEventDispatcher();

  let dialog: HTMLDialogElement;
  let editing = false;
  let savedGift: Gift;
  let selectedGift: Gift;

  function cancelEdit(gift: Gift) {
    // Restore previous values.
    gift.description = savedGift.description;
    gift.location = savedGift.location;
    gift.name = savedGift.name;
    gift.price = savedGift.price;

    editing = false;
    dispatch('update');
  }

  async function confirmDelete(event: Event, gift: Gift) {
    selectedGift = gift;
    dialog.showModal();
  }

  async function deleteGift() {
    const url = `/api/gift/${selectedGift.id}`;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      console.log('Gift.svelte deleteGift: res =', res);
      dispatch('delete', selectedGift.id);
      selectedGift = null;
      dialog.close();
    } catch (e) {
      console.error('Gift.svelte deleteGift: e =', e);
    }
  }

  function editGift(event: Event, gift: Gift) {
    // Copy current data so it can be restored if editing is cancelled.
    savedGift = {...gift};

    // Move focus into the name input.
    const input = getFirstInput(event);
    input.focus();

    editing = true;
    dispatch('update');
  }

  function getFirstInput(event: Event) {
    const element = event.target as HTMLElement;
    const container = element.closest('form');
    return container.querySelector('input');
  }

  async function updateGift(event: Event, gift: Gift) {
    const url = `/api/gift/${gift.id}`;

    //TODO: Don't allow duplicate names.

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(gift)
      });
      console.log('Gift.svelte updateItem: res =', res);
      //const text = await res.text();
      //console.log('Gift.svelte updateItem: text =', text);

      // Move focus out of the input that has it.
      const form = event.target as HTMLFormElement;
      const input = form.querySelector('input:focus') as HTMLInputElement;
      input?.blur();

      dispatch('update');
    } catch (e) {
      console.error('Gift.svelte updateItem: e =', e);
    }
  }
</script>

<div class="gift">
  <div class="buttons">
    {#if editing}
      <IconButton icon={faSave} title="Save" type="submit" />
      <IconButton
        icon={faTimes}
        title="Cancel"
        on:click={() => cancelEdit(gift)}
      />
    {:else}
      <IconButton
        icon={faPencilAlt}
        title="Edit"
        on:click={e => editGift(e, gift)}
      />
      <IconButton
        icon={faTrash}
        title="Delete"
        on:click={e => confirmDelete(e, gift)}
      />
    {/if}
  </div>
  <form class:editing on:submit|preventDefault={e => updateGift(e, gift)}>
    <LabelledInput label="Name" name="name" bind:value={gift.name} />
    <LabelledInput
      label="Description"
      name="description"
      readonly={!editing}
      bind:value={gift.description}
    />
    <LabelledInput
      label="Location"
      name="location"
      readonly={!editing}
      bind:value={gift.location}
    />
    <LabelledInput
      label="Price"
      name="price"
      readonly={!editing}
      type="number"
      bind:value={gift.price}
    />
    <LabelledInput
      label="URL"
      name="url"
      readonly={!editing}
      type="url"
      bind:value={gift.url}
    />
  </form>

  <Dialog bind:dialog title="Confirm Delete">
    <div class="question">
      Are you sure you want to delete {selectedGift ? selectedGift.name : ''}?
      This will also delete all of the associated gifts.
    </div>
    <div class="buttons">
      <button on:click={deleteGift}>Yes</button>
      <button on:click={() => dialog.close()}>No</button>
    </div>
  </Dialog>
</div>

<style>
  /* your styles go here */
</style>
