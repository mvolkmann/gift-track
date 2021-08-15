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

export function getAllGifts(): Gift[] {
  return Object.values(giftMap);
}

export function getGifts(personId: number, occasionId: number): Gift[] {
  return Object.values(giftMap).filter(
    gift => gift.personId === personId && gift.occasionId === occasionId
  );
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

addPerson({
  name: 'Mark',
  month: 4,
  day: 16,
  year: 1961
});

addPerson({
  name: 'Amanda',
  month: 7,
  day: 22,
  year: 1985
});

addPerson({
  name: 'Jeremy',
  month: 4,
  day: 30,
  year: 1987
});

addPerson({
  name: 'RC',
  month: 2,
  day: 27,
  year: 1981
});

addPerson({
  name: 'Meghan',
  month: 7,
  day: 9,
  year: 1988
});

addPerson({
  name: 'Richard',
  month: 7,
  day: 28,
  year: 1940
});

addPerson({
  name: 'Pat',
  month: 2,
  day: 16,
  year: 1947
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
  occasionId: christmas.id,
  personId: tami.id,
  price: 120,
  url: 'https://www.rei.com/search?q=hiking+boots+-+women%27'
});

addGift({
  description: 'Momentum',
  name: 'water bottle',
  occasionId: birthday.id,
  personId: tami.id,
  price: 15,
  url:
    'https://www.momentumcycles.com/product/salsa-purist-insulated-water-bottle-362281-1.htm'
});

addGift({
  description: 'Get the latest when it comes out.',
  name: 'iPhone',
  occasionId: birthday.id,
  personId: tami.id,
  price: 1000,
  url: 'https://www.apple.com/iphone/'
});

//console.log('data.ts x: giftMap =', giftMap);
