<script>
	import AuthBar from "./AuthBar.svelte";

</script>
<div class="flex gap-2 p-3">
    <div class="outer p-1">
		<h1>notepane</h1>
	</div>

	<AuthBar/>
</div>

<style lang="postcss">
	.outer {
        @apply border-t-2 border-l-2 border-r-4 border-b-8 border-solid;
        @apply w-fit h-fit;
    }
</style>