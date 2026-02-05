<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

    let key
    let status = ''

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
            console.log("res", data)
            if (data.error) {
                status = data.error
            } else if (data.status) {
                status = data.status

                localStorage.setItem('key', key)
                goto(resolve("/notes"))
            }
        })
    }
</script>
<div>
    <form on:submit={login}>
        <input bind:value={key} on:submit={login()} placeholder="key" type="password" class="border-2 border-solid">
        <button class="border-2 border-solid">login</button>
    </form>
    
    <!-- you dont deserve a convenient back button if you dont intend to log in <button on:click={() => goto(resolve("/"))}>back</button> -->

    {status}
</div>