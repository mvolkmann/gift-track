<script context="module" lang="ts">
  import type {Item} from '$lib/types';
  import {ItemKind} from '$lib/types';

  const kind = ItemKind.OCCASION;

  type LoadType = {
    props: {
      items: Item[];
    };
  };

  export async function load({fetch}): Promise<LoadType> {
    const res = await fetch('/api/' + kind);
    const items = await res.json();
    items.sort((p1: Item, p2: Item) => p1.name.localeCompare(p2.name));
    return {props: {items}};
  }
</script>

<script type="ts">
  import Items from '$lib/Items.svelte';

  export let items: Item[];
</script>

<Items {items} {kind} title="Occasions" />
