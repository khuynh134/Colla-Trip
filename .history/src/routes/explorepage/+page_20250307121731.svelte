<script lang="ts">
    import { Search, Button, Dropdown, DropdownItem, type InputType } from 'flowbite-svelte';
    import { Map, TileLayer, Marker, Popup } from 'sveaflet';
    import { goto } from '$app/navigation'; // Import for navigation
 
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
        AlertTriangle,
        UserPlus, // Added for registration icon
        MapPin

    } from 'lucide-svelte';

    // Mock authentication state - replace with your actual auth check
    let isAuthenticated = false; // Set to false to test the registration button

    // Function to handle registration
    function handleRegister() {
        // Redirect to registration page
        // Replace '/register' with your actual registration route
        goto('/register');
    }

    // Function to handle demo mode for unregistered users
    function enableDemoMode() {
        // Hide registration banner and allow limited exploration
        showRegistrationBanner = false;
    }

    // State for registration banner
    let showRegistrationBanner = !isAuthenticated;

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
        { name: 'Summer in Tokyo', location: 'Tokyo, Japan', description: 'Experience the vibrant culture, stunning cherry blossoms, and amazing cuisine that Tokyo has to offer.', image: '/images/boatpic.jpeg'},
        { name: 'Coastal Adventure', location: 'Amalfi Coast, Italy', description: 'Explore the breathtaking cliffside villages, crystal-clear waters, and renowned Italian hospitality.', image: '/images/flower.jpeg'},
        { name: 'Mountain Retreat', location: 'Swiss Alps, Switzerland', description: 'Immerse yourself in the majestic alpine scenery with hiking, skiing, and authentic mountain experiences.', image: '/images/mountainandclouds.jpeg'}
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
    let selectedCategory = 'All Categories'; // For displaying the selected category name

             
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
                    
        } catch (error){
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

        // If user is not authenticated, prompt to register
        if (!isAuthenticated && showRegistrationBanner) {
            // You could either show a modal here or just let the banner handle it
            return;
        }

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
    const updateCategory = (categoryId: string, label: string) => {
        selectedCategoryId = categoryId;
        selectedCategory = label;
    }
    
    // For handling loading state
    let isLoading = false;
    
    // Function to execute search with loading state
    const executeSearch = async () => {
        isLoading = true;
        await handleSubmit(new Event('submit'));
        isLoading = false;
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-200 to-blue-300">
    
   <!-- Registration Banner for Unregistered Users -->
{#if showRegistrationBanner}
<!-- Full-width banner that sits below the navbar -->
<div class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 w-full relative z-40 shadow-md">
    <div class="flex flex-col sm:flex-row justify-between items-center px-2 sm:px-4">
        <div class="flex items-center mb-3 sm:mb-0">
            <UserPlus class="w-5 h-5 mr-2" />
            <p class="font-medium">Create an account to save your trips, plan itineraries, and collaborate with friends!</p>
        </div>
        <div class="flex space-x-3">
            <button 
                class="px-4 py-1.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm"
                on:click={handleRegister}
            >
                Register to Start
            </button>
            <button 
                class="px-4 py-1.5 border border-white/50 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                on:click={enableDemoMode}
            >
                Continue as Guest
            </button>
        </div>
    </div>
</div>
{/if}
    <!-- Page content wrapper -->
<div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-200 to-blue-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Explore</span> Your Next Adventure
            </h1>
            
            <div class="bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50 shadow-sm">
                <p class="text-gray-700 font-medium">Currently exploring: <span class="font-bold text-blue-700">{location}</span></p>
            </div>
        </div>
    </div>
</div>


        <!-- Search Bar with Glassmorphism -->
        <div class="bg-white/30 p-6 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg mb-10">
            <form class="flex flex-col sm:flex-row gap-3" on:submit|preventDefault={executeSearch}>
                <div class="relative">
                    <Button class="w-full sm:w-auto rounded-xl whitespace-nowrap border-0 bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-cyan-600 focus:ring focus:ring-blue-300">
                        <div class="flex items-center">
                            {#if selectedCategoryId}
                                {#each items as item}
                                    {#if item.categoryId === selectedCategoryId}
                                        <svelte:component this={item.icon} class="w-4 h-4 mr-1.5" />
                                    {/if}
                                {/each}
                            {:else}
                                <ArrowDownWideNarrow class="w-4 h-4 mr-1.5" />
                            {/if}
                            {selectedCategory}
                            <ChevronDown class="w-3 h-3 ml-2" />
                        </div>
                    </Button>
               
                    <!-- Dropdown Menu for Category -->
                    <Dropdown style="position: absolute; top: 60px; z-index: 1000; max-height: 300px; overflow-y: auto; width: auto; border-radius: 0.5rem; background-color: white; border: 1px solid rgba(209, 213, 219, 0.5); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                        {#each items as { label, icon, categoryId }}
                            <DropdownItem on:click={() => updateCategory(categoryId, label)}
                                class="hover:bg-blue-50 {selectedCategoryId === categoryId ? 'bg-blue-100 font-medium' : ''}"
                            > 
                                <div class="flex items-center py-1">
                                    {#if icon}
                                        <svelte:component this={icon} class="w-4 h-4 mr-2 {selectedCategoryId === categoryId ? 'text-blue-600' : 'text-gray-600'}" />
                                    {/if}
                                    <span class="{selectedCategoryId === categoryId ? 'text-blue-700' : 'text-gray-700'}">{label}</span>
                                </div>
                            </DropdownItem>
                        {/each}
                    </Dropdown>
                </div>
                
                <div class="flex-1 flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <!-- Changed to use Search icon for search field -->
                        <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size="18" />
                        <Search size="md" class="w-full pl-10 rounded-xl border-0 shadow-md py-2.5 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-300" bind:value={searchValue} placeholder="Search places... (Ex: coffee)" />
                    </div>
                    
                    <div class="relative flex-1">
                        <!-- Changed to use MapPin icon for location field -->
                        <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size="18" />
                        <Search size="md" class="w-full pl-10 rounded-xl border-0 shadow-md py-2.5 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-300" bind:value={location} placeholder="Enter location..." />
                    </div>
                    
                    <Button on:click={executeSearch} class="w-full sm:w-auto !p-2.5 rounded-xl border-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md transition-all">
                        {#if isLoading}
                            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching...
                        {:else}
                            <SearchIcon class="w-6 h-6" />
                            <span class="ml-2 hidden sm:inline">Search</span>
                        {/if}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</div>

        <!-- Suggested Trips Section -->
        <div class="mb-12">
            <h3 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Binoculars class="w-6 h-6 mr-2 text-blue-600" />
                Suggested Trips
            </h3>
                    
            <!-- Carousel with Glass Effect -->
            <div class="relative w-full max-w-4xl mx-auto">
                <!-- Trip Details as Cards -->
                <div class="overflow-hidden rounded-2xl">
                    {#each trips as trip, i}
                        {#if i === index}
                            <div class="bg-white/40 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
                                <div class="flex flex-col md:flex-row">
                                    <!-- Image -->
                                    <div class="md:w-2/5 overflow-hidden">
                                        <img src={trip.image} alt={trip.name} class="w-full h-64 md:h-full object-cover transition-transform duration-700 hover:scale-110">
                                    </div>
                                    
                                    <!-- Content -->
                                    <div class="p-6 md:w-3/5 flex flex-col justify-between">
                                        <div>
                                            <div class="flex items-center mb-2">
                                                <MapPin class="w-5 h-5 text-blue-600 mr-2" />
                                                <h4 class="text-sm font-medium text-blue-600">{trip.location}</h4>
                                            </div>
                                            <h3 class="text-2xl font-bold text-gray-800 mb-3">{trip.name}</h3>
                                            <p class="text-gray-600 mb-6 leading-relaxed">{trip.description}</p>
                                        </div>
                                        
                                        <div class="flex justify-end">
                                            <!-- Conditional button based on authentication status -->
                                            {#if isAuthenticated}
                                                <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all">
                                                    View Details
                                                </button>
                                            {:else}
                                                <button 
                                                    class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-600 transition-all flex items-center gap-2"
                                                    on:click={handleRegister}
                                                >
                                                    <UserPlus class="w-4 h-4" />
                                                    Register to View
                                                </button>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>

                <!-- Custom Navigation Controls -->
                <div class="flex justify-between items-center absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4">
                    <Button class="bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-all border-0"
                        on:click={() => index = (index - 1 + trips.length) % trips.length}
                    >
                        <ChevronLeft class="w-5 h-5 text-gray-800" />
                    </Button>

                    <Button class="bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-all border-0"
                        on:click={() => index = (index + 1) % trips.length}
                    >
                        <ChevronRight class="w-5 h-5 text-gray-800" />
                    </Button>
                </div>
                
                <!-- Indicator Dots -->
                <div class="flex justify-center mt-4 gap-2">
                    {#each trips as _, i}
                        <button 
                            class="w-3 h-3 rounded-full transition-all {i === index ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}"
                            on:click={() => index = i}
                        ></button>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Map and Results Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <!-- Map Implementation with Glass Effect -->
            <div class="bg-white/30 p-4 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg overflow-hidden">
                <h3 class="text-xl font-bold mb-4 text-gray-800">Interactive Map</h3>
                <div style="height:400px; position: relative; z-index: 1; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <Map options={{ center: [lat, lng], zoom: 13 }}> 
                        <TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
                        {#each places as place}
                            <Marker latLng={[place.geocodes.main.latitude, place.geocodes.main.longitude]}>
                                <Popup>
                                    <div class="p-2">
                                        <h3 class="font-bold text-blue-700">{place.name}</h3>
                                        <p class="text-gray-700">{place.location.address || 'Address not available'}</p>
                                        <p class="text-gray-500 text-sm mt-1">{place.categories[0]?.name || 'Category not available'}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        {/each}
                    </Map>
                </div>
                
                <!-- Map registration overlay for guests -->
                {#if !isAuthenticated && places.length > 0 && !showRegistrationBanner}
                    <div class="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div class="flex items-start">
                            <UserPlus class="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <p class="text-indigo-800 font-medium mb-2">Want to save these locations?</p>
                                <p class="text-indigo-600 text-sm mb-3">Register an account to save your favorite places and create custom itineraries.</p>
                                <button 
                                    class="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                    on:click={handleRegister}
                                >
                                    Create an Account
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Results Display with Glass Effect -->
            <div class="bg-white/30 p-4 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Search Results</h3>
                    {#if places.length > 0}
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {places.length} places found
                        </span>
                    {/if}
                </div>
                
                {#if isLoading}
                    <div class="flex justify-center items-center h-64">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                {:else if places.length > 0}
                    <div class="overflow-y-auto max-h-[380px] pr-2">
                        {#each places as place, i}
                            <div class="mb-4 bg-white/70 p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div class="flex justify-between">
                                    <h3 class="text-lg font-bold text-gray-800">{place.name}</h3>
                                    <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        #{i+1}
                                    </span>
                                </div>
                                
                                <div class="flex items-center mt-1 text-gray-500 text-sm">
                                    <div class="flex items-center">
                                        {#if place.categories[0]?.name}
                                            {#each items as item}
                                                {#if item.label.toLowerCase().includes(place.categories[0]?.name.toLowerCase())}
                                                    <svelte:component this={item.icon} class="w-4 h-4 mr-1 text-blue-600" />
                                                {:else if i === items.length - 1}
                                                    <MoreHorizontal class="w-4 h-4 mr-1 text-blue-600" />
                                                {/if}
                                            {/each}
                                            <span class="text-gray-600 font-medium">{place.categories[0]?.name}</span>
                                        {:else}
                                            <MoreHorizontal class="w-4 h-4 mr-1 text-blue-600" />
                                            <span>Unknown Category</span>
                                        {/if}
                                    </div>
                                </div>
                                
                                <div class="mt-2 flex items-start">
                                    <MapPin class="w-4 h-4 mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <p class="text-gray-600 text-sm">
                                        {place.location.address || 'No street info'}
                                        {#if place.location.locality || place.location.region}
                                            <span>, {place.location.locality || ''} {place.location.region || ''} {place.location.postcode || ''}</span>
                                        {/if}
                                    </p>
                                </div>
                                
                                <!-- Save button for authenticated users or register prompt for guests -->
                                <div class="mt-3 flex justify-end">
                                    {#if isAuthenticated}
                                        <button class="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                            Save to Favorites
                                        </button>
                                    {:else}
                                        <button 
                                            class="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center"
                                            on:click={handleRegister}
                                        >
                                            <UserPlus class="h-4 w-4 mr-1" />
                                            Register to Save
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="bg-white/70 rounded-lg p-6 text-center">
                        <AlertTriangle class="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p class="text-gray-600 mb-2">No places found with your current search criteria.</p>
                        <p class="text-gray-500 text-sm">Try adjusting your search terms or exploring a different location.</p>
                    </div>
                {/if}
                
                {#if places.length > 0}
                    <div class="mt-4 bg-blue-50 p-3 rounded-lg flex items-center">
                        <Megaphone class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                        <p class="text-sm text-blue-700">Showing up to 10 results from your search. Refine your search for more specific places.</p>
                    </div>
                {/if}
            </div>
        </div>
        
        <!-- Footer Registration CTA -->
        {#if !isAuthenticated && !showRegistrationBanner}
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-xl p-8 text-white text-center mb-10">
                <h3 class="text-2xl font-bold mb-3">Ready to plan your next adventure?</h3>
                <p class="text-indigo-100 max-w-2xl mx-auto mb-6">Create an account to unlock the full potential of our travel planning tools, save your favorite destinations, and collaborate with friends.</p>
                <button 
                    class="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-md"
                    on:click={handleRegister}
                >
                    Register Now
                </button>
            </div>
        {/if}
    </div>
</div>