import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; //Import the PostgreSQL client  

//POST: create new packing list item
export async function POST({ request }) {
    try {
        const { name, quantity, created_by, trip_id, checked = false } = await request.json(); 

        // Validation
        if (!name?.trim() || !created_by?.trim() || !trip_id) {
            return json(
                { error: 'Item name, creator name, and trip ID are required' },
                { status: 400 }
            );
        }

            // Sanitization
            const cleanName = name.trim().slice(0, 100);
            const cleanCreator = created_by.trim().slice(0, 50);
            const cleanQuantity = Math.min(Math.max(Number.isNaN(Number(quantity)) ? 1 : Number(quantity), 1), 100);

        const [newItem] = await sql`
            INSERT INTO packing_list(
                item_name,
                item_quantity, 
                created_by_name,
                trip_id,
                checked
            ) VALUES (
                ${cleanName},
                ${cleanQuantity},
                ${cleanCreator},
                ${trip_id},
                ${checked}
            ) 
            RETURNING 
                packing_list_id AS id,
                item_name AS name, 
                item_quantity AS quantity, 
                created_by_name AS created_by,
                trip_id,
                checked
            `;
            return json(newItem);
    } catch (error) {
        console.error('Error creating packing list item:', error);
        return json({
            error: 'Failed to create packing list item',
            status: 500,
        });
    }
}

//GET: Fetch packing list items
export async function GET() {
    try {
        const trip_id = URL.searchParams.get('trip_id');
        if(!trip_id) {
            return json(
                {error: 'Trip ID is required to fetch packing list items'},
                {status: 400}
            );
        }
        const items = await sql`
            SELECT
                packing_list_id AS id,
                item_name AS name, 
                item_quantity AS quantity, 
                created_by_name AS created_by,
                checked,
                created_at
            FROM packing_list 
            WHERE trip_id = ${trip_id}
            ORDER BY created_at DESC
        `
    return json(items);
    } catch (err) {
        console.error('Error fetching packing list items:', err);
        return json({
            error: 'Failed to fetch packing list items',
            status: 500,
        });
    }; 

}// DELETE item
export async function DELETE({ request}) {
    try {
        const { id, trip_id } = await request.json(); 

        if (!id || isNaN(id) || !trip_id){
            return json ({error: 'Invalid item ID or trip ID' }, {status: 400});
        }

        const [deleted] = await sql`
            DELETE FROM packing_list
            WHERE packing_list_id = ${id} AND trip_id = ${trip_id}
            RETURNING packing_list_id AS id
        `;

        if (!deleted) {
            return json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        return json({ success: true });

    } catch (err) {
        console.error('DELETE Error:', err);
        return json(
            { error: 'Failed to delete item' },
            { status: 500 }
        );
    }
}

import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; // Import the PostgreSQL client

// GET: Fetch packing list items for a specific trip
export async function GET({ url }) {
    try {
        // Extract trip_id from the query parameters
        const trip_id = url.searchParams.get('trip_id');

        if (!trip_id) {
            return json(
                { error: 'Trip ID is required to fetch packing list items' },
                { status: 400 }
            );
        }

        // Query the database for packing list items associated with the trip_id
        const items = await sql`
            SELECT
                packing_list_id AS id,
                item_name AS name,
                item_quantity AS quantity,
                created_by_name AS created_by,
                checked,
                created_at
            FROM packing_list
            WHERE trip_id = ${trip_id}
            ORDER BY created_at DESC
        `;

        return json(items);
    } catch (err) {
        console.error('Error fetching packing list items:', err);
        return json(
            { error: 'Failed to fetch packing list items' },
            { status: 500 }
        );
    }
}
export async function PATCH({ request }) {
    try {
        const { id, checked } = await request.json();

        if (!id || typeof checked !== 'boolean') {
            return json(
                { error: 'Invalid item ID or checked state' },
                { status: 400 }
            );
        }

        const [updatedItem] = await sql`
            UPDATE packing_list
            SET checked = ${checked}
            WHERE packing_list_id = ${id}
            RETURNING 
                packing_list_id AS id,
                item_name AS name,
                item_quantity AS quantity,
                created_by_name AS created_by,
                trip_id,
                checked
        `;
        if (!updatedItem) {
            return json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        return json(updatedItem);
    } catch (err) {
        console.error('Error updating packing list item:', err);
        return json(
            { error: 'Failed to update packing list item' },
            { status: 500 }
        );
    }
}
