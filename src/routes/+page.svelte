<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import Pane from "./notes/Pane.svelte";

	let notes

	onMount(() => {
		fetch('/api/notes/get/public')
        .then(response=>response.json())
        .then((data) => {
            notes = data
        })
	})
</script>

<div>
    <h1>notepane</h1>
</div>

<button on:click={() => goto(resolve("/login"))}>login</button>

<div class="p-3 space-x-2 space-y-2 flex flex-wrap">
	{#each notes as note (notes.indexOf(note))}
		<Pane note={note}/>
	{/each}
</div>