// This defines server-side data storage and performs data validation.

import sqlite from 'better-sqlite3';
import type {RunResult, Statement} from 'better-sqlite3';

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

function addData() {
  databaseSetup();

  // Create some initial data.

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
}

export function addGift(gift: Gift): Gift {
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

  return gift;
}

export function addOccasion(occasion: Occasion): Occasion {
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

  return occasion;
}

export function addPerson(person: Person): Person {
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
    throw isDuplicate ? new Error('duplicate person name ' + person.name) : e;
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
  deleteGiftPS.run(id);

  //TODO: How can this return false if the id is not found?
  return true;
}

export function deleteOccasion(id: number): boolean {
  // This does a cascading delete, deleting all gifts for this occasion.
  deleteOccasionPS.run(id);

  //TODO: How can this return false if the id is not found?
  return true;
}

export function deletePerson(id: number): boolean {
  // This does a cascading delete, deleting all gifts for this person.
  deletePersonPS.run(id);

  //TODO: How can this return false if the id is not found?
  return true;
}

export function getAllGifts(): Gift[] {
  return (getAllGiftsPS.all() as unknown) as Gift[];
}

function getDuplicateMessage(gift: Gift) {
  const person = getPerson(gift.personId);
  const occasion = getOccasion(gift.occasionId);
  return `duplicate ${gift.name} ${occasion.name} gift for ${person.name}`;
}

export function getGifts(personId: number, occasionId: number): Gift[] {
  return (getGiftsPS.all(personId, occasionId) as unknown) as Gift[];
}

export function getAllOccasions(): Occasion[] {
  return (getAllOccasionsPS.all() as unknown) as Occasion[];
}

export function getAllPeople(): Person[] {
  return (getAllPeoplePS.all() as unknown) as Person[];
}

export function getGift(id: number): Gift {
  return (getGiftPS.get(id) as unknown) as Gift;
}

export function getOccasion(id: number): Occasion {
  return (getOccasionPS.get(id) as unknown) as Occasion;
}

export function getPerson(id: number): Person {
  return (getPersonPS.get(id) as unknown) as Person;
}

export function updateGift(gift: Gift): boolean {
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

  //TODO: How can this return false if the id is not found?
  return true;
}

export function updateOccasion(occasion: Occasion): boolean {
  updateOccasionPS.run(
    occasion.name,
    occasion.month,
    occasion.day,
    occasion.year,
    occasion.id
  );

  //TODO: How can this return false if the id is not found?
  return true;
}

export function updatePerson(person: Person): boolean {
  updatePersonPS.run(
    person.name,
    person.month,
    person.day,
    person.year,
    person.id
  );

  //TODO: How can this return false if the id is not found?
  return true;
}

//TODO: Don't call this if you want to continue using previous data.
addData();
