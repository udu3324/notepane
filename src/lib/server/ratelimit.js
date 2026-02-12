import { RateLimiterMemory } from "rate-limiter-flexible"

export const ratelimit = new RateLimiterMemory({
    points: 10, // # of requests
    duration: 20 // seconds interval
})

export async function consume(ip) {
    try {
        await ratelimit.consume(ip)

        return true
    } catch {
        return false
    }
}