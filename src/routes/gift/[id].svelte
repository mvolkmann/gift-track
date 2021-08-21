<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';
  import type {Gift} from '$lib/types';

  export async function load({fetch, page}: LoadInput): Promise<LoadOutput> {
    const {id} = page.params;
    const res = await fetch('/api/gift/' + id);
    if (res.status === 404) {
      throw new Error(`No gift with id ${id} was found.`);
    }
    const gift = await res.json();
    return {props: {gift}};
  }
</script>

<script lang="ts">
  import GiftForm from '$lib/GiftForm.svelte';

  export let gift: Gift;
</script>

<GiftForm {gift} />
