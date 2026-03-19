<script>
	import { onMount } from 'svelte';
	import Pane from '../Pane.svelte';
	import { page } from '$app/stores';
    
    export let data
    $: note = data?.note
    $: description = note?.markdown ? note.markdown.substring(0, 60) : ''

    onMount(() => {
        if (localStorage.theme === "dark") {
			document.documentElement.classList.add("dark")
		}
    })
</script>

<svelte:head>
    <meta name="description" content={description} />
    
    <meta property="og:type" content="article"/>
    <meta property="og:url" content={$page.url.origin + $page.url.pathname} />
    <meta property="og:description" content={description} />
    <meta property="article:published_time" content={note ? note.created_at : ''}/>
    <meta property="article:modified_time" content={note ? note.modified_at : ''}/>
</svelte:head>


<div class="grid h-screen w-screen place-content-center text-(--theme)">
    {#if note.error !== undefined}
    <span class="font-mono">{JSON.stringify(note)}</span>
    {:else}
    <Pane note={note}/>
    {/if}
</div>