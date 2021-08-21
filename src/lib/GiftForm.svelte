<script lang="ts">
  import {
    faAngleLeft,
    faPencilAlt,
    faSave,
    faTimes,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import {createEventDispatcher} from 'svelte';
  import {goto} from '$app/navigation';

  import Dialog from '$lib/Dialog.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';
  import type {Gift} from '$lib/types';
  import {goToErrorPage} from '$lib/util';

  export let adding = false;
  export let gift: Gift;

  const dispatch = createEventDispatcher();

  let dialog: HTMLDialogElement;
  let editing = false;
  let savedGift: Gift;
  let selectedGift: Gift;

  let readonly = false;
  $: readonly = !adding && !editing;

  function cancelEdit() {
    // Restore previous values.
    gift = savedGift;

    editing = false;
  }

  async function confirmDelete() {
    selectedGift = gift;
    dialog.showModal();
  }

  async function deleteGift() {
    const url = `/api/gift/${selectedGift.id}`;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      if (!res.ok) throw new Error(await res.text());

      selectedGift = null;
      dialog.close();
      goto('/gifts');
      dispatch('change');
    } catch (e) {
      goToErrorPage(e);
    }
  }

  async function editGift(event: Event) {
    // Copy current data so it can be restored if editing is cancelled.
    savedGift = {...gift};

    editing = true;

    // Move focus into the name input.
    getFirstInput(event).focus();
  }

  function getFirstInput(event: Event) {
    const element = event.target as HTMLElement;
    const container = element.closest('form');
    return container.querySelector('input');
  }

  async function saveGift() {
    const url = `/api/gift${adding ? '' : '/' + gift.id}`;
    const method = adding ? 'POST' : 'PUT';

    //TODO: Don't allow duplicate names.

    try {
      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(gift)
      });
      if (!res.ok) throw new Error(await res.text());

      if (editing) {
        editing = false;
        goto('/gifts');
      } else {
        adding = false;
        dispatch('change');
      }
    } catch (e) {
      goToErrorPage(e);
    }
  }
</script>

<div class="gift">
  <form class:editing on:submit|preventDefault={saveGift}>
    <LabelledInput
      label="Name"
      name="name"
      readonly={!adding && !editing}
      required
      bind:value={gift.name}
    />
    <LabelledInput
      label="Description"
      name="description"
      {readonly}
      bind:value={gift.description}
    />
    <LabelledInput
      label="Location"
      name="location"
      {readonly}
      bind:value={gift.location}
    />
    <LabelledInput
      label="Price"
      min={0}
      name="price"
      {readonly}
      type="number"
      bind:value={gift.price}
    />
    <LabelledInput
      label="URL"
      name="url"
      {readonly}
      type="url"
      bind:value={gift.url}
    />

    <div class="buttons">
      {#if adding || editing}
        <IconButton icon={faSave} title="Save" type="submit" />
        <IconButton icon={faTimes} title="Cancel" on:click={cancelEdit} />
      {:else}
        <IconButton
          icon={faAngleLeft}
          size="2rem"
          title="Back"
          on:click={() => history.back()}
        />
        <IconButton icon={faPencilAlt} title="Edit" on:click={editGift} />
        <IconButton icon={faTrash} title="Delete" on:click={confirmDelete} />
      {/if}
    </div>
  </form>

  <Dialog bind:dialog title="Confirm Delete">
    <div class="question">
      Are you sure you want to delete {selectedGift ? selectedGift.name : ''}?
    </div>
    <div class="buttons">
      <button on:click={deleteGift}>Yes</button>
      <button on:click={() => dialog.close()}>No</button>
    </div>
  </Dialog>
</div>

<style>
  .buttons {
    display: flex;
    column-gap: 0.5rem;
  }

  .buttons button {
    background-color: var(--secondary-color);
    flex-grow: 1;
  }

  form {
    padding: 0 2px; /* so focus outline is not too close to edges */
    padding-top: 0.5rem;
  }

  form :global(.labelled-input) {
    margin-bottom: 1rem;
  }
</style>
