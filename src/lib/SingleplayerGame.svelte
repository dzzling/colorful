<script lang="ts">
	import { getRandomColors } from '$lib/colors';
	import { getRandomInt } from '$lib/random';
	import Game from './Game.svelte';
	import type { Color } from 'chroma-js';
	import {
		difficulty,
		screen,
		colors,
		targetColorIndex,
		selectedColorIndex,
		clue,
		gameMode
	} from './../stores.js';

	let firstColors: any = getRandomColors(1);
	let subscribedDifficulty: number;
	let subscribedScreen: number;
	let subscribedColors: Array<Color>;

	// Initialize
	let buttonContent = "Let's go";
	let newClue: string = '';
	gameMode.update((n) => 'single');
	difficulty.update((n) => 0);
	screen.update((n) => 0);
	colors.update((n) => firstColors);
	difficulty.subscribe((value) => {
		subscribedDifficulty = value;
	});
	screen.subscribe((value) => {
		subscribedScreen = value;
	});
	colors.subscribe((value) => {
		subscribedColors = value;
	});
	targetColorIndex.update((n) => getRandomInt(0, subscribedColors.length - 1));

	function reset(newDifficulty: number = subscribedDifficulty) {
		screen.update((n) => 1);
		difficulty.update((n) => newDifficulty);
		let newColors: any = getRandomColors(subscribedDifficulty);
		colors.update((n) => newColors);
		targetColorIndex.update((n) => getRandomInt(0, subscribedColors.length - 1));
		selectedColorIndex.update((n) => undefined);
		buttonContent = 'Show me the target';
		newClue = '';
	}

	function handleNextScreenButtonClick() {
		if (subscribedScreen === 0) {
			screen.update((n) => 1);
			buttonContent = 'Show me the target';
		} else if (subscribedScreen === 1) {
			screen.update((n) => 2);
			buttonContent = 'Log clue';
		} else if (subscribedScreen === 2) {
			screen.update((n) => 3);
		} else if (subscribedScreen === 3) {
			screen.update((n) => 4);
			if (targetColorIndex === selectedColorIndex) {
				buttonContent = 'Correct. Another round!';
			} else {
				buttonContent = 'Close enough. Another round!';
			}
		} else if (subscribedScreen === 4) {
			reset();
		}
	}

	function sendClue(sentClue: string) {
		clue.update((n) => sentClue);
		handleNextScreenButtonClick();
	}

	function selectColor(index: number) {
		selectedColorIndex.update((n) => index);
	}
</script>

<Game
	on:start={handleNextScreenButtonClick}
	on:difficultyChange={(e) => reset(e.detail)}
	on:selectColor={(e) => selectColor(e.detail)}
	on:screenClick={handleNextScreenButtonClick}
	on:sendClue={(e) => sendClue(e.detail.newClue)}
	on:logColor={handleNextScreenButtonClick}
	on:resetGame={(n) => reset()}
/>
