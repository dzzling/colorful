<script lang="ts">
	import clsx from 'clsx';

	type Color = string;

	function getRandomInt(minParam: number, maxParam: number) {
		const min = Math.ceil(minParam);
		const max = Math.floor(maxParam);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomColors(): Array<Color> {
		// TODO: Actually randomize this
		return [
			'#d0bfff',
			'#9775fa',
			'#da77f2',
			'#be4bdb',
			'#7950f2',
			'#fcc2d7',
			'#1971c2',
			'#ff8787',
			'#a5d8ff'
		];
	}

	let screen = 0;
	let colors = getRandomColors();
	let targetColorIndex = getRandomInt(0, colors.length - 1);
	let selectedColorIndex: undefined | number = undefined;

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
			screen = 1;
			targetColorIndex = getRandomInt(0, colors.length - 1);
			selectedColorIndex = undefined;
		}
	}

	function selectColor(index: number) {
		selectedColorIndex = index;
	}
</script>

{#if screen === 0 || screen === 4}
	<div
		class="absolute top-0 left-0 w-full h-full p-32 flex items-center justify-center bg-black/30"
	>
		<div
			class="w-full max-w-[480px] h-full border-2 border-black bg-white rounded-md cursor-auto flex flex-col justify-center items-center p-4"
		>
			{#if screen === 4}
				{#if targetColorIndex === selectedColorIndex}
					<h2 class="text-xl mt-4">Correct!</h2>
				{:else if targetColorIndex != selectedColorIndex}
					<h2 class="text-xl mt-4">That was close!</h2>
				{/if}
				<div class="my-auto flex justify-center flex-col items-center">
					<p class="mb-4">This was the color we were looking for:</p>
					<div
						class="w-52 h-52 rounded-md"
						style="background-color: {colors[targetColorIndex]};"
					></div>
				</div>
			{/if}

			{#if screen === 0}
				<h2 class="text-xl mt-4">Instructions</h2>
				<p class="mt-8">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in tellus facilisis,
					efficitur velit sit amet, commodo neque.<br /> <br /> Proin at est consequat libero
					pharetra lacinia ut ac nibh. Orci varius natoque penatibus et magnis dis parturient
					montes, nascetur ridiculus mus. In placerat enim a lectus congue, vitae finibus nisl
					iaculis. Nec faucibus nisi faucibus sed. Praesent a iaculis magna. <br /> <br /> Pellentesque
					in tellus facilisis, efficitur velit sit amet, commodo neque. In placerat enim a lectus congue,
					vitae finibus nisl iaculis. Nullam ullamcorper sagittis magna, nec faucibus nisi faucibus sed.
					Praesent a iaculis magna. Donec nec volutpat ante. Phasellus eleifend non velit non tempus.
				</p>
			{/if}

			<button
				class="bg-white rounded-md border-black border-2 whitespace-nowrap w-full p-4 mt-auto"
				on:click={handleNextScreenButtonClick}
			>
				{#if screen === 0}
					<p>I understand</p>
				{:else if screen === 4}
					<p>Another round!</p>
				{/if}
			</button>
		</div>
	</div>
{/if}

<div class="w-full min-h-screen flex flex-col items-center px-8">
	<div class="w-full flex-1 max-w-[640px] flex flex-col items-center justify-evenly">
		<div class="w-full h-full flex flex-col justify-center items-center">
			<h1 class="text-center text-xl font-bold w-full">Colorfül</h1>
		</div>
		<div class="h-96 w-96 grid grid-rows-3 grid-cols-3 gap-4">
			{#each colors as color, index}
				<div
					class={clsx(
						'w-full rounded-md h-full flex justify-center items-center',
						screen === 3 && 'cursor-pointer',
						screen === 3 && selectedColorIndex === index && 'ring ring-black'
					)}
					style="background-color: {color};"
					on:click={() => selectColor(index)}
				>
					{#if targetColorIndex === index && screen === 2}
						<p class="text-2xl">x</p>
					{/if}
				</div>
			{/each}
		</div>
		<div class="w-full h-full flex flex-col justify-center items-center">
			{#if screen === 0 || screen === 1 || screen === 2 || (screen === 3 && selectedColorIndex !== undefined)}
				<button
					class="w-96 h-24 border-2 rounded-md border-black text-lg"
					on:click={handleNextScreenButtonClick}
				>
					{#if screen === 1}
						<p class="text-lg">Show me the target</p>
					{:else if screen === 2}
						<p class="text-lg">Got it!</p>
					{:else if screen === 3 && selectedColorIndex !== undefined}
						<p class="text-lg">Log in</p>
					{/if}
				</button>
			{/if}
			{#if screen === 3 && selectedColorIndex === undefined}
				<p class="text-lg">Please select a color</p>
			{/if}
		</div>
	</div>
</div>
