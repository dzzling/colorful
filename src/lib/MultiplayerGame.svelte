<script lang="ts">
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Waitingroom from '$lib/Waitingroom.svelte';
	import Reception from '$lib/Reception.svelte';
	import Game from './Game.svelte';
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
	let subscribedSelectedColorIndex: undefined | number;

	let roomName: undefined | string = undefined;
	let users: Array<string>;
	let playerIndex = 0;
	gameMode.update((n) => 'multiple');

	difficulty.subscribe((value) => {
		subscribedDifficulty = value;
	});
	screen.subscribe((value) => {
		subscribedScreen = value;
	});
	selectedColorIndex.subscribe((value) => {
		subscribedSelectedColorIndex = value;
	});

	// Connect to the server
	const socket = io('http://localhost:3000');

	socket.on('connect_error', (err) => {
		alert('Oops. Something went wrong');
	});

	// Join Room
	function askJoinRoom(submittedRoom: string) {
		socket.emit('join room', submittedRoom);
	}
	socket.on('join room', (room) => {
		roomName = room;
		if (users === undefined || users.length === 1) {
			alert('Oops! You have joined an empty room.');
		} else {
			alert(`You have succesfully joined ${roomName}`);
		}
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
		socket.emit('initialize', roomName);
	}

	// Listen for the initialization from the server
	socket.on('initialize', (data) => {
		console.log('got init package');
		let received_data = JSON.parse(data);
		targetColorIndex.update((n) => received_data[0]);
		colors.update((n) => received_data[1]);
		difficulty.update((n) => received_data[2]);
		player.update((n) => users[playerIndex]);
		handleNextScreenButtonClick();
	});

	// Update username property on assignment
	socket.on('username', (username) => {
		userName.update((n) => username);
	});

	// Initiate change to next screen
	function screenClick() {
		handleNextScreenButtonClick();
		socket.emit('next screen', roomName);
	}
	socket.on('next screen', () => {
		handleNextScreenButtonClick();
	});

	// Emit the selected color to server
	function confirmColor() {
		handleNextScreenButtonClick();
		socket.emit('confirm color', [subscribedSelectedColorIndex, roomName]);
	}
	socket.on('confirm color', (selectColor) => {
		selectedColorIndex.update((n) => selectColor);
		handleNextScreenButtonClick();
	});

	// Reset game after last screen or difficulty change
	function resetGame(newDifficulty: number = subscribedDifficulty, type: string = 'newround') {
		socket.emit('resetGame', [newDifficulty, roomName, type]);
	}

	socket.on('reset game', (resetPackage) => {
		console.log('Reset');
		let receivedData = JSON.parse(resetPackage);
		targetColorIndex.update((n) => receivedData[0]);
		colors.update((n) => receivedData[1]);
		difficulty.update((n) => receivedData[2]);
		screen.update((n) => 1);
		clue.update((n) => 'No clue yet');
		selectedColorIndex.update((n) => undefined);
		if (receivedData[3] === 'newround') {
			playerIndex += 1;
			player.update((n) => users[playerIndex % users.length]);
		}
	});

	// Send or receive a clue for target color
	function sendClue(newClue: string) {
		socket.emit('send clue', newClue);
	}

	socket.on('receive clue', (newClue) => {
		clue.update((n) => newClue);
		handleNextScreenButtonClick();
	});

	// Cleanup on component unmount
	onMount(() => {
		return () => {
			userName.update((n) => undefined);
			socket.disconnect();
		};
	});

	function handleNextScreenButtonClick() {
		if (subscribedScreen === 4) {
			resetGame();
		} else {
			screen.update((n) => n + 1);
		}
		console.log(screen);
	}

	function selectColor(index: number) {
		selectedColorIndex.update((n) => index);
	}
</script>

{#if subscribedScreen === -2}
	<div
		class="absolute top-0 left-0 w-full h-full p-6 sm:p-32 flex flex-col items-center justify-center bg-black/30 z-0"
	>
		<Reception on:join={(event) => askJoinRoom(event.detail.roomName)} on:create={createRoom} />
	</div>
{/if}
{#if subscribedScreen === -1}
	<div
		class="absolute top-0 left-0 w-full h-full p-6 sm:p-32 flex items-center justify-center bg-black/30 z-0"
	>
		<Waitingroom on:buttonClick={screenClick} roomUsers={users} room={roomName} />
	</div>
{/if}
{#if subscribedScreen >= 0}
	<Game
		on:start={startGame}
		on:difficultyChange={(e) => resetGame(e.detail, 'changedifficulty')}
		on:selectColor={(e) => selectColor(e.detail)}
		on:screenClick={screenClick}
		on:sendClue={(e) => sendClue(e.detail.newClue)}
		on:confirmColor={confirmColor}
		on:resetGame={(e) => resetGame()}
	/>
{/if}
