<script>
	import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
	import { onMount } from "svelte";

    let authenticated = false

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
            } else {
                goto(resolve("/login"))
            }
        })
    })
</script>

{#if authenticated}
<div>
good
</div>
{/if}
