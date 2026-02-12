import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'
import { consume } from "$lib/server/ratelimit"

export async function DELETE({ request, getClientAddress }) {
    const ip = request.headers.get("x-forwarded-for") || getClientAddress()
    const success = await consume(ip)

    if (!success) {
        return new Response(JSON.stringify({
                error: "ratelimited",
            }), { status: 400 })
    }

    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")
    
    let { id } = await request.json()

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

    const check = await Notes.getNoteByID(id)
    if (check === null) {
        return new Response(JSON.stringify({
                error: "id invalid",
            }), { status: 400 })
    }

    const data = await Notes.removeNote(id)
    
    return new Response(JSON.stringify(data), { status: 200 })
}