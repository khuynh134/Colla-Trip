export async function load({fetch}){
    const res = await fetch('/api/voting-results');
    const results = await res.json(); 
    return { results }; 
}