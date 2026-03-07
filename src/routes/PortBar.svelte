<script>
    import { page } from "$app/state";

    let files = $state()

    let fileContent = []
    let importing = $state(false)
    let textlog = $state("")

	$effect(() => { //https://svelte.dev/playground/file-inputs?version=5.53.3
		if (files) {
			// Note that `files` is of type `FileList`, not an Array:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileList
			console.log("importing", files.length)
            
            batchImport()
		}
	});

    async function batchImport() {

        importing = true

        // read all the json files
        let i = 1
        for (const file of files) {

            if (!file.name.includes(".json")) {
                continue
            }

            let content = await file.text()
            fileContent.push(JSON.parse(content))
            log(`${i}/${files.length} - reading ${file.name}`)
            //await new Promise(resolve => setTimeout(resolve, 500))

            i++
		}

        // send them to the api
        for (const obj of fileContent) {
            //color, createdTimestampUsec, isArchived, isPinned, isTrashed, textContent, textContentHtml, title, userEditedTimestampUsec
            const created = new Date(obj.createdTimestampUsec / 1000)
            const modified = new Date(obj.userEditedTimestampUsec / 1000)

            await fetch('/api/notes/create', {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`
                },
                body: JSON.stringify({
                    markdown: obj.textContent,
                    public_url: false,
                    public_pane: false,
                    created_at: created.toISOString(),
                    modified_at: modified.toISOString()
                })
            })
            .then(response=>response.json())
            .then(() => {
                log(`${fileContent.indexOf(obj) + 1}/${fileContent.length} - notes upload`)
            })
            //await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log("finished")


        importing = false

        fileContent = []
        files = undefined
        textlog = ""
    }

    function log(line) {
        console.log(line)
        textlog = `${line}\n${textlog}`
    }

	function exportNotes() {
        fetch('/api/notes/get', {
            method: "GET",
            headers: {
                "authorization": `Bearer ${localStorage.getItem("key").replaceAll("\"", "")}`
            }
        })
        .then(response=>response.json())
        .then((data) => {
            const json = JSON.stringify(data, null, "\t")
            const blob = new Blob([json], { type: "application/json"})
            const url = URL.createObjectURL(blob)

            let hiddenElement = document.createElement('a')
            hiddenElement.href = url
            hiddenElement.download = `${(new Date()).toISOString()}.json`
            hiddenElement.click()
            
            URL.revokeObjectURL(url)
            hiddenElement.remove()
        })
	}
</script>

{#if importing}
<div class="fixed grid h-screen w-screen place-content-center bg-black/50">
    <textarea id="selection" class="border-2 w-96 h-96 border-solid text-(--theme) bg-(--theme-background) border-(--theme)" disabled>{textlog}</textarea>
</div>
{/if}

{#if page.url.pathname === "/notes"}
<label for="file-upload" class="outer p-1 cursor-pointer">
    import
</label>
<input bind:files id="file-upload" type="file" class="hidden" webkitdirectory directory multiple/>
<button class="cursor-pointer outer p-1" on:click={exportNotes}>export</button>
{/if}

<style lang="postcss">
    @import 'tailwindcss';

	.outer {
        @apply border-t-2 border-l-2 border-r-4 border-b-8 border-solid;
        @apply w-fit h-fit;
        @apply hover:outline-2 hover:outline-(--accent);
        @apply border-(--theme) text-(--theme);
    }
</style>