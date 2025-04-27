//src/lib/utils/unsplash.ts

export async function fetchUnsplashImage(location: string): Promise<string | null> {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || import.meta.env.UNSPLASH_ACCESS_KEY;
    try{
        if (!accessKey) {
            console.error('Unsplash Access Key not found');
            return null;
        }
    
        const query = location.split(',')[0]; // Search by the first part of the location
        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&orientation=landscape&per_page=1`;
    
        const res = await fetch(url);
        const data = await res.json();
    
        if( data.results && data.results.length > 0) {
            return data.results[0].urls.regular; //Return image 
        }
    
        return null; // Return null if no image found

    } catch (error) {
        console.error('Error fetching Unsplash image:', error);
        return null; // Return null in case of an error
    }
}