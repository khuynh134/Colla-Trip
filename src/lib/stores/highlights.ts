import { writable } from 'svelte/store'; 

export type Highlight = {
    id: number;
    name: string;
    description?: string;
    votes?: number;
    highlighted?: boolean;
};

export const highlights = writable<Highlight[]>([]); //Create a writable store to hold the highlights

export async function refreshHighlights() {
    try {
        const response = await fetch(`/api/highlights?t=${Date.now()}`); //Fetch the highlights from the API
        if (response.ok) {
            const data = await response.json(); //Parse the JSON response
            highlights.set(data); //Update the store with the new data
        }
    } catch (error) {
        console.error('Error fetching highlights:', error); //Log any errors
    }
}