<script lang="ts">
    import { Search, Button, Dropdown, DropdownItem, type InputType } from 'flowbite-svelte';
	import { Map, TileLayer, Marker, Popup } from 'sveaflet';
 
    import { 
        Search as SearchIcon,
        ChevronDown,
        ChevronRight,
        ChevronLeft,
        UtensilsCrossed,
        Backpack,
        ArrowDownWideNarrow,
        Drama,
        ShoppingBag,
        Sun, 
        House,
        MoonStar,
        BookOpen,
        Binoculars,
        MoreHorizontal,
        Megaphone,
		AlertTriangle

    }from 'lucide-svelte';

    //List of categories for dropdown 
    const items = [
        { label: 'All Categories', icon: ArrowDownWideNarrow, categoryId: ''},
        { label: 'Travel', icon: Backpack, categoryId: '4d4b7105d754a06379d81259'},
        { label: 'Fast Food', icon: UtensilsCrossed, categoryId: '4bf58dd8d48988d16e941735'},
        { label: 'Arts and Entertainment', icon: Drama, categoryId: '4d4b7104d754a06370d81259'},
        { label: 'Shopping Mall', icon: ShoppingBag, categoryId: '4bf58dd8d48988d1fd941735'},
        { label: 'Park', icon: Sun, categoryId: '4bf58dd8d48988d163941735'},
        { label: 'Museum', icon: House, categoryId: '4bf58dd8d48988d181941735'},
        { label: 'Nightlife Spot', icon: MoonStar, categoryId: '4d4b7105d754a06376d81259'},
        { label: 'History Museum', icon: BookOpen, categoryId: '4bf58dd8d48988d190941735'},
        { label: 'Other', icon: MoreHorizontal, categoryId: ''}
                
        ];  
      // State management for carousel
      let index = 0; 
           
    const trips = [
        { name: 'Trip 1', location: 'Location 1', description: 'Description 1', image: '/images/boatpic.jpeg'},
        {name: 'Trip 2', location: 'Location 2', description: 'Description 2', image: '/images/flower.jpeg'},
        {name: 'Trip 3', location: 'Location 3', description: 'Description 3', image: '/images/mountainandclouds.jpeg'}
    ];
	
    //Define the type for a place
    interface Place {
        name: string;
        geocodes:{
            main: {
                latitude: number;
                longitude: number;
            };
        };
        categories: Array<{
            name:string;
        }>;
        location: {
            address: string; 
            address_extended: string;
            locality: string;
            region: string;
            postcode: string;
        };
       

    }

            //State management for map set default location to 'Los Angeles, CA'
            let lat = 34.0522;
            let lng = -118.2437;
            let places: Place[] = [];
            let location = 'Los Angeles, CA'; //default location
            
            //Foursquare API key 
            const foursquareApiKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

            let selectedCategoryId = '';  //selected category Id
            let searchValue = ' '; 

             
           //Function to call Foursquare API
           const searchFoursquare = async (searchValue: string, location:string, categoryId?: string,) => {
               const url = new URL( 'https://api.foursquare.com/v3/places/search');

                url.searchParams.append('query', searchValue);
                url.searchParams.append('near', location);
                url.searchParams.append('limit', '10');

                //if categoryId is provided 
                if(categoryId){
                    url.searchParams.append('categories', categoryId);
                }

               try{
                      const response = await fetch(url, {
                           method: 'GET',
                           headers:{
                                Authorization: foursquareApiKey,
                                Accept: 'application/json'
                           }
                        });
                      
                        if (!response.ok){
                            throw new Error('Failed to fetch data from Foursquare');
                        }
                    const data = await response.json();
                    return data.results as Place[]; // return the results to 'Place' type
                    
               }catch (error){
                     console.error('Error fetching data from Foursquare: ', error);
                     return []; 
               }
           };

           //Function on geocodeLocation 
        const geocodeLocation = async (location: string) => {
            const url = new URL ('https://nominatim.openstreetmap.org/search');
            url.searchParams.append('q', location);
            url.searchParams.append('format', 'json');

            try{
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Colla-Trip/1.0 (collatrip@gmail.com)',

                    },
                });
                if(!response.ok){
                    throw new Error('Failed to get geocode loacation: ${response.statusText}');
                }

                const data = await response.json();
                if(data && data.length > 0){
                    const { lat, lon } = data[0]; //get the first result
                    return { lat: parseFloat(lat), lng:parseFloat(lon)};
                }else {
                    throw new Error('No results found for the location');
                }
            }catch (error){
                console.error('Error geocoding location: ', error);
                return null;
            }
         };
        

           //handle the form submit 
        const handleSubmit = async (event: Event) => {
                event.preventDefault();

                //Geocode the location
                const coordinates = await geocodeLocation(location);
                if(coordinates){
                    //Update the map center 
                    lat = coordinates.lat;
                    lng = coordinates.lng; 
                }

                //Fetch places from Foursquare
                const results = await searchFoursquare(searchValue, location, selectedCategoryId || undefined);
                places = results;  //update places array with results
           }

           //update the category ID and label when selecting a new category
           const updateCategory = (categoryId: string) => {
                selectedCategoryId = categoryId;
                //handleSubmit(new Event('submit'));
           }
