import {writable} from 'svelte/store';

export const errorStore = writable<string>('');
export const toastStore = writable<string>('');
