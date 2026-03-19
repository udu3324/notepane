<script>
	import { onMount } from 'svelte';
	import Pane from '../Pane.svelte';
	import { page } from '$app/stores';
    
    export let data

    let status = "loading"
    let note

    onMount(() => {
        if (localStorage.theme === "dark") {
			document.documentElement.classList.add("dark")
		}
        
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

<svelte:head>
    <meta name="description" content={status === "loaded" && note ? note.markdown.substring(0, 60) : ''} />
    
    <meta property="og:type" content="article"/>
    <meta property="og:url" content={$page.url.origin + $page.url.pathname} />
    <meta property="og:description" content={status === "loaded" && note ? note.markdown.substring(0, 60) : ''} />
    <meta property="article:published_time" content={status === "loaded" && note ? note.created_at : ''}/>
    <meta property="article:modified_time" content={status === "loaded" && note ? note.modified_at : ''}/>
</svelte:head>


<div class="grid h-screen w-screen place-content-center text-(--theme)">
    {#if status === "loaded"}
    <Pane note={note}/>
    {:else if status === "invalid"}
    <span class="font-mono">{JSON.stringify(note)}</span>
    {:else if status === "loading"}
    Loading
    {/if}
</div>