<script lang="ts">
	import MultiplayerGame from '$lib/MultiplayerGame.svelte';
	import SingleplayerGame from '$lib/SingleplayerGame.svelte';
	import Button from '$lib/Button.svelte';

	let gameMode: undefined | 'multi' | 'single' = undefined;
</script>

<div class="absolute left-10 top-10 z-10 text-stone-400 sm:text-white">
	<button on:click={(e) => location.reload()}>Home</button>
</div>

{#if gameMode === undefined}
	<div
		class="absolute z-0 top-0 left-0 w-full h-full p-6 sm:p-32 flex flex-col items-center justify-center bg-black/30"
	>
		<div
			class="w-full sm:max-w-[480px] h-full border-2 border-black bg-white rounded-2xl cursor-auto flex flex-col justify-center items-center p-2"
		>
			<div class="w-full p-8 mt-8 mx-8">
				<p class="text-pink-500 my-2 text-3xl">Hey there!</p>
				<p class="text-lg">Do you want to play with a single device or multiple devices?</p>
				<div class="flex flex-col sm:flex-row w-full gap-4 my-6 sm:my-12">
					<Button
						size="small"
						on:buttonClick={(e) => (gameMode = 'single')}
						buttonText={'Single'}
					/>
					<Button
						size="small"
						on:buttonClick={(e) => (gameMode = 'multi')}
						buttonText={'Multiple'}
					/>
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
<div
	class="fixed flex portrait:hidden lg:hidden h-full w-full bg-white justify-center items-center text-2xl"
>
	<p>Please turn your screen</p>
</div>
