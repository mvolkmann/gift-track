<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';
  import GiftDetail from '$lib/GiftDetail.svelte';

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

  let total = 0;
  $: total = gifts.reduce((acc, gift) => acc + gift.price, 0);

  function back() {
    //TODO: Which of these approaches is better?
    history.back();
    //goto(document.referrer || '/');
  }
</script>

<h2>{person.name}'s {occasion.name} Gifts</h2>

{#each gifts as gift}
  <GiftDetail {gift} />
{:else}
  <p>No gifts found.</p>
{/each}

<p class="total">
  Total: ${total}
</p>

<button on:click={back}>Back</button>

<style>
  h2 {
    margin-top: 0;
  }

  .total {
    margin-bottom: 1rem;
  }
</style>
