import postgres from 'postgres'; //Import the postgres library 
import { env } from '$env/dynamic/private'; //Import the PGCONNNECT environment variable 

function getConnectionString() {
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
        if( !env.PGCONNECT) {
            throw new Error('Missing PGCONNECT in .env for local development');
        }
        return env.PGCONNECT; //Return the local connection string
    }
    //production (Neon)
    if (!env.PGCONNECT_NEON) {
        throw new Error('Missing PGCONNECT_NEON in .env for production');
    };
    return env.PGCONNECT_NEON; //Return the production connection string
}

const sql = postgres(getConnectionString(), {
    max: 5,
    ...(process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false }} : {})
}); 


export default sql; //Export the connection to the database 
