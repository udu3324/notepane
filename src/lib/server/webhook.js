import { WEBHOOK } from "$env/static/private"

export async function sendWebhook(ip, message) {
    if (WEBHOOK === undefined) return
    if (!WEBHOOK.includes("https://")) return

    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const result = await response.json();

    fetch(WEBHOOK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: `${result.query} | ${result.countryCode}, ${result.region} (${result.isp}) \n\`${message}\``
        })
    });
}