<script lang="ts">
	import { getRandomColors } from '$lib/colors';
	import { getRandomInt } from '$lib/random';
	import clsx from 'clsx';
	import type { ChangeEventHandler } from 'svelte/elements';
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';
	import Tile from '$lib/Tile.svelte';
	import Difficulty from '$lib/Difficulty.svelte';

	let difficulty = 0;
	let screen = 0;
	let colors = getRandomColors(1);
	let targetColorIndex = getRandomInt(0, colors.length - 1);
	let selectedColorIndex: undefined | number = undefined;
	let buttonContent = "Let's go";

	function reset(newDifficulty: number = difficulty) {
		screen = 1;
		difficulty = newDifficulty;
		colors = getRandomColors(difficulty);
		targetColorIndex = getRandomInt(0, colors.length - 1);
		selectedColorIndex = undefined;
		buttonContent = 'Show me the target';
	}

	function handleNextScreenButtonClick() {
		if (screen === 0) {
			screen = 1;
			buttonContent = 'Show me the target';
		} else if (screen === 1) {
			screen = 2;
			buttonContent = 'Got it';
		} else if (screen === 2) {
			screen = 3;
		} else if (screen === 3) {
			screen = 4;
			if (targetColorIndex === selectedColorIndex) {
				buttonContent = 'Correct. Another round!';
			} else {
				buttonContent = 'Close enough. Another round!';
			}
		} else if (screen === 4) {
			reset();
		}
	}

	function selectColor(index: number) {
		selectedColorIndex = index;
	}

	function getTileVariantForColorIndex(colorIndex: number) {
		if (screen === 2 && targetColorIndex === colorIndex) {
			return 'TARGET';
		} else if (screen === 3 && selectedColorIndex === colorIndex) {
			return 'SELECTED';
		} else if (
			screen === 4 &&
			targetColorIndex === selectedColorIndex &&
			targetColorIndex === colorIndex
		) {
			return 'WON';
		} else if (
			screen === 4 &&
			selectedColorIndex !== targetColorIndex &&
			selectedColorIndex === colorIndex
		) {
			return 'LOST_INCORRECT';
		} else if (
			screen === 4 &&
			selectedColorIndex !== targetColorIndex &&
			targetColorIndex === colorIndex
		) {
			return 'LOST_CORRECT';
		}
	}
</script>

{#if screen === 0}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<Modal on:next={handleNextScreenButtonClick} modalButtonText={buttonContent} />
	</div>
{/if}
<div class="w-full min-h-screen flex flex-col items-center px-8 bg-black/10">
	<div
		class="w-full flex-1 max-w-[640px] flex flex-col items-center justify-evenly bg-white rounded-2xl my-10 border-2 border-black"
	>
		<div class="w-full h-full flex flex-col justify-center items-center">
			<h1 class="text-center text-3xl font-bold w-full">Colorfül</h1>
		</div>
		<div class="h-96 w-96 grid grid-rows-3 grid-cols-3 gap-4">
			{#each colors as color, index}
				<Tile
					tileColor={color}
					on:select={() => selectColor(index)}
					variant={getTileVariantForColorIndex(index)}
				/>
			{/each}
		</div>
		<div class="w-full h-32 flex flex-col justify-center items-center">
			{#if screen !== 3}
				<Button on:next={handleNextScreenButtonClick} buttonText={buttonContent} />
			{:else if screen === 3 && selectedColorIndex !== undefined}
				<Button on:next={handleNextScreenButtonClick} buttonText={'Log in'} />
			{:else if screen === 3 && selectedColorIndex === undefined}
				<p class="text-lg">Please select a color</p>
			{/if}
		</div>
		<div class="h-16 w-full">
			{#if screen === 1}
				<Difficulty
					difficultyIndex={difficulty}
					on:resetAll={(e) => reset(parseInt(e.currentTarget.value))}
				/>
			{/if}
		</div>
	</div>
</div>
