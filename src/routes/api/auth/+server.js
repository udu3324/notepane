import { PASSWORD } from "$env/static/private"
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
        sendWebhook(`\`${ip}\` - /api/auth - no key provided`)
        return new Response(JSON.stringify({
                error: "no key provided",
            }), { status: 400 })
    }

    if (key !== PASSWORD) {
        sendWebhook(`\`${ip}\` - /api/auth - invalid key`)
        return new Response(JSON.stringify({
                error: `invalid key`,
            }), { status: 400 })
    }

    await ratelimit.delete(ip)

    sendWebhook(`\`${ip}\` - /api/auth - authenticated`)
    return new Response(JSON.stringify({
            status: "authenticated",
        }), { status: 200 })
}