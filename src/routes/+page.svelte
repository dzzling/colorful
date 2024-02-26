<script lang="ts">
	import { getRandomColors } from '$lib/colors';
	import { getRandomInt } from '$lib/random';
	import clsx from 'clsx';
	import type { ChangeEventHandler } from 'svelte/elements';

	let difficulty = 0;
	let screen = 0;
	let colors = getRandomColors(1);
	let targetColorIndex = getRandomInt(0, colors.length - 1);
	let selectedColorIndex: undefined | number = undefined;

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
</script>

{#if screen === 0}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<div
			class="w-full max-w-[480px] h-full border-2 border-black bg-white rounded-2xl cursor-auto flex flex-col justify-center items-center p-2"
		>
			<h2 class="text-3xl mt-4">Instructions</h2>
			<p class="mt-4">Welcome to our color guessing game!</p>
			<br />
			<div class=" bg-violet-200 p-1 rounded-lg mb-4 flex flex-row">
				<p class="px-2">Here is how it works</p>
				<img src="pin.svg" alt="Icon" width="10%" height="10%" />
			</div>
			<ol class="list-decimal px-10 pb-5">
				<li>Choose your difficulty level, which you can adjust at any time during the game.</li>
				<li>
					When you're ready, push the button to reveal the target color, then describe it to your
					teammate.
				</li>
				<li>Click the button again to hide the target color icon.</li>
				<li>Your teammate can then log in and select a color.</li>
				<li>The selected color will be circled green if correct, and red if wrong.</li>
				<li>Continue to the next round and keep the fun going!</li>
			</ol>

			<button
				class="bg-white rounded-2xl border-black border-2 whitespace-nowrap w-full p-4 mt-auto"
				on:click={handleNextScreenButtonClick}
			>
				<p>Let's go</p>
			</button>
		</div>
	</div>
{/if}

<div class={clsx('w-full min-h-screen flex flex-col items-center px-8 bg-black/10')}>
	<div
		class={clsx(
			'w-full flex-1 max-w-[640px] flex flex-col items-center justify-evenly bg-white rounded-2xl my-10 border-2 border-black'
		)}
	>
		<div class="w-full h-full flex flex-col justify-center items-center">
			<h1 class="text-center text-3xl font-bold w-full">Colorfül</h1>
		</div>
		<div class="h-96 w-96 grid grid-rows-3 grid-cols-3 gap-4">
			{#each colors as color, index}
				<div
					class={clsx(
						'w-full rounded-2xl h-full flex justify-center items-center outline outline-2 outline-black',
						screen === 3 && 'cursor-pointer',
						screen === 3 &&
							selectedColorIndex === index &&
							'outline-4 outline-black outline-dashed',
						screen === 2 && targetColorIndex === index && 'outline outline-4 outline-black',
						screen === 4 && index === selectedColorIndex && 'outline outline-4 outline-black'
					)}
					style="background-color: {color};"
					on:click={() => selectColor(index)}
				>
					{#if targetColorIndex === index && screen === 2}
						<img src="screen-normal.svg" alt="Target" width="40%" height="40%" />
					{/if}
					{#if screen === 4}
						{#if targetColorIndex === index}
							<img src="check-circle.svg" alt="Target" width="40%" height="40%" />
						{/if}
						{#if selectedColorIndex === index && selectedColorIndex != targetColorIndex}
							<img src="x-circle.svg" alt="Selected color" width="40%" height="40%" />
						{/if}
					{/if}
				</div>
			{/each}
		</div>
		<div class="w-full h-32 flex flex-col justify-center items-center">
			{#if screen === 0 || screen === 1 || screen === 2 || (screen === 3 && selectedColorIndex !== undefined) || screen === 4}
				<button
					class="w-96 h-24 border-2 rounded-2xl border-black text-lg"
					on:click={handleNextScreenButtonClick}
				>
					{#if screen === 1}
						<p class="text-lg">Show me the target</p>
					{:else if screen === 2}
						<p class="text-lg">Got it!</p>
					{:else if screen === 3 && selectedColorIndex !== undefined}
						<p class="text-lg">Log in</p>
					{:else if screen === 4}
						{#if targetColorIndex === selectedColorIndex}
							<p>Correct. Another round!</p>
						{:else}
							<p>Close enough. Another round!</p>{/if}
					{/if}
				</button>
			{/if}
			{#if screen === 3 && selectedColorIndex === undefined}
				<p class="text-lg">Please select a color</p>
			{/if}
		</div>
		<div class="h-16 w-full">
			{#if screen === 1}
				<div class="w-full px-16">
					<p>Difficulty</p>
					<input
						class="w-full"
						type="range"
						min={0}
						max={100}
						bind:value={difficulty}
						on:change={(e) => reset(parseInt(e.currentTarget.value))}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>
