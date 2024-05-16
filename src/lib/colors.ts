import chroma from 'chroma-js';
import { getRandomFloat, getRandomInt } from './random.js';

/**
 * @param difficulty Should be a number between 1 and 100
 */
export function getRandomColors(difficulty: number) {
	const hslHueOffset = 115 - difficulty;

	const firstColorHsl = [
		getRandomInt(0, 360),
		getRandomFloat(0.5, 0.8),
		getRandomFloat(0.5, 0.7)
	];

	const baseColorsHsl = [
		firstColorHsl,
		[(firstColorHsl[0] + hslHueOffset) % 360, firstColorHsl[1], firstColorHsl[2]],
		[(firstColorHsl[0] - hslHueOffset) % 360, firstColorHsl[1], firstColorHsl[2]]
	];

	const colors = baseColorsHsl.map((hsl) => chroma.hsl(hsl[0], hsl[1], hsl[2]));

	return colors
		.flatMap((color) => [
			color,
			color.brighten(Math.min((140 - difficulty) / 80, 1.5)),
			color.darken(Math.min((140 - difficulty) / 80, 1.5))
		])
		.sort(() => Math.random() - 0.5)
		.slice(0, 9);
}
