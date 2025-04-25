import { writable } from 'svelte/store'; 

export type Highlight = {
    id: number;
    name: string;
    description?: string;
    votes?: number;
    highlighted?: boolean;
};

export const highlights = writable<Highlight[]>([]); //Create a writable store to hold the highlights

// Function to refresh highlights for a specific trip
export async function refreshHighlights(tripId: string) {
    try {
        const response = await fetch(`/api/highlights/${tripId}?t=${Date.now()}`); //Fetch the highlights from the API
        if (response.ok) {
            const data = await response.json(); //Parse the JSON response
            highlights.set(data); //Update the store with the new data
        }
        else {
            console.error(`Failed to fetch highlights for trip ${tripId}:`, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching highlights:', error); //Log any errors
    }
}

// Function to add a new highlight for a specific trip 
export async function addHighlight(tripId: string, activityId: number) {
    try {
        const response = await fetch(`/api/highlights/${tripId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: activityId,
                highlighted: true,
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to add highlight for trip ${tripId}`);
        }

        await refreshHighlights(tripId); // Refresh highlights after adding
    } catch (error) {
        console.error('Error adding highlight:', error);
    }
}

// Function to remove a highlight for a specific trip
export async function removeHighlight(tripId: string, activityId: number) {
    try {
        const response = await fetch(`/api/highlights/${tripId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: activityId })
        });

        if (!response.ok) {
            throw new Error(`Failed to remove highlight for trip ${tripId}`);
        }

        await refreshHighlights(tripId); // Refresh highlights after removing
    } catch (error) {
        console.error('Error removing highlight:', error);
    }
}