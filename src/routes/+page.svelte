<script lang="ts">
	import MultiplayerGame from '$lib/MultiplayerGame.svelte';
	import SingleplayerGame from '$lib/SingleplayerGame.svelte';
	import Button from '$lib/Button.svelte';

	let gameMode: undefined | string = undefined;
</script>

<div class="absolute left-10 top-10 z-10">
	<button on:click={(e) => location.reload()}>Home</button>
</div>

{#if gameMode === undefined}
	<div
		class="absolute z-0 top-0 left-0 w-full h-full p-32 flex flex-col items-center justify-center bg-black/30"
	>
		<div
			class="w-full max-w-[480px] h-full border-2 border-black bg-white rounded-2xl cursor-auto flex flex-col justify-center items-center p-2"
		>
			<div class="text-3xl mt-8 mx-8">
				<p class="text-pink-500">Hey there!</p>
				<p>Do you want to play with a single device or multiple devices?</p>
				<div class="flex flex-col w-full gap-4 my-12">
					<Button on:next={(e) => (gameMode = 'single')} buttonText={'Single'} />
					<Button on:next={(e) => (gameMode = 'multi')} buttonText={'Multiple'} />
				</div>
			</div>
		</div>
	</div>
{/if}
{#if gameMode === 'multi'}
	<MultiplayerGame />
{/if}
{#if gameMode === 'single'}
	<SingleplayerGame />
{/if}
