<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';

  export async function load({page, fetch}: LoadInput): Promise<LoadOutput> {
    const personId = Number(page.params.personId);
    const occasionId = Number(page.params.occasionId);

    let res = await fetch(`/api/person/${personId}`);
    const person = await res.json();

    res = await fetch(`/api/occasion/${occasionId}`);
    const occasion = await res.json();

    const url = `/api/person/${personId}/occasion/${occasionId}/gift`;
    res = await fetch(url);
    const gifts = await res.json();

    return {props: {person, occasion, gifts}};
  }
</script>

<script lang="ts">
  import type {Gift, Occasion, Person} from '$lib/types';

  export let gifts: Gift[];
  export let occasion: Occasion;
  export let person: Person;
</script>

<h2>{person.name}'s {occasion.name} Gifts</h2>

{#each gifts as gift}
  <div>{gift.name}</div>
{:else}
  <p>No gifts found.</p>
{/each}
