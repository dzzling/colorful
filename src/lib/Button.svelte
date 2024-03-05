<script>
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	export let buttonText = 'Click me';

	const dispatch = createEventDispatcher();
	function nextScreen() {
		dispatch('next');
	}
</script>

<button
	on:click={nextScreen}
	class="flex flex-col justify-center items-center border-2 rounded-2xl border-black w-96 h-24"
>
	<p class="text-center text-lg">{buttonText}</p>
</button>
