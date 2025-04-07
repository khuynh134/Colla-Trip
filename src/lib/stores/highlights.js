import { writable } from 'svelte/store'; 

export const highlights = writable([]); //Create a writable store to hold the highlights

export async function refreshHighlights() {
    try {
        const response = await fetch(`/api/highlights?cache=${Date.now()}`); //Fetch the highlights from the API
        if (response.ok) {
            const data = await response.json(); //Parse the JSON response
            highlights.set(data); //Update the store with the new data
        }
    } catch (error) {
        console.error('Error fetching highlights:', error); //Log any errors
    }
}