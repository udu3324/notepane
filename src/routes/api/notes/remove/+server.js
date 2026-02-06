import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'

export async function GET({ request }) {
    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")
    
    const id = request.headers.get("id")

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

    if (!id) {
        return new Response(JSON.stringify({
                error: "no id provided",
            }), { status: 400 })
    }
    //todo check if id exists
    
    await Notes.migrate()

    const data = await Notes.removeNote(id)
    
    return new Response(JSON.stringify(data), { status: 200 })
}