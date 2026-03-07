<script>
	import { resolve } from "$app/paths";

    let { onFocus, note } = $props()

    let x, y

    function internalClick(event) {
        let diffX = event.x
        let diffY = event.y

        if (event.x === undefined) { //its a mobile touch
            diffX = event.changedTouches[0].clientX
            diffY = event.changedTouches[0].clientY
        }

        //tolerance
        if (between(x, diffX, 5) && between(y, diffY, 5)) {
            onFocus?.(event)
        }        
    }

    function pointerDownEvent(event) {
        x = event.x
        y = event.y
    }

    function between(reference, check, tolerance) { //https://stackoverflow.com/a/6454237/16216937
        return Math.abs(reference - check) <= tolerance
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
    <button on:click={internalClick} on:touchend={internalClick} on:pointerdown={pointerDownEvent} on:on:touchstart={pointerDownEvent}>
        <div class="textarea leading-6 {breakText}">{note.markdown}</div>
    </button>
    
    <div class="footer flex justify-between">
        <span title={JSON.stringify(note, null, "    ")}>{footerText}<span class="mdflare">.metadata</span></span>
        
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
        @apply w-fit h-fit;
    }

    .textarea {
        @apply resize px-1 text-left text-(--theme);
        @apply min-w-52 min-h-52 w-52 h-52;
        max-width: var(--pane-width-max);
        /*screen width - borders - padding*/
        overflow: auto;
    }

    @media only screen and (max-device-width: 570px) {
		.textarea {
			@apply min-w-44 min-h-44 w-44 h-44;
		}
        .mdflare {
            @apply hidden;
        }
	}
    
    .footer {
        @apply text-xs font-mono bg-(--theme) text-(--theme-background);
    }
</style>