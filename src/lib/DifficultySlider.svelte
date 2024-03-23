<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let value: undefined | number = undefined;
	const dispatch = createEventDispatcher<{
		change: number;
	}>();
</script>

<div class="w-full px-16">
	<p>Difficulty</p>
	<input
		class="w-full"
		type="range"
		min={0}
		max={100}
		bind:value
		on:change={(e) => dispatch('change', parseInt(e.currentTarget.value))}
	/>
</div>
