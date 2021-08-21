<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {Obj} from '$lib/types';

  export let label: string;
  export let name: string;
  export let options: Obj[];
  export let required = false;
  export let selectedOption: Obj;
  export let textProperty: string;
  export let valueProperty = '';

  const dispatch = createEventDispatcher();

  function onChange(event: Event) {
    const element = event.target as HTMLSelectElement;
    const {value} = element; // a string
    const option = options.find(o => String(o[valueProperty]) === value);
    dispatch('change', option);
  }
</script>

<div class="labelled-select">
  <label for={name}>
    {label}
    {#if required}
      <span class="required">*</span>
    {/if}
  </label>
  <select
    id={name}
    {required}
    value={selectedOption ? selectedOption[valueProperty] : ''}
    on:blur={onChange}
    on:change={onChange}
  >
    <option value={undefined}>Select...</option>
    {#each options as option}
      <option value={option[valueProperty || textProperty]}>
        {option[textProperty]}
      </option>
    {/each}
  </select>
</div>

<style>
  select {
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
  }

  .required {
    color: white;
    font-size: 1.7rem;
    position: relative;
    top: 0.6rem;
  }
</style>
