import * as Notes from '$lib/server/notes'
import { consume } from "$lib/server/ratelimit"

export async function GET({ request, getClientAddress }) {
    const ip = request.headers.get("x-forwarded-for") || getClientAddress()
    const success = await consume(ip)
    
    if (!success) {
        return new Response(JSON.stringify({
                error: "ratelimited",
            }), { status: 429 })
    }

    let sensitive = await Notes.getNotes()

    let safe = []
    sensitive.forEach(note => {
        if (!note.public_pane) return
        
        safe.push({
            created_at: note.created_at,
            modified_at: note.modified_at,
            markdown: note.markdown
        })
    })
    
    return new Response(JSON.stringify(safe), { status: 200 })
}