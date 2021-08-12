import type {Request} from '@sveltejs/kit';
import type {Occasion} from '$lib/types';
import {addOccasion, getOccasions} from '../data';

export async function get(): Promise<{body: Occasion[]}> {
  return {body: getOccasions()};
}

export async function post(request: Request): Promise<{body: Occasion}> {
  let occasion = (request.body as unknown) as Occasion;
  occasion = addOccasion(occasion);
  return {body: occasion};
}
