<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';
  import type {Gift} from '$lib/types';
  import {verifyResponse} from '$lib/util';

  export async function load({fetch, page}: LoadInput): Promise<LoadOutput> {
    const {id} = page.params;
    const res = await fetch('/api/gift/' + id);
    verifyResponse(res, 'gift ' + id);

    const gift = await res.json();
    return {props: {gift}};
  }
</script>

<script lang="ts">
  import GiftForm from '$lib/GiftForm.svelte';

  export let gift: Gift;
</script>

<GiftForm {gift} />
