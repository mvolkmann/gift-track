<script context="module" lang="ts">
  import {ItemKind} from '$lib/types';
  import {loadKind} from './loader';

  const kind = ItemKind.OCCASION;

  export const load = arg => loadKind(kind, arg);
</script>

<script type="ts">
  import Items from '$lib/Items.svelte';
  import type {Item} from '$lib/types';

  export let items: Item[];
</script>

<Items {items} {kind} title="Occasions" />
