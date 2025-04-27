import postgres from 'postgres';
import { env } from '$env/dynamic/private';


function getConnectionString() {
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
        if (!env.PGCONNECT) {
            throw new Error('Missing PGCONNECT in .env for local development');
        }
        return env.PGCONNECT;
    }

    // Production (e.g. Neon)
    if (!env.PGCONNECT_NEON) {
        throw new Error('Missing PGCONNECT_NEON in .env for production');
    }
    return env.PGCONNECT_NEON;
}

const sql = postgres(getConnectionString(), {
    max: 5,
    ...(process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {})
});

console.log('Connecting to DB with:', getConnectionString());

export default sql;