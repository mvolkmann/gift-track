// This defines server-side data storage and performs data validation.

import sqlite from 'better-sqlite3';
import type {RunResult, Statement} from 'better-sqlite3';

//TODO: localStorage is not defined server-side!
enum DataMode {
  DATABASE,
  LOCAL_STORAGE,
  MEMORY
}

const mode: DataMode = DataMode.DATABASE;
//const mode: DataMode = DataMode.MEMORY;
//const mode: DataMode = DataMode.LOCAL_STORAGE;

let deleteGiftPS: Statement;
let deleteOccasionPS: Statement;
let deletePersonPS: Statement;
let getAllGiftsPS: Statement;
let getAllOccasionsPS: Statement;
let getAllPeoplePS: Statement;
let getGiftPS: Statement;
let getGiftsPS: Statement;
let getOccasionPS: Statement;
let getPersonPS: Statement;
let insertGiftPS: Statement;
let insertOccasionPS: Statement;
let insertPersonPS: Statement;
let updateGiftPS: Statement;
let updateOccasionPS: Statement;
let updatePersonPS: Statement;

import type {Gift, Occasion, Person} from '$lib/types';

let lastGiftId = 0;
let lastOccasionId = 0;
let lastPersonId = 0;

const giftMap: {[id: number]: Gift} = {};
const occasionMap: {[id: number]: Occasion} = {};
const personMap: {[id: number]: Person} = {};

function addData() {
  if (mode === DataMode.DATABASE) databaseSetup();

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

  //   addPerson({
  //     name: 'Amanda',
  //     month: 7,
  //     day: 22,
  //     year: 1985
  //   });

  //   addPerson({
  //     name: 'Jeremy',
  //     month: 4,
  //     day: 30,
  //     year: 1987
  //   });

  //   addPerson({
  //     name: 'RC',
  //     month: 2,
  //     day: 27,
  //     year: 1981
  //   });

  //   addPerson({
  //     name: 'Meghan',
  //     month: 7,
  //     day: 9,
  //     year: 1988
  //   });

  //   addPerson({
  //     name: 'Richard',
  //     month: 7,
  //     day: 28,
  //     year: 1940
  //   });

  //   addPerson({
  //     name: 'Pat',
  //     month: 2,
  //     day: 16,
  //     year: 1947
  //   });

  const birthday = addOccasion({
    name: 'Birthday'
  });

  const christmas = addOccasion({
    name: 'Christmas',
    month: 12,
    day: 25
  });

  //   addGift({
  //     description: 'shop at REI',
  //     name: 'hiking boots',
  //     occasionId: christmas.id,
  //     personId: tami.id,
  //     price: 120,
  //     url: 'https://www.rei.com/search?q=hiking+boots+-+women%27'
  //   });

  //   addGift({
  //     description: 'Momentum',
  //     name: 'water bottle',
  //     occasionId: birthday.id,
  //     personId: tami.id,
  //     price: 15,
  //     url:
  //       'https://www.momentumcycles.com/product/salsa-purist-insulated-water-bottle-362281-1.htm'
  //   });

  //   addGift({
  //     description: 'Get the latest when it comes out.',
  //     name: 'iPhone',
  //     occasionId: birthday.id,
  //     personId: tami.id,
  //     price: 1000,
  //     url: 'https://www.apple.com/iphone/'
  //   });
}

export function addGift(gift: Gift): Gift {
  const name = gift.name.toLowerCase();

  switch (mode) {
    case DataMode.DATABASE:
      try {
        const result: RunResult = insertGiftPS.run(
          gift.description,
          gift.location,
          gift.name,
          gift.occasionId,
          gift.personId,
          gift.price,
          gift.url
        );
        gift.id = result.lastInsertRowid as number;
      } catch (e) {
        const isDuplicate = e.toString().includes('UNIQUE constraint failed');
        throw isDuplicate ? new Error(getDuplicateMessage(gift)) : e;
      }
      break;

    case DataMode.LOCAL_STORAGE: {
      const giftMap = JSON.parse(localStorage.getItem('gifts'));
      giftMap[gift.id] = gift;
      localStorage.setItem('gifts', JSON.stringify(giftMap));
      break;
    }

    case DataMode.MEMORY:
      if (
        Object.values(giftMap).some(
          g =>
            g.name.toLowerCase() === name &&
            g.personId === gift.personId &&
            g.occasionId === gift.occasionId
        )
      ) {
        const personName = personMap[gift.personId].name;
        const occasionName = occasionMap[gift.occasionId].name;
        throw new Error(
          `duplicate ${gift.name} ${occasionName} gift for ${personName}`
        );
      }

      gift.id = ++lastGiftId;
      giftMap[lastGiftId] = gift;
      break;
  }

  return gift;
}

