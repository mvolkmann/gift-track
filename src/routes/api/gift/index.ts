import type {Request} from '@sveltejs/kit';
import type {Gift} from '$lib/types';
import {addGift, getAllGifts} from '../data';

export async function get(): Promise<{body: Gift[]}> {
  return {body: getAllGifts()};
}

export async function post(request: Request): Promise<{body: Gift}> {
  // If content-type is "application/json",
  // the body will be parsed to an object.
  let gift = (request.body as unknown) as Gift;
  gift = addGift(gift);
  return {body: gift};
}
