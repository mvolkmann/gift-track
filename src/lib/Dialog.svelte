<script lang="ts">
  /**
   * Creates a Dialog that can have a title and any content.
   * A ref must be passed via the `dialog` prop.
   * This is used by the caller to open and close the dialog.
   * The dialog is initially closed.
   *
   * To open the dialog as a modal, `dialog.showModal()`.
   * This does not allow interaction with elements outside the dialog.
   *
   * To open the dialog as a non-modal, `dialog.show()`.
   * This allows interaction with elements outside the dialog.
   *
   * To close the dialog, `dialog.close()`.
   *
   * @param {boolean} canClose - boolean that determines whether
   *   a close "X" should appear (defaults to true)
   * @param {string} className - CSS class name to apply to dialog element
   * @param {string} title - to display in the dialog header
   */

  import {createEventDispatcher, onMount} from 'svelte';

  export let canClose = true;
  export let className = '';
  export let dialog: HTMLDialogElement = null;
  export let title: string;

  const dispatch = createEventDispatcher();

  const classNames = 'dialog' + (className ? ' ' + className : '');

  onMount(() => {
    import('dialog-polyfill').then(module => {
      const dialogPolyfill = module.default;
      dialogPolyfill.registerDialog(dialog);
    });
  });

  function close() {
    dispatch('close');
    dialog.close();
  }
</script>

<dialog bind:this={dialog} class={classNames}>
  {#if title}
    <header>
      <div class="title">{title}</div>
      {#if canClose}
        <button
          class="bare close-btn"
          data-testid="dialog-close-btn"
          on:click={close}
        >
          &#x2716;
        </button>
      {/if}
    </header>
  {/if}
  <section class="body">
    <slot />
  </section>
</dialog>

<style>
  .body {
    padding: 1rem;
  }

  .body :global(.buttons) {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 1rem;
  }

  dialog {
    /* This is automatically given margin values
       that center it in the window. */
    border: none;
    box-shadow: 3px 3px 3px darkgray;
    padding: 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: var(--secondary-color);
    box-sizing: border-box;
    color: var(--bg-color);
    padding: 0.5rem;
    width: 100%;
  }

  header :global(.close-btn) {
    background-color: transparent;
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-left: 1rem;
    padding: 0;
  }

  .title {
    color: var(--primary-color);
    flex-grow: 1;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  dialog::backdrop, /* for native <dialog> */
  :global(dialog + .backdrop) /* for dialog-polyfill */ {
    /* a transparent shade of gray */
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
