import type {Item, ItemKind} from '$lib/types';

type LoadType = {
  props: {
    items: Item[];
  };
};

export async function loadKind(kind: ItemKind, {fetch}): Promise<LoadType> {
  const res = await fetch('/api/' + kind);
  const items = await res.json();
  items.sort((p1: Item, p2: Item) => p1.name.localeCompare(p2.name));
  return {props: {items}};
}
