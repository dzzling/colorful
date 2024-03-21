<script lang="ts">
	import { getRandomInt } from '$lib/random';
	import chroma, { type Color } from 'chroma-js';
	import clsx from 'clsx';
	import type { ChangeEventHandler } from 'svelte/elements';
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';
	import Tile from '$lib/Tile.svelte';
	import Difficulty from '$lib/Difficulty.svelte';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	let difficulty = 0;
	let screen: undefined | number = undefined;
	let colors: undefined | number = undefined;
	let targetColorIndex: undefined | number = undefined;
	let selectedColorIndex: undefined | number = undefined;
	let roomName: undefined | string = undefined;

	// Connect to the server
	const socket = io('http://localhost:3000');

	socket.on('connect_error', (err) => {
		console.log(err);
	});

	// Listen for player movement from the server
	socket.on('initialize', (data) => {
		let received_data = JSON.parse(data);
		targetColorIndex = received_data[0];
		colors = received_data[1];
		screen = received_data[2];
	});

	// Function to handle player movement
	function screenClick() {
		handleNextScreenButtonClick();
		socket.emit('next screen', screen);
	}
	// Listen for player movement from the server
	socket.on('next screen', (proposed_screen) => {
		handleNextScreenButtonClick();
	});

	// Function to handle player movement
	function logColor() {
		handleNextScreenButtonClick();
		socket.emit('log color', selectedColorIndex);
	}
	// Listen for player movement from the server
	socket.on('log color', (selectColor) => {
		selectedColorIndex = selectColor;
		handleNextScreenButtonClick();
	});

	function askJoinRoom(submittedRoom){
		socket.emit('check room', submittedRoom);
	}

	// Cleanup on component unmount
	onMount(() => {
		return () => {
			socket.disconnect();
		};
	});

	function reset(newDifficulty: number = difficulty) {
		screen = 1;
		difficulty = newDifficulty;
		colors = getRandomColors(difficulty);
		targetColorIndex = getRandomInt(0, colors.length - 1);
		selectedColorIndex = undefined;
	}

	function handleNextScreenButtonClick() {
		if (screen === 0) {
			screen = 1;
		} else if (screen === 1) {
			screen = 2;
		} else if (screen === 2) {
			screen = 3;
		} else if (screen === 3) {
			screen = 4;
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
	// selectColor -> getTileVariant
	// reset
</script>
{#if screen === -1}
	<div class="absolute top-0 left-0 w-full h-full p-32 flex flex-col items-center justify-center bg-black/30"> 
		<p>Do you want to create or join a room?</p>
		<div class="w-full h-full flex justify-evenly">
			<Button buttonText={'CREATE'} on:click={createRoom}/>
			<Form onSubmit={(data) => joinRoom(data)} placeholder="Room name"/>
		</div>
	</div>

{#if screen === 0}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<Modal on:next={screenClick} modalButtonText={"Let's go"} />
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
			{#if screen === 1}
				<Button on:next={screenClick} buttonText={'Show me the target'} />
			{:else if screen === 2}
				<Button on:next={screenClick} buttonText={'Got it'} />
			{:else if screen === 3 && selectedColorIndex === undefined}
				<p class="text-lg">Please select a color</p>
			{:else if screen === 3 && selectedColorIndex != undefined}
				<Button on:next={logColor} buttonText={'Log color in'} />
			{:else if screen === 4}
				{#if targetColorIndex === selectedColorIndex}
					<Button on:next={screenClick} buttonText={'Correct. Another round!'} />
				{:else}
					<Button on:next={screenClick} buttonText={'Close enough. Another round!'} />
				{/if}
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
