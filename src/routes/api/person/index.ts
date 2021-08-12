//import type {RequestHandler} from '@sveltejs/kit';
import {addPerson, getPeople} from './data';

export async function get(request) {
  return {body: getPeople()};
}

export async function post(request) {
  const person = addPerson(request.body);
  return {body: person};
}
