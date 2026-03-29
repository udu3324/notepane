import { WEBHOOK } from "$env/static/private"

export function sendWebhook(string) {
    if (WEBHOOK === undefined) return
    if (!WEBHOOK.includes("https://")) return

    fetch(WEBHOOK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: string
        })
    });
}