<script lang="ts">
	import { type Color } from 'chroma-js';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	export let variant: 'NORMAL' | 'TARGET' | 'SELECTED' | 'WON' | 'LOST_CORRECT' | 'LOST_INCORRECT' =
		'NORMAL';
	export let Color: undefined | Color = undefined;
	export let tileIndex: undefined | number = undefined;

	const dispatch = createEventDispatcher<{
		select: undefined;
	}>();

	function select() {
		dispatch('select');
	}
</script>

<div
	class={clsx(
		'w-full rounded-2xl h-full flex justify-center items-center outline outline-2 outline-black',
		variant === 'SELECTED' && 'outline-4 outline-black outline-dashed',
		(variant === 'TARGET' || variant === 'WON' || variant === 'LOST_INCORRECT') &&
			'outline outline-4 outline-black'
	)}
	style="background-color: {Color};"
	on:click={() => select()}
>
	{#if variant === 'TARGET'}
		<img src="screen-normal.svg" alt="Target" width="40%" height="40%" />
	{:else if variant === 'WON' || variant === 'LOST_CORRECT'}
		<img src="check-circle.svg" alt="Target" width="40%" height="40%" />
	{:else if variant === 'LOST_INCORRECT'}
		<img src="x-circle.svg" alt="Selected color" width="40%" height="40%" />
	{/if}
</div>
