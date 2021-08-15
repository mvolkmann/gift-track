<script lang="ts">
  import LabelledSelect from '$lib/LabelledSelect.svelte';
  import {occasionStore, personStore, toastStore} from '$lib/stores';
  import type {Gift, Occasion, Person} from '$lib/types';
  import {sortObjects} from '$lib/util';
  import Occasions from './occasions.svelte';

  $: occasions = sortObjects(Object.values($occasionStore), 'name');

  $: people = sortObjects(Object.values($personStore), 'name');

  let gifts: Gift[] = [];
  $: getGifts(selectedPerson, selectedOccasion);

  let selectedOccasion: Occasion | null = null;
  let selectedPerson: Person | null = null;

  async function getGifts(person: Person, occasion: Occasion) {
    if (!person || !occasion) return [];

    try {
      const url = `/api/person/${person.id}/occasion/${occasion.id}/gift`;
      const res = await fetch(url);
      gifts = await res.json();
    } catch (e) {
      console.error('gifts.svelte getGifts: e =', e);
    }
  }

  function goToReport() {
    const url = `/person/${selectedPerson.id}/occasion/${selectedOccasion.id}/gift`;
    location.href = url;
  }

  function selectOccasion(event: CustomEvent) {
    selectedOccasion = event.detail;
  }

  function selectPerson(event: CustomEvent) {
    selectedPerson = event.detail;
  }
</script>

<section class="people">
  <form on:submit|preventDefault>
    <LabelledSelect
      label="Person"
      name="person-select"
      options={people}
      selectedOption={selectedPerson}
      textProperty="name"
      valueProperty="id"
      on:change={selectPerson}
    />

    <LabelledSelect
      label="Occasion"
      name="occasion-select"
      options={occasions}
      selectedOption={selectedOccasion}
      textProperty="name"
      valueProperty="id"
      on:change={selectOccasion}
    />

    <!--TODO: After a person is selected, show all their gifts.
         If an occasion is also selected,
         only show those gifts and the total. -->

    <!-- TODO: Allow deleting a gift with confirmation. -->

    <!-- TODO: Allow adding a gift when both are selected. -->

    {#each gifts as gift}
      <div>{gift.name}</div>
    {:else}
      <div>No gifts found.</div>
    {/each}

    <button disabled={gifts.length === 0} on:click={goToReport}>
      Go to Report
    </button>
  </form>
</section>

<style>
  button {
    margin-top: 1rem;
  }
</style>
