<script lang="ts">
  export let message: string;

  const SHOW_MS = 3000;

  let toast: HTMLDivElement;

  $: if (toast && message) {
    toast.style.top = '0'; // slides into view
    setTimeout(() => {
      const {height} = toast.getBoundingClientRect();
      toast.style.top = `-${height}px`; // slides out of view
    }, SHOW_MS);
  }

  function transitionEnd() {
    console.log(
      'Toast.svelte transitionend: toast.style.top =',
      toast.style.top
    );
    if (toast.style.top.startsWith('-')) message = '';
  }
</script>

<div class="toast" bind:this={toast} on:transitionend={transitionEnd}>
  {message}
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
    transition: top 1s;
  }
</style>
