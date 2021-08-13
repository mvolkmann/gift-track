import type {Request} from '@sveltejs/kit';
import type {Occasion, OccasionResponse} from '$lib/types';
import {deleteOccasion, getOccasion, updateOccasion} from '../data';

export async function del(request: Request): Promise<OccasionResponse> {
  const id = Number(request.params.occasionId);
  const success = deleteOccasion(id);
  return {status: success ? 200 : 404};
}

export async function get(request: Request): Promise<OccasionResponse> {
  const id = Number(request.params.occasionId);
  const occasion = getOccasion(id);
  return occasion ? {body: occasion} : {status: 404};
}

export async function put(request: Request): Promise<OccasionResponse> {
  const id = Number(request.params.occasionId);
  const occasion = (request.body as unknown) as Occasion;
  occasion.id = id;
  const success = updateOccasion(occasion);
  return {status: success ? 200 : 404};
}
