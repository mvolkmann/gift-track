<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Dialog from '$lib/Dialog.svelte';

  export let dialog: HTMLDialogElement = null;
  export let question: string;

  const dispatch = createEventDispatcher();

  function respond(answer: string) {
    dispatch(answer);
    dialog.close();
  }
</script>

<Dialog className="confirm-dialog" bind:dialog title="Confirm">
  <p>{question}</p>
  <div class="buttons">
    <button on:click={() => respond('yes')}>Yes</button>
    <button on:click={() => respond('no')}>No</button>
  </div>
</Dialog>

<style>
  :global(.confirm-dialog button) {
    background-color: var(--primary-color);
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  p {
    margin-top: 0;
  }
</style>
