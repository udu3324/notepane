<script>
	import { onMount } from "svelte";
	import AuthBar from "./AuthBar.svelte";

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
    <div class="outer p-1 text-(--theme)">
		<h1>notepane</h1>
	</div>

	<AuthBar/>

	<button on:click={toggle} class="outer p-1 px-2 text-(--theme) cursor-pointer">
		{#if darkmode}
		<i class="fa-solid fa-sun"></i>
		{:else}
		<i class="fa-regular fa-moon"></i>
		{/if}
	</button>
</div>

<style lang="postcss">
	.outer {
        @apply border-t-2 border-l-2 border-r-4 border-b-8 border-solid;
        @apply w-fit h-fit;
    }
</style>