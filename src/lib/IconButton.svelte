<script lang="ts">
  import type {IconDefinition} from '@fortawesome/fontawesome-common-types';

  import Icon from 'fa-svelte';

  export let color = 'var(--label-color)';
  export let icon: IconDefinition;
  export let size = '1.5rem';
  export let text = '';
  export let title = '';
  export let type = 'button';

  function setup(button: HTMLButtonElement) {
    const svg = button.querySelector('svg');
    svg.style.color = color;
    svg.style.fontSize = size;
  }
</script>

<button class="icon-button" {title} {type} on:click use:setup>
  <Icon {icon} />
  {text}
</button>

<style>
  .icon-button {
    display: inline-block;

    background-color: transparent;
    padding: 0;
  }
</style>
