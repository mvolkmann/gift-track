<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';

  export async function load({fetch}: LoadInput): Promise<LoadOutput> {
    let res = await fetch('/api/person');
    await verifyResponse(res, 'people');
    const people = await res.json();

    res = await fetch('/api/occasion');
    await verifyResponse(res, 'occasions');
    const occasions = await res.json();

    return {props: {occasions, people}};
  }
</script>

<script lang="ts">
  import {faPlus} from '@fortawesome/free-solid-svg-icons';
  import {onMount} from 'svelte';
  import {goto} from '$app/navigation';

  import GiftForm from '$lib/GiftForm.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledSelect from '$lib/LabelledSelect.svelte';
  import type {Gift, Occasion, Person} from '$lib/types';
  import {goToErrorPage, sortObjects, verifyResponse} from '$lib/util';

  export let occasions: Occasion[];
  export let people: Person[];

  $: occasions = sortObjects(occasions, 'name') as Occasion[];
  $: people = sortObjects(people, 'name') as Person[];

  let adding = false;

  let gifts: Gift[] = [];
  $: getGifts(selectedPerson, selectedOccasion);

  const newGift: Gift = {
    description: '',
    location: '',
    name: '',
    occasionId: 0,
    personId: 0,
    price: 0,
    url: ''
  };

  let selectedOccasion: Occasion | null = null;
  $: newGift.occasionId = selectedOccasion?.id;

  let selectedPerson: Person | null = null;
  $: newGift.personId = selectedPerson?.id;

  onMount(() => {
    restoreSelections();
  });

  function addGift() {
    // Clear previous data.
    newGift.description = '';
    newGift.location = '';
    newGift.name = '';
    newGift.price = 0;
    newGift.url = '';

    adding = true;
  }

  async function getGifts(person: Person, occasion: Occasion) {
    if (!person || !occasion) return [];

    try {
      const url = `/api/person/${person.id}/occasion/${occasion.id}/gift`;
      const res = await fetch(url);
      await verifyResponse(res, `person ${person.id}, occasion ${occasion.id}`);

      gifts = await res.json();
      sortObjects(gifts, 'name');
    } catch (e) {
      goToErrorPage(e);
    }
  }

  function goToReport() {
    const url = `/person/${selectedPerson.id}/occasion/${selectedOccasion.id}/gift`;
    goto(url);
  }

  function loadGifts() {
    restoreSelections();
    getGifts(selectedPerson, selectedOccasion);
  }

  function restoreSelections() {
    // Restore the last selected person.
    let id = Number(sessionStorage.getItem('person-id'));
    if (id) selectedPerson = people.find(p => p.id === id) as Person;

    // Restore the last selected occasion.
    id = Number(sessionStorage.getItem('occasion-id'));
    if (id) selectedOccasion = occasions.find(p => p.id === id) as Occasion;
  }

  function selectOccasion(event: CustomEvent) {
    selectedOccasion = event.detail;
    sessionStorage.setItem('occasion-id', String(selectedOccasion.id));
  }

  function selectPerson(event: CustomEvent) {
    selectedPerson = event.detail;
    sessionStorage.setItem('person-id', String(selectedPerson.id));
  }
</script>

<section class="people">
  <form on:submit|preventDefault>
    <div>
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
    </div>

    {#if selectedPerson && selectedOccasion}
      {#if adding}
        <GiftForm bind:adding gift={newGift} on:change={loadGifts} />
      {:else}
        {#each gifts as gift}
          <a href={`/gift/${gift.id}`}>{gift.name}</a>
        {:else}
          <p>No gifts found.</p>
        {/each}

        <div>
          <IconButton
            color="white"
            icon={faPlus}
            title="Add Gift"
            on:click={addGift}
          />
        </div>

        {#if gifts.length > 0}
          <button disabled={gifts.length === 0} on:click={goToReport}>
            Show Report
          </button>
        {/if}
      {/if}
    {/if}
  </form>
</section>

<style>
  a {
    display: block;
    margin: 0.5rem 0;
  }

  button {
    margin-top: 0.5rem;
  }

  form {
    padding-bottom: 1rem;
  }

  form > div {
    display: flex;
    gap: 1rem;
  }

  form :global(.labelled-select) {
    margin-bottom: 1rem;
  }
</style>
