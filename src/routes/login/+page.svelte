<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

    let password

    function login() {
        console.log("logging in")
    }
</script>
<div>
    login
    <form on:submit={login}>
        <input bind:value={password} on:submit={login()} placeholder="password" type="text" class="border-2 border-solid">
    </form>
    
    <button on:click={() => goto(resolve("/"))}>back</button>
</div>