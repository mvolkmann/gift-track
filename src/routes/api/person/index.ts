//import type {RequestHandler} from '@sveltejs/kit';
import {addPerson, getPeople} from './data';

export async function get(request) {
  return {body: getPeople()};
}

export async function post(request) {
  // If content-type is "application/json",
  // the body will be parsed to an object.
  const person = addPerson(request.body);
  return {body: person};
}
