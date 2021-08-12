import type {Gift, Occasion, Person} from '$lib/types';

let lastGiftId = 0;
let lastOccasionId = 0;
let lastPersonId = 0;

const giftMap: {[id: number]: Gift} = {};
const occasionMap: {[id: number]: Occasion} = {};
const personMap: {[id: number]: Person} = {};

export function addGift(gift: Gift): Gift {
  gift.id = ++lastGiftId;
  giftMap[lastGiftId] = gift;
  return gift;
}

export function addOccasion(occasion: Occasion): Occasion {
  occasion.id = ++lastOccasionId;
  occasionMap[lastOccasionId] = occasion;
  return occasion;
}

export function addPerson(person: Person): Person {
  person.id = ++lastPersonId;
  personMap[lastPersonId] = person;
  return person;
}

export function deleteGift(id: number): boolean {
  if (!giftMap[id]) return false;
  delete giftMap[id];
  return true;
}

export function deleteOccasion(id: number): boolean {
  if (!occasionMap[id]) return false;
  delete occasionMap[id];
  // Delete all the gifts for this occasion.
  for (const gift of Object.values(giftMap)) {
    if (gift.occasionId === id) delete giftMap[gift.id];
  }
  return true;
}

export function deletePerson(id: number): boolean {
  if (!personMap[id]) return false;
  delete personMap[id];
  // Delete all the gifts for this person.
  for (const gift of Object.values(giftMap)) {
    if (gift.personId === id) delete giftMap[gift.id];
  }
  return true;
}

export function getGifts(): Gift[] {
  return Object.values(giftMap);
}

export function getOccasions(): Occasion[] {
  return Object.values(occasionMap);
}

export function getPeople(): Person[] {
  return Object.values(personMap);
}

export function getGift(id: number): Gift {
  return giftMap[id];
}

export function getOccasion(id: number): Occasion {
  return occasionMap[id];
}

export function getPerson(id: number): Person {
  return personMap[id];
}

export function updateGift(gift: Gift): boolean {
  if (!giftMap[gift.id]) return false;
  giftMap[gift.id] = gift;
  return true;
}

export function updateOccasion(occasion: Occasion): boolean {
  if (!occasionMap[occasion.id]) return false;
  occasionMap[occasion.id] = occasion;
  return true;
}

export function updatePerson(person: Person): boolean {
  if (!personMap[person.id]) return false;
  personMap[person.id] = person;
  return true;
}

const tami = addPerson({
  name: 'Tami',
  month: 9,
  day: 9,
  year: 1961
});

const birthday = addOccasion({
  name: 'Birthday'
});

const christmas = addOccasion({
  name: 'Christmas',
  month: 12,
  day: 25
});

addGift({
  description: 'shop at REI',
  name: 'hiking boots',
  occasionId: birthday.id,
  personId: tami.id,
  price: 120,
  url: 'https://www.rei.com/search?q=hiking+boots+-+women%27'
});

addGift({
  description: 'Get the latest when it comes out.',
  name: 'iPhone',
  occasionId: christmas.id,
  personId: tami.id,
  price: 1000,
  url: 'https://www.apple.com/iphone/'
});
