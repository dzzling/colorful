<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/Button.svelte';

	let roomName = '';

	type Events = {
		create: undefined;
		join: { roomName: string };
	};

	const dispatch = createEventDispatcher<Events>();

	function joinRoom() {
		dispatch('join', { roomName });
	}
	function createRoom() {
		dispatch('create');
	}
</script>

<div
	class="w-full max-w-[480px] h-full border-2 border-black bg-white rounded-2xl cursor-auto flex flex-col justify-center items-center p-2"
>
	<div class="text-3xl mt-8 mx-8">
		<p class="text-pink-500">Hi!</p>
		<p>Do you want to create or join a room?</p>
	</div>
	<div class="w-full h-full flex flex-col items-center">
		<br />
		<Button on:next={createRoom} buttonText={'Create'} />
		<p class="mb-1 mt-4">OR</p>
		<form class="w-full flex flex-col items-center">
			<input
				class="flex my-3 px-6 flex-col justify-center items-center border-2 rounded-2xl border-pink-500 w-96 h-24"
				type="text"
				placeholder="Enter Room Name"
				id="joinRoom"
				bind:value={roomName}
			/>
			<Button on:next={joinRoom} buttonText={'Join'} />
		</form>
	</div>
</div>
