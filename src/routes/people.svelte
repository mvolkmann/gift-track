<script context="module" lang="ts">
  export async function load({fetch}) {
    const res = await fetch('/api/person');
    const people = await res.json();
    people.sort((p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
    return {props: {people}};
  }
</script>

<script type="ts">
  import {faUserPlus} from '@fortawesome/free-solid-svg-icons';

  import IconButton from '$lib/IconButton.svelte';
  import PersonAddForm from '$lib/PersonAddForm.svelte';
  import PersonEditForm from '$lib/PersonEditForm.svelte';
  import type {Person} from '$lib/types';

  export let people: Person[];

  let adding = false;

  function addedPerson(event: CustomEvent) {
    const newPerson = event.detail as Person;
    people.push(newPerson);
    adding = false;
  }

  function deletePerson(event: CustomEvent) {
    const id = event.detail as number;
    people = people.filter(p => p.id !== id);
  }

  function updatePeople() {
    people = people; // trigger reactivity
  }
</script>

<section class="people">
  <h2>
    People
    <IconButton
      color="white"
      icon={faUserPlus}
      on:click={() => (adding = true)}
    />
  </h2>
  <section class="scroll">
    {#if adding}
      <PersonAddForm
        on:added={addedPerson}
        on:cancel={() => (adding = false)}
      />
    {:else}
      {#each people as person}
        <PersonEditForm
          {person}
          on:delete={deletePerson}
          on:update={updatePeople}
        />
      {/each}
    {/if}
  </section>
</section>

<style>
  h2 {
    display: flex;
    align-items: center;
    gap: 1rem;

    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  .people {
    display: flex;
    flex-direction: column;

    flex-grow: 1;
    height: 100%;
  }

  .people :global(svg) {
    font-size: 1.5rem;
  }

  .scroll {
    flex-grow: 1;
    overflow-y: scroll;
  }
</style>
