<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let difficultyIndex: undefined | number = undefined;
	const dispatch = createEventDispatcher();
	function resetAll() {
		dispatch('resetAll');
	}
</script>

<div class="w-full px-16">
	<p>Difficulty</p>
	<input
		class="w-full"
		type="range"
		min={0}
		max={100}
		bind:value={difficultyIndex}
		on:change={() => {
			resetAll();
		}}
	/>
</div>
