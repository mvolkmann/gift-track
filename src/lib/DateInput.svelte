<script lang="ts">
  import {getLastDayInMonth} from './util';

  export let editing = false;
  export let month: number;
  export let day: number;
  export let year: number;
  export let minYear = 1920;
  export let maxYear = new Date().getFullYear() + 1;

  let lastDayInMonth: number;
  $: lastDayInMonth = getLastDayInMonth(year, month);

  function getDate(): string {
    let bd = `${month}/${day}`;
    if (year) bd += `/${year}`;
    return bd;
  }
</script>

<div class="date-input">
  {#if editing}
    <input type="number" min="1" max="12" bind:value={month} />
    <span>/</span>
    <input type="number" min="1" max={lastDayInMonth} bind:value={day} />
    <span>/</span>
    <input type="number" min={minYear} max={maxYear} bind:value={year} />
  {:else}
    {getDate()}
  {/if}
</div>

<style>
  .date-input {
    display: flex;
  }
</style>
