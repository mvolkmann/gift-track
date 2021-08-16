<script lang="ts">
  export let label: string;
  export let max = -1;
  export let min = -1;
  export let name: string;
  export let readonly = false;
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

{#if !readonly || value}
  <div class="labelled-input">
    <label for={name}>
      {label}
      {#if required && !readonly}
        <span class="required">*</span>
      {/if}
    </label>
    {#if type === 'date'}
      <input type="date" {readonly} {required} bind:value />
    {:else if type === 'number'}
      <input type="number" {readonly} {required} bind:value {...props} />
    {:else if type === 'url'}
      {#if readonly}
        <a alt={name} href={String(value)} rel="noopener" target="_blank">
          {value}
        </a>
      {:else}
        <input type="url" {required} bind:value {...props} />
      {/if}
    {:else}
      <input type="text" {readonly} {required} bind:value />
    {/if}
  </div>
{/if}

<style>
  input {
    border: none;
    border-radius: 0.25rem;
    box-sizing: border-box;
    padding: 0.5rem;
    width: 100%;
  }

  input:read-only {
    background-color: transparent;
    color: var(--label-color);
    padding: 0;
  }

  label {
    display: block;
    color: var(--secondary-color);
    margin-bottom: 0.25rem;
  }

  .labelled-input {
    margin-bottom: 1rem;
  }

  .required {
    color: white;
    font-size: 1.7rem;
    position: relative;
    top: 0.6rem;
  }
</style>
