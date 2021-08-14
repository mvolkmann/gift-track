<script context="module" lang="ts">
  import {ItemKind} from '$lib/types';
  import {loadKind} from './item';

  const kind = ItemKind.PERSON;

  export async function load(arg) {
    return loadKind(kind, arg);
  }
</script>

<script type="ts">
  import Items from '$lib/Items.svelte';
  import type {Item} from '$lib/types';

  export let items: Item[];
</script>

<Items {items} {kind} title="People" />
