<script lang="ts">
  import Icon from 'fa-svelte';

  export let color = 'black';
  export let icon;
  export let size = '1.5rem';
  export let text = '';
  export let type = 'button';

  function setup(button: HTMLButtonElement) {
    const svg = button.querySelector('svg');
    svg.style.color = color;
    svg.style.fontSize = size;
  }
</script>

<button class="icon-button" {type} on:click use:setup>
  <Icon {icon} />
  {text}
</button>

<style>
  .icon-button {
    display: inline-block;

    background-color: transparent;
    padding: 0;
  }

  .icon-button :global(svg) {
    fill: currentColor;
  }
</style>
