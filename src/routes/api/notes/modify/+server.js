import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'
import { consume } from "$lib/server/ratelimit"

export async function POST({ request, getClientAddress }) {
    const ip = request.headers.get("x-forwarded-for") || getClientAddress()
    const success = await consume(ip)

    if (!success) {
        return new Response(JSON.stringify({
                error: "ratelimited",
            }), { status: 400 })
    }
    
    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")

    let { id, markdown, public_url, public_pane, pinned } = await request.json()

    //convert to bool (if present)
    if (typeof public_url === "string") {
        public_url = (public_url === 'true')
    }
    if (typeof public_pane === "string") {
        public_pane = (public_pane === 'true')
    }
    if (typeof pinned === "string") {
        pinned = (pinned === 'true')
    }

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

    if (markdown === undefined && public_url === undefined && public_pane === undefined && pinned === undefined) {
        return new Response(JSON.stringify({
                error: "need to provide atleast markdown, public url, public pane, or pinned",
            }), { status: 400 })
    }
    

    const data = await Notes.modifyNote(id, markdown, public_url, public_pane, pinned)
    
    return new Response(JSON.stringify(data), { status: 200 })
}