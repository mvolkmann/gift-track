import type {Request} from '@sveltejs/kit';
import type {Person, PersonResponse} from '$lib/types';
import {deletePerson, getPerson, updatePerson} from '../../data';

export async function del(request: Request): Promise<PersonResponse> {
  const id = Number(request.params.id);
  const success = deletePerson(id);
  return {status: success ? 200 : 404};
}

export async function get(request: Request): Promise<PersonResponse> {
  const id = Number(request.params.id);
  const person = getPerson(id);
  return person ? {body: person} : {status: 404};
}

export async function put(request: Request): Promise<PersonResponse> {
  const id = Number(request.params.id);
  const person = (request.body as unknown) as Person;
  person.id = id;
  const success = updatePerson(person);
  return {status: success ? 200 : 404};
}
