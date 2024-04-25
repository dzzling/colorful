<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';
	import Tile from '$lib/Tile.svelte';
	import DifficultySlider from '$lib/DifficultySlider.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Color } from 'chroma-js';
	import {
		difficulty,
		screen,
		colors,
		targetColorIndex,
		selectedColorIndex,
		userName,
		player,
		clue
	} from './../stores.js';

	let subscribedDifficulty: number;
	let subscribedScreen: number;
	let subscribedColors: Array<Color>;
	let subscribedTargetColorIndex: number | undefined;
	let subscribedSelectedColorIndex: number | undefined;
	let subscribedUserName: string | undefined;
	let subscribedPlayer: string | undefined;
	let subscribedClue: string;

	difficulty.subscribe((value) => {
		subscribedDifficulty = value;
	});
	screen.subscribe((value) => {
		subscribedScreen = value;
	});
	colors.subscribe((value) => {
		subscribedColors = value;
	});
	targetColorIndex.subscribe((value) => {
		subscribedTargetColorIndex = value;
	});
	selectedColorIndex.subscribe((value) => {
		subscribedSelectedColorIndex = value;
	});
	userName.subscribe((value) => {
		subscribedUserName = value;
	});
	player.subscribe((value) => {
		subscribedPlayer = value;
	});
	clue.subscribe((value) => {
		subscribedClue = value;
	});

	type Events = {
		start: undefined;
		difficultyChange: number;
		selectColor: number;
		sendClue: { newClue: string };
		screenClick: undefined;
		logColor: undefined;
		resetGame: undefined;
	};

	let newClue = '';

	const dispatch = createEventDispatcher<Events>();

	function handleStartGame() {
		dispatch('start');
	}

	function handleDifficultyChange(value: number) {
		dispatch('difficultyChange', value);
	}

	function handleSelectColor(index: number) {
		dispatch('selectColor', index);
	}

	function handleScreenClick() {
		dispatch('screenClick');
	}

	function sendClue() {
		dispatch('sendClue', { newClue });
	}

	function logColor() {
		dispatch('logColor');
	}
	function resetGame() {
		dispatch('resetGame');
	}

	function getTurn() {
		if (
			(subscribedPlayer === subscribedUserName && subscribedScreen === 3) ||
			(subscribedPlayer != subscribedUserName &&
				(subscribedScreen === 1 || subscribedScreen === 2)) ||
			[-2, -1, 0, 4].includes(subscribedScreen)
		) {
			return 1;
		} else {
			return 0;
		}
	}

	function getTileVariantForColorIndex(colorIndex: number) {
		if (
			subscribedScreen === 2 &&
			subscribedTargetColorIndex === colorIndex &&
			subscribedPlayer != subscribedUserName
		) {
			return 'TARGET';
		} else if (
			subscribedScreen === 3 &&
			subscribedSelectedColorIndex === colorIndex &&
			subscribedPlayer == subscribedUserName
		) {
			return 'SELECTED';
		} else if (
			subscribedScreen === 4 &&
			subscribedTargetColorIndex === subscribedSelectedColorIndex &&
			subscribedTargetColorIndex === colorIndex
		) {
			return 'WON';
		} else if (
			subscribedScreen === 4 &&
			subscribedSelectedColorIndex !== subscribedTargetColorIndex &&
			subscribedSelectedColorIndex === colorIndex
		) {
			return 'LOST_INCORRECT';
		} else if (
			subscribedScreen === 4 &&
			subscribedSelectedColorIndex !== subscribedTargetColorIndex &&
			subscribedTargetColorIndex === colorIndex
		) {
			return 'LOST_CORRECT';
		}
	}
</script>

{#if subscribedScreen === 0}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<Modal on:next={handleStartGame} modalButtonText={"Let's go"} />
	</div>
{/if}

<div class="w-full min-h-screen flex flex-col items-center px-8 bg-black/10">
	<div
		class="w-full flex-1 max-w-[640px] flex flex-col items-center justify-evenly bg-white rounded-2xl my-10 border-2 border-black"
	>
		<div class="w-full h-full flex flex-col justify-center items-center">
			<h1 class="text-center text-3xl font-bold w-full">Colorfül</h1>
		</div>
		<div class="flex">
			{#if getTurn() === 1}
				<p>Your turn</p>
			{:else}
				<p>Not your turn</p>
			{/if}
		</div>
		<div class="h-96 w-96 grid grid-rows-3 grid-cols-3 gap-4">
			{#each subscribedColors as color, index}
				<Tile
					tileColor={color}
					on:select={() => handleSelectColor(index)}
					variant={getTileVariantForColorIndex(index)}
				/>
			{/each}
		</div>
		<div class="w-full h-32 flex flex-col justify-center items-center">
			{#if subscribedScreen === 1 && subscribedUserName != subscribedPlayer}
				<Button on:next={handleScreenClick} buttonText={'Show me the target'} />
			{:else if ((subscribedScreen === 1 || subscribedScreen === 2) && subscribedUserName === subscribedPlayer) || (subscribedScreen === 3 && subscribedUserName != subscribedPlayer)}
				<p class="text-lg">Wait</p>
			{:else if subscribedScreen === 2 && subscribedUserName != subscribedPlayer}
				<input
					class="w-96 h-24"
					type="text"
					id="clue"
					placeholder="Enter clue"
					bind:value={newClue}
				/>
				<Button on:next={sendClue} buttonText={'Send clue'} />
			{:else if subscribedScreen === 3 && subscribedSelectedColorIndex === undefined && subscribedUserName === subscribedPlayer}
				<p>{subscribedClue}</p>
				<p class="text-lg mt-4">Please select a color</p>
			{:else if subscribedScreen === 3 && subscribedSelectedColorIndex != undefined && subscribedUserName === subscribedPlayer}
				<Button on:next={logColor} buttonText={'Log color in'} />
			{:else if subscribedScreen === 4}
				{#if subscribedTargetColorIndex === subscribedSelectedColorIndex}
					<Button on:next={resetGame} buttonText={'Correct. Another round!'} />
				{:else}
					<Button on:next={resetGame} buttonText={'Close enough. Another round!'} />
				{/if}
			{/if}
		</div>
		<div class="h-16 w-full">
			{#if subscribedScreen === 1}
				<DifficultySlider
					value={subscribedDifficulty}
					on:change={(e) => handleDifficultyChange(e.detail)}
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	::placeholder {
		text-align: center;
	}
</style>
