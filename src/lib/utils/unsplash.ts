export async function fetchUnsplashImage(location: string): Promise<string | null> {
    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (!accessKey) {
        console.error('Unsplash Access Key not found');
        return null;
      }
  
      const query = location.split(',')[0];
      const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&orientation=landscape&per_page=1`;
  
      const res = await fetch(url);
      if (!res.ok) {
        console.error('Unsplash API error:', res.status);
        return null;
      }
  
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
  
      return null;
    } catch (error) {
      console.error('Error fetching Unsplash image:', error);
      return null;
    }
  }