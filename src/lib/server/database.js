import postgres from 'postgres'; //Import the postgres library 
import { PGCONNECT } from '$env/static/private'; //Import the PGCONNNECT environment variable 

const sql = postgres(PGCONNECT, {}); //Create a new connection to the database using the PGCONNECT environment variable 

export default sql; //Export the connection to the database 
