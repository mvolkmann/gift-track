import {browser} from '$app/env';
import {goto} from '$app/navigation';
import type {Obj} from '$lib/types';

export function getLastDayInMonth(year: number, month: number): number {
  const date = new Date(year, month, 1);
  date.setDate(0); // wraps back to previous month
  return date.getDate();
}

export function goToErrorPage(error: Error): void {
  if (browser) {
    sessionStorage.setItem('errorMessage', error.toString());
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
