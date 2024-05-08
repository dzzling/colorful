import type { Color } from 'chroma-js';
import { writable } from 'svelte/store';

export const difficulty = writable<number>(0);
export const screen = writable<number>(-2);
export const colors = writable<Color[]>([]);
export const targetColorIndex = writable<number>();
export const selectedColorIndex = writable<number | undefined>();
export const userName = writable<string | undefined>();
export const player = writable<string>();
export const clue = writable<string>('No clue yet');
export const gameMode = writable<string>();