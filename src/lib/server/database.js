import postgres from 'postgres'; //Import the postgres library 
import { env } from '$env/dynamic/private'; //Import the PGCONNNECT environment variable 

const sql = postgres(env.PGCONNECT); //Create a new connection to the database using the PGCONNECT environment variable 

export default sql; //Export the connection to the database 
