<script>
  import Icon from 'fa-svelte';

  export let color = 'black';
  export let icon;
  export let text = '';
  export let type = 'button';

  function setColor(button) {
    const svg = button.querySelector('svg');
    svg.style.color = color;
  }
</script>

<button class="icon-button" {type} on:click use:setColor>
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
