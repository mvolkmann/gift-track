import type {Request} from '@sveltejs/kit';
import type {Gift} from '$lib/types';
import {addGift, getGifts} from '$lib/../routes/api/data';

export async function get(request: Request): Promise<{body: Gift[]}> {
  const personId = Number(request.params.personId);
  const occasionId = Number(request.params.occasionId);
  return {body: getGifts(personId, occasionId)};
}

export async function post(request: Request): Promise<{body: Gift}> {
  // If content-type is "application/json",
  // the body will be parsed to an object.
  let gift = (request.body as unknown) as Gift;
  gift = addGift(gift);
  return {body: gift};
}
