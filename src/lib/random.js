export function getRandomInt(min, max) {
	const minCeil = Math.ceil(min);
	const maxFloor = Math.floor(max);
	return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}
