import type {Item, ItemKind} from '$lib/types';
import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';

export async function loadKind(
  kind: ItemKind,
  {fetch}: LoadInput
): Promise<LoadOutput> {
  const res = await fetch('/api/' + kind);
  const items = await res.json();
  items.sort((p1: Item, p2: Item) => p1.name.localeCompare(p2.name));
  return {props: {items}};
}
