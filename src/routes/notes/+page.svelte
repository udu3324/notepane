<script>
	import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import Pane from "./Pane.svelte";

    let authenticated = false

    let notes = []
    let input = ""
    let publicURLCreation = false
    let publicPaneCreation = false

    let deletedNotes = []

    let selected
    let textAreaMarkdown
    let publicURL
    let publicPane
    let pinned

    $: {
        if (selected) {
            console.log("selected", selected)
            textAreaMarkdown = selected.markdown
            publicURL = selected.public_url
            publicPane = selected.public_pane
            pinned = selected.pinned
        }
    }

    onMount(() => {
        //check if has key stored
        if (localStorage.getItem("key") === null) goto(resolve("/login"))

        fetch('/api/auth', {
            method: "GET",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`
            }
        })
        .then((res) => {
            if (res.status === 200) {
                authenticated = true

                get()
            } else {
                //invalid key
                goto(resolve("/login"))
            }
        })
    })

    function get() {
        fetch('/api/notes/get', {
            method: "GET",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`
            }
        })
        .then(response=>response.json())
        .then((data) => {
            notes = data
            //console.log(notes)
        })
    }

    function add() {
        fetch('/api/notes/create', {
            method: "POST",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`
            },
            body: JSON.stringify({
                markdown: input,
                public_url: publicURLCreation,
                public_pane: publicPaneCreation
            })
        })
        .then(response=>response.json())
        .then((data) => {
            input = ''
            publicURLCreation = false
            publicPaneCreation = false

            //be efficient and dont do get()
            notes = [data, ...notes]
        })
    }

    function remove(id) {
        fetch('/api/notes/remove', {
            method: "DELETE",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`
            },
            body: JSON.stringify({
                "id": id
            })
        })
        .then(response=>response.json())
        .then((data) => {
            deletedNotes.push(data)

            //be efficient and dont do get()

            let index = notes.findIndex((note) => note.id === id)

            notes.splice(index, 1)
            notes = notes
        })
    }

    function submitModification(markdown, publicURL, publicPane, pinned) {
        //console.log(markdown, publicURL, publicPane, pinned)
        fetch('/api/notes/modify', {
            method: "POST",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id: selected.id,
                markdown: markdown,
                public_url: publicURL,
                public_pane: publicPane,
                pinned: pinned
            })
        })
        .then(response=>response.json())
        .then((data) => {
            //console.log("updated", data)

            let index = notes.findIndex((note) => note.id === selected.id)
            notes[index] = data
        })
    }
</script>

{#if authenticated}
<div>
    good
    
    <div class="border-2 border-solid w-fit">
        control panel
        <div class="border-2 border-solid">
            <textarea bind:value={input} type="text" placeholder="markdown"></textarea>
            <br>
            <input type="checkbox" bind:checked={publicURLCreation}> public url
            <input type="checkbox" bind:checked={publicPaneCreation}> public pane
            <br>
            <button on:click={add}>add note</button>
        </div>
    </div>

    {#if selected}
    <div class="border-2 border-solid w-fit">
        modify panel

        <textarea on:input={(e) => submitModification(e.target.value, undefined, undefined, undefined)} bind:value={textAreaMarkdown} placeholder="empty"></textarea>
        <input on:input={() => submitModification(undefined, !publicURL, undefined, undefined)} type="checkbox" bind:checked={publicURL}> public url
        <input on:input={() => submitModification(undefined, undefined, !publicPane, undefined)} type="checkbox" bind:checked={publicPane}> public pane
        <input on:input={() => submitModification(undefined, undefined, undefined, !pinned)} type="checkbox" bind:checked={pinned}> pinned
        <button on:click={remove(selected.id)}>delete note</button>
        <br>
        <button on:click={() => {selected = undefined}}>exit</button>
        
    </div>
    {/if}

    <div class="p-3 gap-2 flex flex-wrap bg-amber-400">
        {#each notes as note (note.id)}
        {#if note.pinned}
        <button on:click={() => {selected = note}}>
            <Pane note={note}/>
        </button>
        {/if}
        {/each}
    </div>


    <div class="p-3 gap-2 flex flex-wrap">
        {#each notes as note (note.id)}
        {#if !note.pinned}
        <button on:click={() => {selected = note}}>
            <Pane note={note}/>
        </button>
        {/if}
        {/each}
    </div>
    
</div>
{/if}

<style>
</style>