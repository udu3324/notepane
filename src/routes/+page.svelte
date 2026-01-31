<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

</script>

<div>
    <h1>notepane</h1>
</div>

<button on:click={() => goto(resolve("/login"))}>login</button>