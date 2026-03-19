<script>
	import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import Pane from "./Pane.svelte";
	import Navbar from "../Navbar.svelte";
	import { between } from "$lib";
	//import { Carta, MarkdownEditor } from "carta-md";
    //import 'carta-md/default.css';

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
            textAreaMarkdown = selected.markdown
            publicURL = selected.public_url
            publicPane = selected.public_pane
            pinned = selected.pinned
            confirmDelete = false
        }
    }

    onMount(() => {
        //check if has key stored
        if (localStorage.getItem("key") === null) goto(resolve("/"))

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
                localStorage.removeItem('key')
                goto(resolve("/"))
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
        if (input.length === 0) return
        
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
            notes = [data[0], ...notes]
        })
    }

    let confirmDelete = false
    function remove(id) {
        if (!confirmDelete) {
            confirmDelete = true
            alert("Are you sure you want to delete this? Press the button again to continue.")
            return
        }

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

        confirmDelete = false
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

    let x, y
    function unselect(event) {
        let diffX = event.x
        let diffY = event.y

        if (event.x === undefined) { //its a mobile touch
            diffX = event.changedTouches[0].clientX
            diffY = event.changedTouches[0].clientY
        }
        
        if (between(x, diffX, 5) && between(y, diffY, 5)) {
            selected = undefined
        }
    }

    function pointerDownEvent(event) {
        x = event.clientX
        y = event.clientY
    }
    /*
    const carta = new Carta({
		// Remember to use a sanitizer to prevent XSS attacks
		// sanitizer: mySanitizer
	});

	let valueMD = ""
    */
</script>


{#if selected}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:click={unselect} on:pointerdown={pointerDownEvent} on:touchstart={unselect} class="fixed grid h-screen w-screen place-content-center bg-black/50">
    <div on:click|stopPropagation on:touchstart|stopPropagation id="selection" class="border-t-2 border-l-2 border-r-8 border-solid bg-(--theme-background) border-(--theme)">
        <textarea on:input={(e) => submitModification(e.target.value, undefined, undefined, undefined)} bind:value={textAreaMarkdown} placeholder="empty" class="w-full min-h-96 min-w-96 max-h resize" style="max-width: var(--pane-width-max);"></textarea>

        <div class="bg-(--theme) text-(--theme-background) flex justify-between font-mono">
            <button on:click={() => remove(selected.id)} class="pl-2">Delete</button>

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
        <div class="border-t-2 border-l-2 border-r-8 border-solid border-(--theme)">
            <textarea bind:value={input} type="text" placeholder="markdown" class="w-full min-h-52 min-w-96 resize" style="max-width: var(--pane-width-max);"></textarea>
            <!--<MarkdownEditor bind:valueMD {carta} />-->            
            <div class="flex justify-between text-(--theme-background) bg-(--theme) font-mono w-full">
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

    <div class="panes border-b-2 border-t-2 border-(--theme)">
        <div class="panes-inner">
            {#each notes as note (note.id)}
            {#if note.pinned}
            <Pane note={note} onFocus={() => {selected = note}}/>
            {/if}
            {/each}
        </div>
    </div>

    <div class="panes">
        <div class="panes-inner">
            {#each notes as note (note.id)}
            {#if !note.pinned}
            <Pane note={note} onFocus={() => {selected = note}}/>
            {/if}
            {/each}
        </div>
    </div>
    
</div>
{/if}

<style lang="postcss">
    @reference "tailwindcss";

    textarea {
        @apply text-(--theme);
        margin-bottom: -6px;
    }

    .panes {
        @apply p-3 gap-2 flex flex-wrap;
    }
    .panes-inner {
        @apply gap-2 flex flex-wrap;
    }

    @media only screen and (max-device-width: 570px) {
		.panes {
            @apply place-content-center;
		}
        .panes-inner {
            @apply grid grid-flow-row grid-cols-2 gap-2;
        }
	}
</style>