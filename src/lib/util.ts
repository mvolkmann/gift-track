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
    // Get the first line of the error message.
    const text = error.toString();
    const index = text.indexOf('\n');
    errorStore.set(text.substring(0, index));
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

export async function verifyResponse(
  res: globalThis.Response,
  target: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      resolve('');
    } else if (res.status === 404) {
      reject(target + ' not found');
    } else {
      res.text().then(t => {
        console.trace(t);
        reject(t);
      });
    }
  });
}
