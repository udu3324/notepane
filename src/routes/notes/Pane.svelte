<script>
	import { resolve } from "$app/paths";

	export let note


    let breakText = "break-all"
    let footerText = note.created_at.substring(0, 10) //`${note.created_at.substring(0, 10)} - ${note.modified_at.substring(0, 10)}`

    // remove second date if its the same as the first one
    //if (note.created_at.substring(0, 10) === note.modified_at.substring(0, 10)) { 
    //    footerText = note.created_at.substring(0, 10)
    //}

    function toggleBreakText() {
        breakText = ( breakText === "break-normal") ? "break-all" : "break-normal"
    }

</script>

<div class="outer">
    <!-- <textarea bind:this={textArea} disabled={true} placeholder="empty notepane">{note.markdown}</textarea> -->
    <div class="textarea {breakText}">{note.markdown}</div>
    <div class="footer flex justify-between">
        <span title={JSON.stringify(note, null, "    ")}>{footerText}.metadata</span>
        
        <div class="right-0">
            <button on:click={toggleBreakText} title="Toggle breaking text that overflows">BREAK</button>

            {#if note.public_url}
            <a href={resolve(`/notes/${note.public_uuid}`)} target="_blank" rel="noopener noreferrer">URL</a>
            {/if}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    button {
        @apply cursor-pointer hover:bg-white hover:text-black;
    }

    a:hover {
        @apply underline;
    }

    .outer {
        @apply border-t-2 border-l-2 border-r-8 border-solid;
        @apply w-fit h-fit;
    }

    .textarea {
        @apply resize min-w-52 min-h-52 w-52 h-52 px-1 text-left;
        overflow: auto;
    }

    .footer {
        @apply text-xs font-mono bg-black text-white;
    }
</style>