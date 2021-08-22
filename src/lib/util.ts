import {browser} from '$app/env';
import {goto} from '$app/navigation';
import {errorStore} from '$lib/stores';
import type {Obj} from '$lib/types';

const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function getLastDayInMonth(year: number, month: number): number {
  if (!month) return 31; // best guess
  if (!year) return DAYS[month - 1]; // can't determine if leap year
  const date = new Date(year, month, 1);
  date.setDate(0); // wraps back to previous month
  return date.getDate();
}

export function goToErrorPage(error: Error): void {
  if (browser) {
    errorStore.set(error.toString());
    goto('/error');
  }
}

// Sorts an array of objects in place on a given property
// that must be a string or number.
export function sortObjects(
  objects: Obj[],
  property: string,
  isNumber = false
): Obj[] {
  const p = property;
  const comparator = isNumber
    ? (o1: Obj, o2: Obj) => (o1[p] as number) - (o2[p] as number)
    : (o1: Obj, o2: Obj) => (o1[p] as string).localeCompare(o2[p] as string);
  objects.sort(comparator);
  return objects;
}

export function verifyResponse(res: globalThis.Response, target: string): void {
  if (res.ok) return;
  if (res.status === 404) throw new Error(target + ' not found');
  res.text().then(t => {
    console.trace(t);
    throw new Error(t);
  });
}
