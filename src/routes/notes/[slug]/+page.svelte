<script>
	import { onMount } from 'svelte';
	import Pane from '../Pane.svelte';

    export let data

    let status = "loading"
    let note

    onMount(() => {
        fetch(`/api/notes/get/${data.slug}`)
        .then(response=>response.json())
        .then((data) => {
            note = data
            if (data.error) {
                status = "invalid"
                return
            }
            status = "loaded"
            console.log(note)
        })
    })
</script>

<div class="grid h-screen w-screen place-content-center">
    {#if status === "loaded"}
    <Pane note={note}/>
    {:else if status === "invalid"}
    <span class="font-mono">{JSON.stringify(note)}</span>
    {:else if status === "loading"}
    Loading
    {/if}
</div>