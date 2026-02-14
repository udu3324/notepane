import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'
import { consume, ratelimit } from "$lib/server/ratelimit"

export async function GET({ params, request, getClientAddress }) {
    const ip = request.headers.get("x-forwarded-for") || getClientAddress()
    const success = await consume(ip)
    
    if (!success) {
        return new Response(JSON.stringify({
                error: "ratelimited",
            }), { status: 429 })
    }

    const uuid = params.uuid

    if (!uuid) {
        return new Response(JSON.stringify({
                error: "no uuid provided",
            }), { status: 400 })
    }

    if (!uuid.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)) {
        return new Response(JSON.stringify({
                error: "invalid uuid provided",
            }), { status: 400 })
    }

    let sensitive = await Notes.getNoteByUUID(uuid)

    if (sensitive === null) {
        return new Response(JSON.stringify({
                error: "no resource",
            }), { status: 404 })
    }
    
    if (sensitive.public_url) {
        return new Response(JSON.stringify({
            created_at: sensitive.created_at,
            modified_at: sensitive.modified_at,
            markdown: sensitive.markdown
        }), { status: 200 })
    }

    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")
    
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

    await ratelimit.delete(ip)
    
    return new Response(JSON.stringify(sensitive), { status: 200 })
}