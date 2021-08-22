<script lang="ts">
  import {getLastDayInMonth} from '$lib/util';

  export let editing = false;
  export let month: number | undefined = undefined;
  export let day: number | undefined = undefined;
  export let year: number | undefined = undefined;
  export let minYear = 1920;
  export let maxYear = new Date().getFullYear() + 1;

  let lastDayInMonth: number;
  $: lastDayInMonth = getLastDayInMonth(year, month);

  function getDate(): string {
    let bd = `${month || 1}/${day || 1}`;
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
