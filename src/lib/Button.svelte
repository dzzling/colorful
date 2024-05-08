<script>
	import { createEventDispatcher } from 'svelte';
	export let buttonText = 'Click me';
	export let size = 'big';

	let buttonStyle;

	if (size == 'big') {
		buttonStyle =
			'flex flex-col justify-center items-center border-2 shadow-xl rounded-2xl border-black w-56 h-16 sm:w-96 sm:h-24';
	} else {
		buttonStyle =
			'flex flex-col justify-center items-center border-2 shadow-xl rounded-2xl border-black w-24 h-16 sm:h-24';
	}

	const dispatch = createEventDispatcher();
	function buttonClick() {
		dispatch('buttonClick');
	}
</script>

<button on:click={buttonClick} class={buttonStyle}>
	<p class="text-center text-lg">{buttonText}</p>
</button>
