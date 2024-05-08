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
	} from './../stores';

	// Define store relevant variables
	let firstColors: any = getRandomColors(1);
	let subscribedDifficulty: number;
	let subscribedScreen: number;
	let subscribedColors: Array<Color>;

	// Initialize variables
	let buttonContent = "Let's go";
	let newClue: string = '';
	gameMode.update((n) => 'single');
	difficulty.update((n) => 0);
	screen.update((n) => 0);
	colors.update((n) => firstColors);

	// Subscribe to the store to get real time values
	difficulty.subscribe((value) => {
		subscribedDifficulty = value;
	});
	screen.subscribe((value) => {
		subscribedScreen = value;
	});
	colors.subscribe((value) => {
		subscribedColors = value;
	});

	// Update target color index
	targetColorIndex.update((n) => getRandomInt(0, subscribedColors.length - 1));

	// Reset after last screen or after difficulty change
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

	// Move to next screen an update variables accordingly if needed
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

	// Update clue to be shown on next screen
	function sendClue(sentClue: string) {
		clue.update((n) => sentClue);
		handleNextScreenButtonClick();
	}

	// Confirm the selected color
	function selectColor(index: number) {
		selectedColorIndex.update((n) => index);
	}
</script>

<div
	class="fixed flex portrait:hidden lg:hidden h-full w-full bg-white justify-center items-center text-2xl z-30"
>
	<p>Please turn your screen</p>
</div>
<Game
	on:start={handleNextScreenButtonClick}
	on:difficultyChange={(e) => reset(e.detail)}
	on:selectColor={(e) => selectColor(e.detail)}
	on:screenClick={handleNextScreenButtonClick}
	on:sendClue={(e) => sendClue(e.detail.newClue)}
	on:confirmColor={handleNextScreenButtonClick}
	on:resetGame={(n) => reset()}
/>
