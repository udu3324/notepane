<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { onMount } from "svelte";

    let key
    let status = ''
    let statusText = ''

    onMount(() => {
        if (localStorage.getItem("key") === null) {
            status = "unauthorized"
        } else {
            status = "authorized"
        }
    })

    function login() {
        console.log("logging in")

        fetch('/api/auth', {
            method: "GET",
            headers: {
                "authorization": `Bearer ${key}`
            }
        })
        .then(response=>response.json())
        .then((data) => {
            //console.log("res", data)
            if (data.error) {
                statusText = JSON.stringify(data)
            } else if (data.status) {
                statusText = JSON.stringify(data)

                localStorage.setItem('key', key)
                goto(resolve("/notes"))
            }
        })
    }

    function logout() {
        localStorage.removeItem('key')
        window.open('/', '_self')
    }
</script>

{#if status === "unauthorized"}
<form on:submit={login} class="flex gap-2 items-stretch align-middle text-center">
    <button class="cursor-pointer outer p-1">login</button>
    <input bind:value={key} on:submit={login()} placeholder="key" type="password" class="outer pl-1">
    <span class="font-mono">{statusText}</span>
</form>
{:else if status === "authorized"}
<button class="cursor-pointer outer p-1" on:click={logout}>logout</button>
{#if page.url.pathname === "/notes"}
<button class="cursor-pointer outer p-1" on:click={() => goto(resolve("/"))}>exit manage page</button>
{:else}
<button class="cursor-pointer outer p-1" on:click={() => goto(resolve("/notes"))}>manage panes of notes</button>
{/if}
{/if}


<style lang="postcss">
	.outer {
        @apply border-t-2 border-l-2 border-r-4 border-b-8 border-solid;
    }
</style>