</script>

<div class="min-h-screen bg-gradient-to-tr from-sky-200 via-cyan-400 to-sky-500 bg-opacity-75">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 class="text-3xl pt-3 pb-4 font-bold text-slate-50">Explore Page</h1>

        <!-- Search Bar -->
        <form class="flex" on:submit|preventDefault={handleSubmit}>
            <div class="relative">
                <Button class="rounded-xl whitespace-nowrap border border-sky-400 bg-sky-400 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all 
                hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                    {selectedCategoryId || 'All Categories'}
                    <ChevronDown class="w-2.5 h-2.5 ms-2.5" />
                </Button>
               
             

        <!-- Dropdown Menue for Category -->
                <Dropdown style="position: absolute; top: 60px; z-index: 1000; max-height: 200px; overflow-y: auto; width:auto;">
                    {#each items as { label, icon, categoryId }}
                
                   <DropdownItem on:click={() => {
                        updateCategory(categoryId)

                    }}
                        
                    class={selectedCategoryId === categoryId? 'underline' : ''}> 
                  
                        <div class="flex items-center">
                            {#if icon}
                                <svelte:component this={icon} class="w-4 h-4 mr-1.5" />
                            {/if}
                            
                            {label}
                        </div>
                    </DropdownItem>
                        {/each}
                    </Dropdown>
            </div>
            <Search size="md" class="rounded-lg py-2.5 text-sky-500" bind:value={searchValue} placeholder="Search places...(Ex:coffee)" />
            <Search size="md" class="rounded-lg py-2.5 text-sky-500" bind:value={location} placeholder="Enter location..." />
            <Button on:click={handleSubmit} class="!p-2.5 rounded-s-none text-sky-300 bg-sky-400 hover:bg-sky-500 focus:ring focus:ring-primary-200">
                <SearchIcon class="w-6 h-6" />
            </Button>
        </form>

    <h3 class="text-xl font-bold mt-5 text-slate-50 text-center"> Suggested Trips</h3>
                    
        <!-- Carousel -->
    <div class="relative w-full max-w-2xl mx-auto p-4">
        <!-- Trip Details as Cards -->
         {#each trips as trip, i}
            {#if i === index }
                <div class="p-6 bg-white rounded-lg shadow-lg flex items-start" style="width: 645px; height: 300px;">
                    <!-- Image -->
                    <img src={trip.image} alt={trip.name} class="w-1/3 h-1/3 object-cover rounded-md">
                    <div class="flex flex-col ms-4">
                        <h3 class="text-xl font-bold mt-2"> Trips's name: {trip.name}</h3>
                        <p class="text-gray-600">Trip's destination: {trip.location}</p>
                        <p class="text-gray-600">Trip's description: {trip.description}</p>

                    </div>
                </div>
            {/if}
        {/each}

        <!-- Custom Navigation Controls -->
         <div class="flex justify-between items-center absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <Button class="bg-indigo-300 p-2 rounded-full shadow-md hover:bg-indigo-400"
                on:click={() => index = (index - 1 + trips.length) % trips.length}
            >
                <ChevronLeft class="w-4 h-4" />
            </Button>

            <Button class="bg-indigo-300 p-2 rounded-full shadow-md hover:bg-indigo-400"
                on:click={() => index = (index + 1) % trips.length}
            >
                <ChevronRight class="w-4 h-4" />
            </Button>
            
        </div>
    </div>

    <!-- Map Implementation -->
     <div class="flex justify-items-start mt-10 grid grid-cols-2 gap-2">
        <div style="width:90%; height:300px; position: relative; z-index: 1;">
            <Map 
                options={{ center: [lat, lng], zoom: 13}}> 
                <TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
                {#each places as place}
                    <Marker latLng={[place.geocodes.main.latitude, place.geocodes.main.longitude]}>
                        <Popup>
                            <h3>{place.name}</h3>
                            <p>{place.location.address || 'Address not available'}</p>
                        </Popup>
                    </Marker>
                {/each}
    
            </Map>
         </div>

         <!-- Information Display for Users -->
          <div class="relative w-full max-w-2xl mx-auto p-2 bg-white rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-3"> Search Details</h3>
            <div class="flex items-center">
                <Megaphone class="w-6 h-6 text-red-500" />
                <p class="text-red-500 ms-2">Please note that the map will display 10 results</p>
            </div>
            {#if places.length > 0}
                <ul>
                    {#each places as place}
                        <li class="mb-2">
                            <h3 class="text-lg font-bold">Name: {place.name}</h3>
                            <p class="text-gray-600">Categories: {place.categories[0]?.name || 'Unknown'}</p>
                            <p class="text-gray-600">
                                Address: {place.location.address || 'No street info'},
                                {place.location.locality || 'No city info'},
                                {place.location.region || 'No region'},
                                {place.location.postcode || 'No ZIP'}
                            </p>
                            
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="text-gray-600">No places found. Try a different search</p>
            {/if}
          </div>

     </div>

      
    </div>
</div>