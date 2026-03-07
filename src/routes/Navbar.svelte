<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import AuthBar from "./AuthBar.svelte";
	import PortBar from "./PortBar.svelte";

	let darkmode = false

	onMount(() => {
		console.log("theme:", localStorage.theme)
		
		if (localStorage.theme) {
			darkmode = (localStorage.getItem('theme') === "dark") ? true : false

			if (darkmode) {
				document.documentElement.classList.add("dark")
			}
		} else {
			darkmode = false
			localStorage.setItem('theme', "light")
		}
	})

	function toggle() {
		darkmode = !darkmode

		if (darkmode) {
			document.documentElement.classList.add("dark")
			localStorage.setItem('theme', 'dark')
		} else {
			document.documentElement.classList.remove("dark")
			localStorage.setItem('theme', 'light')
		}
	}
</script>

<div class="flex gap-2 p-3">
	<button class="outer p-1" on:click={() => goto(resolve("/"))}>notepane</button>
	
	<AuthBar/>
	<PortBar/>

	<div class="absolute right-0 pr-3">
		<button on:click={toggle} class="outer p-1 px-2">
		{#if darkmode}
		<i class="fa-regular fa-sun"></i>
		{:else}
		<i class="fa-regular fa-moon"></i>
		{/if}
	</button>
	</div>
</div>

<style lang="postcss">
	.outer {
        @apply border-t-2 border-l-2 border-r-4 border-b-8 border-solid;
		@apply cursor-pointer hover:outline-2 hover:outline-(--accent);
        @apply w-fit h-fit text-(--theme);
    }
</style>