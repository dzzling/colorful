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
		clue,
		gameMode
	} from '../stores';

	let subscribedDifficulty: number;
	let subscribedScreen: number;
	let subscribedColors: Array<Color>;
	let subscribedTargetColorIndex: number | undefined;
	let subscribedSelectedColorIndex: number | undefined;
	let subscribedUserName: string | undefined;
	let subscribedPlayer: string | undefined;
	let subscribedClue: string;
	let subscribedGameMode: string;

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
	gameMode.subscribe((value) => {
		subscribedGameMode = value;
	});

	type Events = {
		start: undefined;
		difficultyChange: number;
		selectColor: number;
		sendClue: { newClue: string };
		getTargetScreen: undefined;
		confirmColor: undefined;
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

	function handleTargetScreen() {
		dispatch('getTargetScreen');
	}

	function sendClue() {
		dispatch('sendClue', { newClue });
	}

	function confirmColor() {
		dispatch('confirmColor');
	}
	function resetGame() {
		newClue = '';
		dispatch('resetGame');
	}

	function getTurn() {
		if (subscribedGameMode === 'single') {
			return 1;
		}
		if (
			(subscribedPlayer === subscribedUserName && subscribedScreen === 3) ||
			(subscribedPlayer != subscribedUserName &&
				(subscribedScreen === 1 || subscribedScreen === 2)) ||
			[-2, -1, 0, 4].includes(subscribedScreen)
		) {
			return 1;
		}
		return 0;
	}

	function getTileVariantForColorIndex(colorIndex: number) {
		if (
			subscribedScreen === 2 &&
			subscribedTargetColorIndex === colorIndex &&
			(subscribedGameMode === 'single' || subscribedPlayer != subscribedUserName)
		) {
			return 'TARGET';
		} else if (
			subscribedScreen === 3 &&
			subscribedSelectedColorIndex === colorIndex &&
			(subscribedGameMode === 'single' || subscribedPlayer == subscribedUserName)
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
		class="absolute top-0 left-0 w-full h-full p-6 sm:p-32 flex items-center justify-center bg-black/30"
	>
		<Modal on:buttonClick={handleStartGame} modalButtonText={"Let's go"} />
	</div>
{/if}

<div class="w-full h-full flex flex-col items-center p-6 sm:pb-12 bg-black/30">
	<div
		class="w-full flex-1 sm:max-w-[640px] flex flex-col items-center justify-evenly bg-white rounded-2xl border-2 border-black"
	>
		<h1 class="text-center text-3xl font-bold w-full pt-4">Colorfül</h1>
		<div class="flex">
			{#if getTurn() === 1}
				<p>Your turn</p>
			{:else}
				<p>Not your turn</p>
			{/if}
		</div>
		<div class="h-56 w-56 sm:h-96 sm:w-96 grid grid-rows-3 grid-cols-3 gap-2 sm:gap-4">
			{#each subscribedColors as color, index}
				<Tile
					Color={color}
					on:select={() => handleSelectColor(index)}
					variant={getTileVariantForColorIndex(index)}
				/>
			{/each}
		</div>
		<div class="w-full h-24 sm:h-32 flex flex-col justify-center items-center">
			{#if subscribedScreen === 1 && (subscribedGameMode === 'single' || subscribedPlayer != subscribedUserName)}
				<Button
					size={'big'}
					on:buttonClick={handleTargetScreen}
					buttonText={'Show me the target'}
				/>
			{:else if (subscribedGameMode != 'single' && (subscribedScreen === 1 || subscribedScreen === 2) && subscribedUserName === subscribedPlayer) || (subscribedScreen === 3 && subscribedUserName != subscribedPlayer)}
				<p class="text-lg">Wait</p>
			{:else if subscribedScreen === 2 && (subscribedGameMode === 'single' || subscribedPlayer != subscribedUserName)}
				<input
					class="w-56 sm:w-96 h-16 my-4 px-2 py-1 outline outline-0"
					type="text"
					id="clue"
					placeholder="Enter clue"
					bind:value={newClue}
				/>
				<Button size={'big'} on:buttonClick={sendClue} buttonText={'Send clue'} />
			{:else if subscribedScreen === 3 && subscribedSelectedColorIndex === undefined && (subscribedGameMode === 'single' || subscribedPlayer == subscribedUserName)}
				<p>Clue: {subscribedClue}</p>
				<p class="text-lg mt-4">Please select a color</p>
			{:else if subscribedScreen === 3 && subscribedSelectedColorIndex != undefined && (subscribedGameMode === 'single' || subscribedPlayer == subscribedUserName)}
				<Button size={'big'} on:buttonClick={confirmColor} buttonText={'Log color in'} />
			{:else if subscribedScreen === 4}
				{#if subscribedTargetColorIndex === subscribedSelectedColorIndex}
					<Button size={'big'} on:buttonClick={resetGame} buttonText={'Correct. Another round!'} />
				{:else}
					<Button
						size={'big'}
						on:buttonClick={resetGame}
						buttonText={'Close enough. Another round!'}
					/>
				{/if}
			{/if}
		</div>
		<div class="sm:h-16 h-12 w-full">
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
