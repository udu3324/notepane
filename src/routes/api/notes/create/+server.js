import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'

export async function GET({ request }) {
    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")
    
    const markdown = request.headers.get("markdown")

    if (!key) {
        return new Response(JSON.stringify({
                error: "no key provided",
            }), { status: 400 })
    }

    if (key !== PASSWORD) {
        return new Response(JSON.stringify({
                error: "invalid key",
            }), { status: 400 })
    }

    if (!markdown) {
        return new Response(JSON.stringify({
                error: "no markdown provided",
            }), { status: 400 })
    }
    
    await Notes.migrate()

    const data = await Notes.addNote(markdown)
    
    return new Response(JSON.stringify(data), { status: 200 })
}