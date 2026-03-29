import { PASSWORD } from "$env/static/private"
import * as Notes from '$lib/server/notes'
import { consume, ratelimit } from "$lib/server/ratelimit"
import { sendWebhook } from "$lib/server/webhook"

export async function GET({ request, getClientAddress }) {
    const ip = request.headers.get("x-forwarded-for") || getClientAddress()
    const success = await consume(ip)
    
    if (!success) {
        return new Response(JSON.stringify({
                error: "ratelimited",
            }), { status: 429 })
    }

    const auth_header = request.headers.get("Authorization")
    const key = auth_header?.replace("Bearer ", "").trim().replace("Bearer", "")
    
    if (!key) {
        //sendWebhook(`\`${ip}\` - /notes/get - no key provided`)
        return new Response(JSON.stringify({
                error: "no key provided",
            }), { status: 400 })
    }

    if (key !== PASSWORD) {
        sendWebhook(`\`${ip}\` - /notes/get - invalid key`)
        return new Response(JSON.stringify({
                error: "invalid key",
            }), { status: 400 })
    }
    
    await ratelimit.delete(ip)

    const data = await Notes.getNotes()
    
    return new Response(JSON.stringify(data), { status: 200 })
}