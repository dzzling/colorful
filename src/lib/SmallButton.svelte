<script>
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	export let buttonText = 'Click me';

	const dispatch = createEventDispatcher();
	function buttonClick() {
		dispatch('smallButtonClick');
	}
</script>

<button
	on:click={buttonClick}
	class="flex flex-col justify-center items-center border-2 shadow-xl rounded-2xl border-black w-24 h-16 sm:h-24"
>
	<p class="text-center text-lg">{buttonText}</p>
</button>
