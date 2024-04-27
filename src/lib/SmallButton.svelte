<script>
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	export let buttonText = 'Click me';

	const dispatch = createEventDispatcher();
	function nextScreen() {
		dispatch('smallButton');
	}
</script>

<button
	on:click={nextScreen}
	class="flex flex-col justify-center items-center border-2 shadow-xl rounded-2xl border-black w-24 h-16 sm:h-24"
>
	<p class="text-center text-lg">{buttonText}</p>
</button>
