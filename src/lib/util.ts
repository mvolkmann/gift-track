import type {Obj} from './types';

// Sorts an array of objects in place on a given property
// that must be a string or number.
export function sortObjects(
  objects: Obj[],
  property: string,
  isNumber = false
): Obj[] {
  console.log('util.ts sortObjects: objects =', objects);
  const p = property;
  const comparator = isNumber
    ? (o1: Obj, o2: Obj) => (o1[p] as number) - (o2[p] as number)
    : (o1: Obj, o2: Obj) => (o1[p] as string).localeCompare(o2[p] as string);
  objects.sort(comparator);
  return objects;
}
