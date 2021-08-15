<script lang="ts">
  import {faPlus} from '@fortawesome/free-solid-svg-icons';
  import GiftForm from '$lib/GiftForm.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import LabelledSelect from '$lib/LabelledSelect.svelte';
  import {occasionStore, personStore, toastStore} from '$lib/stores';
  import type {Gift, Occasion, Person} from '$lib/types';
  import {sortObjects} from '$lib/util';

  $: occasions = sortObjects(Object.values($occasionStore), 'name');

  $: people = sortObjects(Object.values($personStore), 'name');

  let adding = false;

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
      {#if selectedPerson && selectedOccasion}
        <IconButton
          color="white"
          icon={faPlus}
          on:click={() => (adding = true)}
        />
      {/if}
    </div>

    <!--TODO: After a person is selected, show all their gifts.
         If an occasion is also selected,
         only show those gifts and the total. -->

    <!-- TODO: Allow deleting a gift with confirmation. -->

    <!-- TODO: Allow adding a gift when both are selected. -->

    {#each gifts as gift}
      <GiftForm {gift} />
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

  form > div {
    display: flex;
    gap: 1rem;
  }
</style>
