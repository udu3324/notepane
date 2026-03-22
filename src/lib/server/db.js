import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOSTNAME, POSTGRES_DB } from '$env/static/private'
import postgres from 'postgres'

const sql = postgres(`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:5432/${POSTGRES_DB}`, {
    ssl: process.env.NODE_ENV === 'production' && process.env.POSTGRES_SSL === 'true'
})

export default sql