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
	import Waitingroom from '$lib/Waitingroom.svelte';

	let difficulty = 0;
	let screen = -2;
	let colors: undefined | number = undefined;
	let targetColorIndex: undefined | number = undefined;
	let selectedColorIndex: undefined | number = undefined;
	let roomName: undefined | string = undefined;
	let users: undefined | Array<string> = undefined;

	// Connect to the server
	const socket = io('http://localhost:3000');

	socket.on('connect_error', (err) => {
		console.log(err);
	});

	// Join Room
	function askJoinRoom(submittedRoom: string) {
		socket.emit('join room', submittedRoom);
	}
	socket.on('join room', (room) => {
		roomName = room;
		alert(`You have succesfully joined ${roomName}`);
		handleNextScreenButtonClick();
	});

	function createRoom() {
		console.log('Asking to create room');
		socket.emit('create room');
	}
	socket.on('create room', (room) => {
		roomName = room;
		alert(`You have succesfully created ${roomName}`);
		handleNextScreenButtonClick();
	});

	socket.on('new user', (currentUsers) => {
		users = currentUsers;
	});

	function startGame() {
		console.log('Initialize and starting game');
		socket.emit('initialize', roomName);
	}

	// Listen for player movement from the server
	socket.on('initialize', (data) => {
		let received_data = JSON.parse(data);
		targetColorIndex = received_data[0];
		colors = received_data[1];
		difficulty = received_data[2];
		handleNextScreenButtonClick();
	});

	// Screen click
	function screenClick() {
		handleNextScreenButtonClick();
		socket.emit('next screen', screen);
	}
	socket.on('next screen', (proposed_screen) => {
		handleNextScreenButtonClick();
	});

	// Log in color
	function logColor() {
		handleNextScreenButtonClick();
		socket.emit('log color', selectedColorIndex);
	}
	socket.on('log color', (selectColor) => {
		selectedColorIndex = selectColor;
		handleNextScreenButtonClick();
	});

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
		if (screen === 4) {
			reset();
		} else {
			screen += 1;
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

{#if screen === -2}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex flex-col items-center justify-center bg-black/30"
	>
		<div class="w-1/3 bg-white rounded-md border">
			<p>Do you want to create or join a room?</p>
			<div class="w-full h-full flex justify-evenly">
				<Button on:next={createRoom} buttonText={'Create'} />
				<form class="w-full">
					<input type="text" placeholder="Room Name" id="joinRoom" />
					<button
						class="border"
						on:click={(event) => askJoinRoom(document.getElementById('joinRoom').value)}
						>Join</button
					>
				</form>
			</div>
		</div>
	</div>
{/if}
{#if screen === -1}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<Waitingroom roomUsers={users} room={roomName} />
	</div>
{/if}
{#if screen === 0}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<Modal on:next={startGame} modalButtonText={"Let's go"} />
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
