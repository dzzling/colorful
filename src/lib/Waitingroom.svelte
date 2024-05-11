<script lang="ts">
	import Button from '$lib/Button.svelte';
	export let room = '---ERROR---';
	export let roomUsers: Array<String> = new Array();
</script>

<div
	class="w-full max-w-[480px] h-full border-2 border-black bg-white rounded-2xl cursor-auto flex flex-col justify-center items-center p-2"
>
	<h2 class="text-3xl mt-4">Waiting for users</h2>
	<p class="mt-4">This is your room name: {room}</p>
	<br />
	<div class=" bg-violet-200 p-1 rounded-lg mb-4 flex flex-row">
		<p class="px-2">Users in this room:</p>
	</div>
	<ol class="list-decimal px-10 pb-5">
		{#each roomUsers as user}
			<li>{user}</li>
		{/each}
	</ol>

	<Button on:buttonClick size={'big'} buttonText={'Start game'} />
</div>
