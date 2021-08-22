import type {LoadInput, LoadOutput} from '@sveltejs/kit/types';
import type {Item, ItemKind} from '$lib/types';
import {verifyResponse} from '$lib/util';

export async function loadKind(
  kind: ItemKind,
  {fetch}: LoadInput
): Promise<LoadOutput> {
  const res = await fetch('/api/' + kind);
  await verifyResponse(res, kind);

  const items = await res.json();
  items.sort((p1: Item, p2: Item) => p1.name.localeCompare(p2.name));
  return {props: {items}};
}
