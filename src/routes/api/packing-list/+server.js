import { json } from '@sveltejs/kit';
import sql from '$lib/server/database.js'; //Import the PostgreSQL client  

//POST: create new packing list item
export async function POST({ request }) {
    try {
        const { name, quantity, created_by } = await request.json(); 

        // Validation
        if (!name?.trim() || !created_by?.trim()) {
            return json(
                { error: 'Item name and creator name are required' },
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
                created_by_name
            ) VALUES (
                ${cleanName},
                ${cleanQuantity},
                ${cleanCreator}
            ) 
            RETURNING 
                packing_list_id AS id,
                item_name AS name, 
                item_quantity AS quantity, 
                created_by_name AS created_by
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
        const items = await sql`
            SELECT
                packing_list_id AS id,
                item_name AS name, 
                item_quantity AS quantity, 
                created_by_name AS created_by,
                created_at
            FROM packing_list 
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
        const { id } = await request.json(); //parse JSON body

        if (!id || isNaN(id)){
            return json ({error: 'Invalid item ID' }, {status: 400});
        }

        const [deleted] = await sql`
            DELETE FROM packing_list
            WHERE packing_list_id = ${id}
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

