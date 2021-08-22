import type {Request, Response} from '@sveltejs/kit';
import type {Person} from '$lib/types';
import {addPerson, getAllPeople} from '../data';

export async function get(): Promise<{body: Person[]}> {
  return {body: getAllPeople()};
}

export async function post(request: Request): Promise<Response> {
  // If content-type is "application/json",
  // the body will be parsed to an object.
  let person = (request.body as unknown) as Person;
  person = addPerson(person);
  //@ts-ignore
  return {body: person};
}
