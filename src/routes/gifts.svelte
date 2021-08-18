<script lang="ts">
  import {faPlus} from '@fortawesome/free-solid-svg-icons';
  import {onMount} from 'svelte';
  import {goto} from '$app/navigation';

  //import GiftForm from '$lib/GiftForm.svelte';
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

  onMount(() => {
    // Restore the last selected person.
    let id = Number(sessionStorage.getItem('person-id'));
    if (id) selectedPerson = people.find(p => p.id === id) as Person;

    // Restore the last selected occasion.
    id = Number(sessionStorage.getItem('person-id'));
    if (id) selectedOccasion = occasions.find(p => p.id === id) as Occasion;
  });

  async function getGifts(person: Person, occasion: Occasion) {
    if (!person || !occasion) return [];

    //try {
    const url = `/api/person/${person.id}/occasion/${occasion.id}/gift`;
    const res = await fetch(url);
    console.log('gifts.svelte getGifts: res.status =', res.status);
    if (res.status !== 200) throw new Error(await res.text());
    //TODO: How can you make this render the error page?
    //TODO: Is seems that only happens when an Error is thrown in a load function.
    gifts = await res.json();
    // } catch (e) {
    //   console.error('gifts.svelte getGifts: e =', e);
    // }
  }

  function goToReport() {
    const url = `/person/${selectedPerson.id}/occasion/${selectedOccasion.id}/gift`;
    goto(url);
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

<!-- TODO: Implementing adding a new gift. Use GiftForm?
     But don't duplicate all the code between GiftForm
     and src/routes/gift/[id].svelte.  -->

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

    <!--TODO: After a person is selected, show all their gifts.
         If an occasion is also selected,
         only show those gifts and the total. -->

    <!-- TODO: Allow adding a gift when both are selected. -->

    {#if selectedPerson && selectedOccasion}
      {#if adding}
        <p>display form for adding a gift</p>
      {:else}
        <div>
          <IconButton
            color="white"
            icon={faPlus}
            title="Add Gift"
            on:click={() => (adding = true)}
          />
        </div>
        {#each gifts as gift}
          <a href={`/gift/${gift.id}`}>{gift.name}</a>
        {:else}
          <p>No gifts found.</p>
        {/each}
      {/if}

      <button disabled={gifts.length === 0} on:click={goToReport}>
        Go to Report
      </button>
    {/if}
  </form>
</section>

<style>
  a {
    display: block;
    margin-top: 1rem;
  }

  button {
    margin-top: 1rem;
  }

  form > div {
    display: flex;
    gap: 1rem;
  }
</style>
