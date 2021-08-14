<script lang="ts">
  export let label: string;
  export let max = -1;
  export let min = -1;
  export let name: string;
  export let required = false;
  export let type = 'text';
  export let value: string | number;

  type PropsType = {
    max?: number;
    min?: number;
  };

  const props: PropsType = {};
  if (max !== -1) props.max = max;
  if (min !== -1) props.min = min;
</script>

<div class="labelled-input">
  <label for={name}>{label}</label>
  {#if type === 'date'}
    <input type="date" {required} bind:value />
  {:else if type === 'number'}
    <input type="number" {required} bind:value {...props} />
  {:else}
    <input type="text" {required} bind:value />
  {/if}
</div>

<style>
  input {
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
  }

  .labelled-input {
    margin-bottom: 1rem;
  }
</style>