export function addOccasion(occasion: Occasion): Occasion {
  switch (mode) {
    case DataMode.DATABASE:
      try {
        const result: RunResult = insertOccasionPS.run(
          occasion.name,
          occasion.month,
          occasion.day,
          occasion.year
        );
        occasion.id = result.lastInsertRowid as number;
      } catch (e) {
        const isDuplicate = e.toString().includes('UNIQUE constraint failed');
        throw isDuplicate
          ? new Error('duplicate occasion name ' + occasion.name)
          : e;
      }
      break;

    case DataMode.LOCAL_STORAGE: {
      const occasionMap = JSON.parse(localStorage.getItem('occasions'));
      occasionMap[occasion.id] = occasion;
      localStorage.setItem('occasions', JSON.stringify(occasionMap));
      break;
    }

    case DataMode.MEMORY: {
      const name = occasion.name.toLowerCase();
      if (Object.values(occasionMap).some(o => o.name.toLowerCase() === name)) {
        throw new Error('duplicate occasion name ' + occasion.name);
      }

      occasion.id = ++lastOccasionId;
      occasionMap[lastOccasionId] = occasion;
      break;
    }
  }

  return occasion;
}

export function addPerson(person: Person): Person {
  switch (mode) {
    case DataMode.DATABASE:
      try {
        const result: RunResult = insertPersonPS.run(
          person.name,
          person.month,
          person.day,
          person.year
        );
        person.id = result.lastInsertRowid as number;
      } catch (e) {
        const isDuplicate = e.toString().includes('UNIQUE constraint failed');
        throw isDuplicate
          ? new Error('duplicate person name ' + person.name)
          : e;
      }
      break;

    case DataMode.LOCAL_STORAGE: {
      const personMap = JSON.parse(localStorage.getItem('people'));
      personMap[person.id] = person;
      localStorage.setItem('people', JSON.stringify(personMap));
      break;
    }

    case DataMode.MEMORY: {
      const name = person.name.toLowerCase();
      if (Object.values(personMap).some(o => o.name.toLowerCase() === name)) {
        throw new Error('duplicate person name ' + person.name);
      }

      person.id = ++lastPersonId;
      personMap[lastPersonId] = person;
      break;
    }
  }

  return person;
}

function databaseSetup() {
  // To create the initial, empty database,
  // enter "sqlite3 gift-track.db" and ".exit";

  // Open existing database file or creating if missing.
  const db = sqlite('gift-track.db');

  // This pragma must be enabled in order to
  // check foreign key constraints and perform cascading deletes.
  db.pragma('foreign_key = true');

  // Delete the tables if they already exist.
  db.exec('drop table if exists gifts');
  db.exec('drop table if exists people');
  db.exec('drop table if exists occasions');

  // Create the tables.
  db.exec(
    'create table people (' +
      'id integer primary key autoincrement, ' +
      'name string, ' +
      'month integer, ' +
      'day integer, ' +
      'year integer, ' +
      'unique (name collate nocase))' // case insensitive
  );

  db.exec(
    'create table occasions (' +
      'id integer primary key autoincrement, ' +
      'name string, ' +
      'month integer, ' +
      'day integer, ' +
      'year integer, ' +
      'unique (name collate nocase))' // case insensitive
  );

  db.exec(
    'create table gifts (' +
      'id integer primary key autoincrement, ' +
      'description string, ' +
      'location string, ' +
      'name string, ' +
      'occasionId integer, ' +
      'personId integer, ' +
      'price numeric, ' +
      'url string, ' +
      'unique (name collate nocase), ' + // case insensitive
      'constraint fk_occasion foreign key ' +
      '  (occasionId) references occasions(id) on delete cascade ' +
      'constraint fk_person foreign key ' +
      '  (personId) references people(id) on delete cascade ' +
      ')'
  );

  // Insert initial data.
  insertGiftPS = db.prepare(
    'insert into gifts ' +
      '(description, location, name, occasionId, personId, price, url) ' +
      'values (?, ?, ?, ?, ?, ?, ?)'
  );
  insertOccasionPS = db.prepare(
    'insert into occasions (name, month, day, year) values (?, ?, ?, ?)'
  );
  insertPersonPS = db.prepare(
    'insert into people (name, month, day, year) values (?, ?, ?, ?)'
  );

  // Create the prepared statements used by other functions.

  getAllGiftsPS = db.prepare('select * from gifts');
  getAllOccasionsPS = db.prepare('select * from occasions');
  getAllPeoplePS = db.prepare('select * from people');
  getGiftPS = db.prepare('select * from gifts where id = ?');
  getGiftsPS = db.prepare(
    'select * from gifts where personId = ? and occasionId = ?'
  );
  getOccasionPS = db.prepare('select * from occasions where id = ?');
  getPersonPS = db.prepare('select * from people where id = ?');

  updateGiftPS = db.prepare(
    'update gifts set ' +
      'description=?, location=?, name=?, occasionId=?, personId=?, price=?, url=? ' +
      'where id = ?'
  );
  updateOccasionPS = db.prepare(
    'update occasions set name=?, month=?, day=?, year=? where id = ?'
  );
  updatePersonPS = db.prepare(
    'update people set name=?, month=?, day=?, year=? where id = ?'
  );

  deleteGiftPS = db.prepare('delete from gifts where id = ?');
  deleteOccasionPS = db.prepare('delete from occasions where id = ?');
  deletePersonPS = db.prepare('delete from people where id = ?');
}

