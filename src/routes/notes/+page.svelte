<script>
	import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import Pane from "./Pane.svelte";
	import Navbar from "../Navbar.svelte";

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
            console.log("cursor is", document.body.style.cursor)
            console.log(getComputedStyle(document.body).cursor)
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

            selected = undefined
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

    function unselect() {
        selected = undefined
    }
</script>


{#if selected}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:click={unselect} class="fixed grid h-screen w-screen place-content-center">
    <div on:click|stopPropagation id="selection" class="border-t-2 border-l-2 border-r-8 border-solid backdrop-blur-lg">
        <textarea on:input={(e) => submitModification(e.target.value, undefined, undefined, undefined)} bind:value={textAreaMarkdown} placeholder="empty" class="w-full min-h-96 min-w-96 max-w-svw max-h resize"></textarea>

        <div class="bg-black text-white flex justify-between font-mono">
            <button on:click={remove(selected.id)} class="pl-2">Delete</button>

            <div class="text-xs place-content-center">
                <input id="ppi" on:input={() => submitModification(undefined, undefined, undefined, !pinned)} type="checkbox" bind:checked={pinned}>
                <label for="ppi" class="select-none" title="Pin this note">Pinned</label>

                <input id="ppu" on:input={() => submitModification(undefined, !publicURL, undefined, undefined)} type="checkbox" bind:checked={publicURL}>
                <label for="ppu" class="select-none" title="Create a sharable url">Public URL</label>
                <input id="ppp" on:input={() => submitModification(undefined, undefined, !publicPane, undefined)} type="checkbox" bind:checked={publicPane}>
                <label for="ppp" class="select-none" title="Display it publicly on the front page">Public Pane</label>
            </div>
        </div>
    </div>
</div>
{/if}

{#if authenticated}

<Navbar/>

<div>
    <div class="flex place-content-center m-3">
        <div class="border-t-2 border-l-2 border-r-8 border-solid">
            <textarea bind:value={input} type="text" placeholder="markdown" class="w-full min-h-52 min-w-96 max-w-svw resize"></textarea>
        
            <div class="flex justify-between text-white bg-black font-mono w-full">
                <button on:click={add} class="pl-2 hover:underline">Publish</button>

                <div class="text-xs place-content-center">
                    <input type="checkbox" id="pu" bind:checked={publicURLCreation}>
                    <label for="pu" class="select-none" title="Create a sharable url">Public URL</label>

                    <input type="checkbox" id="pp" bind:checked={publicPaneCreation}> 
                    <label for="pp" class="select-none" title="Display it publicly on the front page">Public Pane</label>
                </div>
            </div>
        </div>
    </div>

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

<style lang="postcss">
    textarea {
        margin-bottom: -6px;
    }
</style>