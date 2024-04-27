<script>
	import Button from '$lib/SmallButton.svelte';
	export let modalButtonText = 'Click me';
</script>

<div
	class="w-full sm:max-w-[480px] h-full border-2 border-black bg-white rounded-2xl cursor-auto px-2 sm:p-2 pb-12 pt-12"
>
	<div class="h-full w-full overflow-auto flex flex-col sm:justify-center items-center">
		<h2 class="text-3xl">Instructions</h2>
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

		<Button on:smallButton buttonText={modalButtonText} />
	</div>
</div>
