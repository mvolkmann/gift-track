<script lang="ts">
  import {faPlus} from '@fortawesome/free-solid-svg-icons';
  import {onMount} from 'svelte';
  import {goto} from '$app/navigation';

  import GiftForm from '$lib/GiftForm.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledSelect from '$lib/LabelledSelect.svelte';
  import {occasionStore, personStore} from '$lib/stores';
  import type {Gift, Occasion, Person} from '$lib/types';
  import {goToErrorPage, sortObjects, verifyResponse} from '$lib/util';

  $: occasions = sortObjects(Object.values($occasionStore), 'name');
  $: people = sortObjects(Object.values($personStore), 'name');

  let adding = false;

  let gifts: Gift[] = [];
  $: getGifts(selectedPerson, selectedOccasion);

  let newGift: Gift | undefined;

  let selectedOccasion: Occasion | null = null;
  let selectedPerson: Person | null = null;

  onMount(() => {
    // Restore the last selected person.
    let id = Number(sessionStorage.getItem('person-id'));
    if (id) selectedPerson = people.find(p => p.id === id) as Person;

    // Restore the last selected occasion.
    id = Number(sessionStorage.getItem('person-id'));
    if (id) selectedOccasion = occasions.find(p => p.id === id) as Occasion;
  });

  function addGift() {
    newGift = {
      description: '',
      location: '',
      name: '',
      occasionId: selectedOccasion.id,
      personId: selectedPerson.id,
      price: 0,
      url: ''
    };
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
    getGifts(selectedPerson, selectedOccasion);
  }

  function selectOccasion(event: CustomEvent) {
    selectedOccasion = event.detail;
    sessionStorage.setItem('occasion-id', String(selectedPerson.id));
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
