<script>
	import { onMount } from "svelte";
	import Pane from "./notes/Pane.svelte";
	import Navbar from "./Navbar.svelte";

	let notes

	onMount(() => {
		fetch('/api/notes/get/public')
        .then(response=>response.json())
        .then((data) => {
            notes = data
        })
	})
</script>

<Navbar/>

<div class="p-3 space-x-2 space-y-2 flex flex-wrap">
	{#each notes as note (notes.indexOf(note))}
		<Pane note={note}/>
	{/each}
</div>