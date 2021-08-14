<script context="module" lang="ts">
  import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';
  import {ItemKind} from '$lib/types';
  import {loadKind} from './loader';

  const kind = ItemKind.PERSON;

  export const load = (arg: LoadInput): Promise<LoadOutput> =>
    loadKind(kind, arg);
</script>

<script type="ts">
  import Items from '$lib/Items.svelte';
  import type {Item} from '$lib/types';

  export let items: Item[];
</script>

<Items {items} {kind} title="People" />
