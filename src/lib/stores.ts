import {writable} from 'svelte/store';

import type {
  Gift,
  GiftMap,
  Occasion,
  OccasionMap,
  Person,
  PersonMap
} from '$lib/types';

export const giftStore = writable<GiftMap>({});
export const occasionStore = writable<OccasionMap>({});
export const personStore = writable<PersonMap>({});
export const toastStore = writable<string>('');

let lastGiftId = 0;
let lastOccasionId = 0;
let lastPersonId = 0;

export function addGift(gift: Gift): number {
  const id = (gift.id = ++lastGiftId);
  giftStore.update(map => {
    map[id] = gift;
    return map;
  });
  return gift.id;
}

export function addOccasion(occasion: Occasion): number {
  const id = (occasion.id = ++lastOccasionId);
  occasionStore.update(map => {
    map[id] = occasion;
    return map;
  });
  return id;
}

export function addPerson(person: Person): number {
  const id = (person.id = ++lastPersonId);
  personStore.update(map => {
    map[id] = person;
    return map;
  });
  return id;
}

addOccasion({name: 'Birthday'});
addOccasion({name: 'Christmas', month: 11, day: 25});
addOccasion({name: 'Halloween', month: 10, day: 31});

addPerson({name: 'Tami', month: 9, day: 9, year: 1961});
addPerson({name: 'Amanda', month: 7, day: 22, year: 1985});
addPerson({name: 'RC', month: 2, day: 27, year: 1981});
addPerson({name: 'Jeremy', month: 4, day: 30, year: 1987});
addPerson({name: 'Meghan', month: 7, day: 9, year: 1989});
