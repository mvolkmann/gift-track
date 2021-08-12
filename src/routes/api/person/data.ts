import type {Person} from '$lib/types';

export let lastPersonId = 0;
export const personMap: {[id: string]: Person} = {};

export function addPerson(person: Person) {
  person.id = ++lastPersonId;
  personMap[lastPersonId] = person;
  return person;
}

export function deletePerson(id: string): boolean {
  if (!personMap[id]) return false;
  delete personMap[id];
  return true;
}

export function getPeople() {
  return Object.values(personMap);
}

export function getPerson(id: string) {
  return personMap[id];
}

export function updatePerson(person: Person): boolean {
  if (!personMap[person.id]) return false;
  personMap[person.id] = person;
  return true;
}

addPerson({
  name: 'Tami',
  month: 9,
  day: 9,
  year: 1961
});