export function deleteGift(id: number): boolean {
  switch (mode) {
    case DataMode.DATABASE:
      deleteGiftPS.run(id);
      break;
    case DataMode.LOCAL_STORAGE: {
      const giftMap = JSON.parse(localStorage.getItem('gifts'));
      delete giftMap[id];
      localStorage.setItem('gifts', JSON.stringify(giftMap));
      break;
    }
    case DataMode.MEMORY:
      if (!giftMap[id]) return false;
      delete giftMap[id];
  }
  return true;
}

export function deleteOccasion(id: number): boolean {
  switch (mode) {
    case DataMode.DATABASE:
      // This does a cascading delete, deleting all gifts for this occasion.
      deleteOccasionPS.run(id);
      break;
    case DataMode.LOCAL_STORAGE: {
      const occasionMap = JSON.parse(localStorage.getItem('occasions'));
      delete occasionMap[id];
      localStorage.setItem('occasions', JSON.stringify(occasionMap));
      break;
    }
    case DataMode.MEMORY:
      if (!occasionMap[id]) return false;
      delete occasionMap[id];
      // Delete all the gifts for this occasion.
      for (const gift of Object.values(giftMap)) {
        if (gift.occasionId === id) delete giftMap[gift.id];
      }
  }
  return true;
}

export function deletePerson(id: number): boolean {
  switch (mode) {
    case DataMode.DATABASE:
      // This does a cascading delete, deleting all gifts for this person.
      deletePersonPS.run(id);
      break;
    case DataMode.LOCAL_STORAGE: {
      const personMap = JSON.parse(localStorage.getItem('people'));
      delete personMap[id];
      localStorage.setItem('people', JSON.stringify(personMap));
      break;
    }
    case DataMode.MEMORY:
      if (!personMap[id]) return false;
      delete personMap[id];
      // Delete all the gifts for this person.
      for (const gift of Object.values(giftMap)) {
        if (gift.personId === id) delete giftMap[gift.id];
      }
  }
  return true;
}

export function getAllGifts(): Gift[] {
  switch (mode) {
    case DataMode.DATABASE:
      return (getAllGiftsPS.all() as unknown) as Gift[];
    case DataMode.LOCAL_STORAGE: {
      const giftMap = JSON.parse(localStorage.getItem('gifts'));
      return Object.values(giftMap);
    }
    case DataMode.MEMORY:
      return Object.values(giftMap);
  }
}

function getDuplicateMessage(gift: Gift) {
  const person = getPerson(gift.personId);
  const occasion = getOccasion(gift.occasionId);
  return `duplicate ${gift.name} ${occasion.name} gift for ${person.name}`;
}

