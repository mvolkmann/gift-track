import type {Request} from '@sveltejs/kit';
import type {Person} from '$lib/types';
import {addPerson, getPeople} from '../data';

export async function get(): Promise<{body: Person[]}> {
  return {body: getPeople()};
}

export async function post(request: Request): Promise<{body: Person}> {
  // If content-type is "application/json",
  // the body will be parsed to an object.
  let person = (request.body as unknown) as Person;
  person = addPerson(person);
  return {body: person};
}
