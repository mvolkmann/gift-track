import {deletePerson, getPerson, updatePerson} from './data';

export async function del(request) {
  const success = deletePerson(request.params.id);
  return {status: success ? 200 : 404};
}

export async function get(request) {
  const person = getPerson(request.params.id);
  return person ? {body: person} : {status: 404};
}

export async function put(request) {
  const {id} = request.params;
  // If content-type is "application/json",
  // the body will be parsed to an object.
  const person = request.body;
  person.id = id;
  const success = updatePerson(person);
  return {status: success ? 200 : 404};
}
