import {browser} from '$app/env';
import {goto} from '$app/navigation';
import {errorStore} from '$lib/stores';
import type {Obj} from '$lib/types';

const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function getErrorMessage(error: Error | string): string {
  let text = error.toString();

  // Remove lines after first.
  let index = text.indexOf('\n'); // real newline
  if (index !== -1) text = text.substring(0, index);
  index = text.indexOf('\\n'); // escaped newline
  if (index !== -1) text = text.substring(0, index);

  // Remove Error prefix.
  const PREFIX = 'Error: ';
  if (text.startsWith(PREFIX)) text = text.substring(PREFIX.length);

  // Remove quotes from beginning and end.
  if (text.startsWith('"')) text = text.substring(1);
  if (text.endsWith('"')) text = text.substring(0, text.length - 1);

  return text;
}

export function getLastDayInMonth(year: number, month: number): number {
  if (!month) return 31; // best guess
  if (!year) return DAYS[month - 1]; // can't determine if leap year
  const date = new Date(year, month, 1);
  date.setDate(0); // wraps back to previous month
  return date.getDate();
}

export function goToErrorPage(error: Error | string): void {
  if (browser) {
    errorStore.set(getErrorMessage(error));
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
