<script>
	import { resolve } from "$app/paths";

    let { onFocus, note } = $props()

    function internalClick(event) {
        onFocus?.(event)
    }


    let breakText = $state("break-none")
    let footerText = note.created_at.substring(0, 10) //`${note.created_at.substring(0, 10)} - ${note.modified_at.substring(0, 10)}`
    
    // remove second date if its the same as the first one
    //if (note.created_at.substring(0, 10) === note.modified_at.substring(0, 10)) { 
    //    footerText = note.created_at.substring(0, 10)
    //}

    function toggleBreakText() {
        breakText = ( breakText === "whitespace-pre") ? "break-none" : "whitespace-pre"
    }

</script>

<div class="outer leading-0">
    <!-- <textarea bind:this={textArea} disabled={true} placeholder="empty notepane">{note.markdown}</textarea> -->
    <button on:click={internalClick}>
        <div class="textarea leading-6 {breakText}">{note.markdown}</div>
    </button>
    
    <div class="footer flex justify-between">
        <span title={JSON.stringify(note, null, "    ")}>{footerText}.metadata</span>
        
        <div class="right-0">
            <button on:click={toggleBreakText} title="Toggle breaking text that overflows" class="special">BREAK</button>

            {#if note.public_url}
            <a href={resolve(`/notes/${note.public_uuid}`)} target="_blank" rel="noopener noreferrer">URL</a>
            {/if}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    .special {
        @apply cursor-pointer hover:bg-white hover:text-black dark:hover:bg-(--theme-background) dark:hover:text-(--theme);
    }

    a:hover {
        @apply underline;
    }

    .outer {
        @apply border-t-2 border-l-2 border-r-8 border-solid border-(--theme);
        @apply w-fit h-fit max-w-svw;
    }

    .textarea {
        @apply resize min-w-52 min-h-52 w-52 h-52 px-1 text-left max-w-svw text-(--theme);
        overflow: auto;
    }

    .footer {
        @apply text-xs font-mono bg-(--theme) text-(--theme-background);
    }
</style>