export function getGifts(personId: number, occasionId: number): Gift[] {
  switch (mode) {
    case DataMode.DATABASE:
      return (getGiftsPS.all(personId, occasionId) as unknown) as Gift[];
    case DataMode.LOCAL_STORAGE: {
      const giftMap = JSON.parse(localStorage.getItem('gifts'));
      const gifts = Object.values(giftMap) as Gift[];
      return gifts.filter(
        gift => gift.personId === personId && gift.occasionId === occasionId
      );
    }
    case DataMode.MEMORY:
      return Object.values(giftMap).filter(
        gift => gift.personId === personId && gift.occasionId === occasionId
      );
  }
}

export function getAllOccasions(): Occasion[] {
  switch (mode) {
    case DataMode.DATABASE:
      return (getAllOccasionsPS.all() as unknown) as Occasion[];
    case DataMode.LOCAL_STORAGE: {
      const occasionMap = JSON.parse(localStorage.getItem('occasions'));
      return Object.values(occasionMap);
    }
    case DataMode.MEMORY:
      return Object.values(occasionMap);
  }
}

export function getAllPeople(): Person[] {
  switch (mode) {
    case DataMode.DATABASE:
      return (getAllPeoplePS.all() as unknown) as Person[];
    case DataMode.LOCAL_STORAGE: {
      const personMap = JSON.parse(localStorage.getItem('people'));
      return Object.values(personMap);
    }
    case DataMode.MEMORY:
      return Object.values(personMap);
  }
}

export function getGift(id: number): Gift {
  switch (mode) {
    case DataMode.DATABASE:
      return (getGiftPS.get(id) as unknown) as Gift;
    case DataMode.LOCAL_STORAGE: {
      const giftMap = JSON.parse(localStorage.getItem('gifts'));
      return giftMap[id];
    }
    case DataMode.MEMORY:
      return giftMap[id];
  }
}

export function getOccasion(id: number): Occasion {
  switch (mode) {
    case DataMode.DATABASE:
      return (getOccasionPS.get(id) as unknown) as Occasion;
    case DataMode.LOCAL_STORAGE: {
      const occasionMap = JSON.parse(localStorage.getItem('occasions'));
      return occasionMap[id];
    }
    case DataMode.MEMORY:
      return occasionMap[id];
  }
}

export function getPerson(id: number): Person {
  switch (mode) {
    case DataMode.DATABASE:
      return (getPersonPS.get(id) as unknown) as Person;
    case DataMode.LOCAL_STORAGE: {
      const personMap = JSON.parse(localStorage.getItem('people'));
      return personMap[id];
    }
    case DataMode.MEMORY:
      return personMap[id];
  }
}

export function updateGift(gift: Gift): boolean {
  switch (mode) {
    case DataMode.DATABASE:
      updateGiftPS.run(
        gift.description,
        gift.location,
        gift.name,
        gift.occasionId,
        gift.personId,
        gift.price,
        gift.url,
        gift.id
      );
      break;
    case DataMode.LOCAL_STORAGE: {
      const giftMap = JSON.parse(localStorage.getItem('gifts'));
      giftMap[gift.id] = gift;
      localStorage.setItem('gifts', JSON.stringify(giftMap));
      break;
    }
    case DataMode.MEMORY:
      if (!giftMap[gift.id]) return false;
      giftMap[gift.id] = gift;
  }
  return true;
}

export function updateOccasion(occasion: Occasion): boolean {
  switch (mode) {
    case DataMode.DATABASE:
      updateOccasionPS.run(
        occasion.name,
        occasion.month,
        occasion.day,
        occasion.year,
        occasion.id
      );
      break;
    case DataMode.LOCAL_STORAGE: {
      const occasionMap = JSON.parse(localStorage.getItem('occasions'));
      occasionMap[occasion.id] = occasion;
      localStorage.setItem('occasions', JSON.stringify(occasionMap));
      break;
    }
    case DataMode.MEMORY:
      if (!occasionMap[occasion.id]) return false;
      occasionMap[occasion.id] = occasion;
  }
  return true;
}

export function updatePerson(person: Person): boolean {
  switch (mode) {
    case DataMode.DATABASE:
      updatePersonPS.run(
        person.name,
        person.month,
        person.day,
        person.year,
        person.id
      );
      break;
    case DataMode.LOCAL_STORAGE: {
      const personMap = JSON.parse(localStorage.getItem('people'));
      personMap[person.id] = person;
      localStorage.setItem('people', JSON.stringify(personMap));
      break;
    }
    case DataMode.MEMORY:
      if (!personMap[person.id]) return false;
      personMap[person.id] = person;
  }
  return true;
}

//TODO: Don't call this if you want to continue using previous data.
addData();
