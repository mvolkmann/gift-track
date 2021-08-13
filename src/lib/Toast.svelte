<script lang="ts">
  import {toastStore} from '$lib/stores';

  const SHOW_MS = 3000;

  let toast: HTMLDivElement;

  $: if ($toastStore) displayToast();

  function displayToast() {
    toast.style.top = '0'; // slides into view
    setTimeout(() => {
      const {height} = toast.getBoundingClientRect();
      toast.style.top = `-${height}px`; // slides out of view
    }, SHOW_MS);
  }

  function transitionEnd() {
    if (toast.style.top.startsWith('-')) $toastStore = '';
  }
</script>

<div class="toast" bind:this={toast} on:transitionend={transitionEnd}>
  {$toastStore}
</div>

<style>
  .toast {
    --font-size: 1rem;
    --padding: 1rem;
    --height: calc(var(--padding) * 2 + var(--font-size));

    position: absolute;
    right: 0;
    top: calc(var(--height) * -1);

    background-color: var(--secondary-color);
    color: var(--label-color);
    font-size: var(--font-size);
    margin: 0;
    padding: var(--padding);
    transition: top 0.5s;
  }
</style>
