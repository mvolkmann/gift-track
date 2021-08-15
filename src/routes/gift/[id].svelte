<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';
  import type {Gift} from '$lib/types';

  export async function load({fetch, page}: LoadInput): Promise<LoadOutput> {
    const {id} = page.params;
    const res = await fetch('/api/gift/' + id);
    const gift = await res.json();
    return {props: {gift}};
  }
</script>

<script type="ts">
  import {
    faAngleLeft,
    faPencilAlt,
    faSave,
    faTimes,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';

  import Dialog from '$lib/Dialog.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledInput from '$lib/LabelledInput.svelte';

  export let gift: Gift;

  let dialog: HTMLDialogElement;
  let editing = false;
  let savedGift: Gift;
  let selectedGift: Gift;

  function cancelEdit() {
    // Restore previous values.
    gift = savedGift;

    editing = false;
  }

  async function confirmDelete(event: Event) {
    selectedGift = gift;
    dialog.showModal();
  }

  async function deleteGift() {
    const url = `/api/gift/${selectedGift.id}`;
    try {
      const res = await fetch(url, {method: 'DELETE'});
      console.log('gift/[id].svelte deleteGift: res =', res);
      selectedGift = null;
      dialog.close();
      location.href = '/gifts';
    } catch (e) {
      console.error('gift/[id].svelte deleteGift: e =', e);
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

  async function updateGift(event: Event) {
    const url = `/api/gift/${gift.id}`;

    //TODO: Don't allow duplicate names.

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(gift)
      });
      console.log('gift/[id].svelte updateItem: res =', res);

      editing = false;
    } catch (e) {
      console.error('gift/[id].svelte updateItem: e =', e);
    }
  }
</script>

<div class="gift">
  <form class:editing on:submit|preventDefault={updateGift}>
    <div class="buttons">
      {#if editing}
        <IconButton icon={faSave} type="submit" />
        <IconButton icon={faTimes} on:click={cancelEdit} />
      {:else}
        <IconButton
          icon={faAngleLeft}
          size="2rem"
          on:click={() => window.history.back()}
        />
        <IconButton icon={faPencilAlt} on:click={editGift} />
        <IconButton icon={faTrash} on:click={confirmDelete} />
      {/if}
    </div>

    <LabelledInput
      label="Name"
      name="name"
      readonly={!editing}
      bind:value={gift.name}
    />
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
    justify-content: center;
    column-gap: 0.5rem;
  }

  .buttons button {
    background-color: var(--secondary-color);
    flex-grow: 1;
  }
</style>
