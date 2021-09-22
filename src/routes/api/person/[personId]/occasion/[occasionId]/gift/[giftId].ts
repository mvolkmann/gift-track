import type {Request} from '@sveltejs/kit';
import type {Gift, GiftResponse} from '$lib/types';
import {deleteGift, getGift, updateGift} from '$routes/api/data';

export async function del(request: Request): Promise<GiftResponse> {
  const id = Number(request.params.giftId);
  const success = deleteGift(id);
  return {status: success ? 200 : 404};
}

export async function get(request: Request): Promise<GiftResponse> {
  const id = Number(request.params.giftId);
  const gift = getGift(id);
  return gift ? {body: gift} : {status: 404};
}

export async function put(request: Request): Promise<GiftResponse> {
  const id = Number(request.params.giftId);
  const gift = (request.body as unknown) as Gift;
  gift.id = id;
  const success = updateGift(gift);
  return {status: success ? 200 : 404};
}
