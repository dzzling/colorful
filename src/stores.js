import { writable } from 'svelte/store';

export const difficulty = writable(0);
export const screen = writable(-2);
export const colors = writable([]);
export const targetColorIndex = writable();
export const selectedColorIndex = writable();
export const userName = writable();
export const player = writable();
export const clue = writable('No clue yet');
export const gameMode = writable();