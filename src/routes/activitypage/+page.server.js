import sql from '$lib/server/database.js';

//load function: fetch activities from the database 
export async function load() {
    try {
        const activities = await sql `SELECT * FROM activities ORDER BY id`;
        return {
            activities,
        };
    } catch (err) {
        console.error('Error fetching activities: ', err);
        return {
            activities: [],
            error: 'Failed to fetch activities',
        };
    }
}

//Form actions: Handle creating, deleting, and voting
export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData(); //parse form data 
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString(); 

        if( !name || !description) {
            return {
                status: 400, 
                error: 'Name and description are required',
            };
        }

        try {
            const [activity] = await sql `
                INSERT INTO activities (name, description, votes)
                VALUES (${name}, ${description}, 0)
                RETURNING * 
                `;
            return {
                success: true,
                activity, 

            };
        }catch (err) {
            console.error('Error creating activity:', err);
            return {
                error: 'Failed to create activity',
            }
        };
    },
    delete: async ({ request }) => {
        const formData = await request.formData(); 
        const id = formData.get('id')?.toString();

        if (!id) {
            return {
                status: 400,
                error: 'ID is required',
            };
        }

        try {
            await sql `
                DELETE FROM activities WHERE id = ${id}
            `;
            return {
                success: true,
            };
        } catch (err) {
            console.error('Error deleting activity:', err);
            return {
                error: 'Failed to delete activity',
            };
        }
    },

    vote: async ({ request }) => {
        const formData = await request.formData(); 
        const id = formData.get('id')?.toString(); 

        if (!id) {
            return {
                status: 400,
                error: 'ID is required',
            };
        }

        try {
            const [activity] = await sql`
                UPDATE activities 
                SET votes = votes + 1
                WHERE id = ${id}
                RETURNING *
            `;
            return {
                success: true,
                activity,
            };
        } catch (err) {
            console.error('Error voting for activity:', err);
            return {
                error: 'Failed to vote for activity',
            };
        }
    },

};