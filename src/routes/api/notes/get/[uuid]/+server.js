import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'

export async function GET({ params, request }) {

    const uuid = params.uuid

    if (!uuid) {
        return new Response(JSON.stringify({
                error: "no uuid provided",
            }), { status: 404 })
    }

    if (!uuid.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)) {
        return new Response(JSON.stringify({
                error: "invalid uuid provided",
            }), { status: 404 })
    }

    let sensitive = await Notes.getNoteByUUID(uuid)

    if (sensitive === null) {
        return new Response(JSON.stringify({
                error: "no resource",
            }), { status: 404 })
    }
    
    if (sensitive.public_url) {
        delete sensitive.id
        delete sensitive.public_url
        delete sensitive.public_pane
        
        return new Response(JSON.stringify(sensitive), { status: 200 })
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
    
    return new Response(JSON.stringify(sensitive), { status: 200 })
}