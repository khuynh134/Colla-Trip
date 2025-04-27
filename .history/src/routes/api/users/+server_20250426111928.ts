import sql from '$lib/server/database.js'; //import database connection 

import type { RequestHandler } from '@sveltejs/kit'; 

export const POST: RequestHandler = async ({ request }) => {
   
    try{
         // Query to retrieve the current database name
         const [dbInfo] = await sql`SELECT current_database() AS dbname`;
         console.log('Connected to database:', dbInfo.dbname);

        const { firebase_uid, email, username, profile, roles } = await request.json();

           // Log the values to check for undefined
           console.log('firebase_uid:', firebase_uid);
           console.log('email:', email);
           console.log('username:', username);
           console.log('profile:', profile);
           console.log('roles:', roles);
   
           // Validate that all required fields are defined
           if (!firebase_uid || !email || !username || !profile || !roles) {
               throw new Error('Missing required fields');
           }
   


        //save user to Postgres database
        const [user] = await sql` 
            INSERT INTO users (firebase_uid, email, username, profile, roles)
            VALUES (${firebase_uid}, ${email}, ${username}, ${profile}, ${roles})
            ON CONFLICT (firebase_uid) DO UPDATE 
            SET email = EXCLUDED.email, 
            username = EXCLUDED.username,
            profile = EXCLUDED.profile,
            roles = EXCLUDED.roles,
            updated_at = NOW() 
            RETURNING *;
        `;

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('Database Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to save user', details: error.message }), {
            status: 500,
        });
        
    }

   
}; 