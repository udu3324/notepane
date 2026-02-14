import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'
import { consume, ratelimit } from "$lib/server/ratelimit"

export async function POST({ request, getClientAddress }) {
    const ip = request.headers.get("x-forwarded-for") || getClientAddress()
    const success = await consume(ip)

    if (!success) {
        return new Response(JSON.stringify({
                error: "ratelimited",
            }), { status: 429 })
    }

    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")
    
    const { markdown, public_url, public_pane } = await request.json()
    

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

    if (typeof public_url !== "boolean" || typeof public_pane !== "boolean") {
        return new Response(JSON.stringify({
                error: "invalid public_url/public_pane provided",
            }), { status: 400 })
    }
    
    await ratelimit.delete(ip)

    const data = await Notes.addNote(markdown, public_url, public_pane)
    
    return new Response(JSON.stringify(data), { status: 200 })
}