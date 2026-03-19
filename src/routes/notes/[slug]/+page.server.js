import { error } from "@sveltejs/kit"

export async function load({ params, fetch }) {
    try {
        const res = await fetch(`/api/notes/get/${params.slug}`)
        const json = await res.json()
        
        return {
            note: json
        }

    } catch (err) {
        throw error(404, err)
    }
}
