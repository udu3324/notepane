<script>
	import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
	import { onMount } from "svelte";

    let authenticated = false

    let notes = []
    let input

    let deletedNotes = []

    onMount(() => {

        if (localStorage.getItem("key") === null) {
            goto(resolve("/login"))
        }

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
            console.log(notes)
        })
    }

    function add() {
        fetch('/api/notes/create', {
            method: "GET",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`,
                "markdown": input
            }
        })
        .then(response=>response.json())
        .then((data) => {
            //be efficient and dont do get()
            notes = [data, ...notes]
        })
    }

    function remove(id) {
        fetch('/api/notes/remove', {
            method: "GET",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`,
                "id": id
            }
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
</script>

{#if authenticated}
<div>
    good

    <div class="border-2 border-solid w-fit">
        control panel
        <div class="border-2 border-solid">
            <input bind:value={input} type="text" placeholder="markdown">
            <button on:click={add}>add note</button>
        </div>
        <button on:click={get}>get notes</button>
    </div>

    {#each notes as note (note.id)}
    <div class="border-2 border-solid w-fit">
        {note.id}
        {note.markdown}
        <button on:click={() => remove(note.id)} class="border-2 border-solid">remove</button>
    </div>
    {/each}
</div>
{/if}
