import {deletePerson, getPerson, updatePerson} from './data';

export async function del(request) {
  const success = deletePerson(request.params.id);
  return {status: success ? 200 : 404};
}

export async function get(request) {
  const person = getPerson(request.params.id);
  return {body: person};
}

export async function put(request) {
  const {id} = request.params;
  // content-type is 'text/plain', should be 'application/json'!
  const person = JSON.parse(request.body); // Why necessary?
  person.id = id;
  const success = updatePerson(person);
  return {status: success ? 200 : 404};
}
