<script lang="ts">
    import { Search, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { Carousel } from 'flowbite-svelte';
    
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
        MoreHorizontal
    }from 'lucide-svelte';

    const items = [
                { label: 'All Categories', icon: ArrowDownWideNarrow},
                { label: 'Travel', icon: Backpack},
                { label: 'Food', icon: UtensilsCrossed},
                { label: 'Entertainment', icon: Drama},
                { label: 'Shopping', icon: ShoppingBag},
                {label: 'Outdoor Activities', icon: Sun},
                {label: 'Indoor Activities', icon: House},
                {label: 'Nightlife', icon: MoonStar},
                {label: 'Culture', icon: BookOpen},
                {label: 'Nature', icon: Binoculars },
                {label: 'Other', icon: MoreHorizontal}
            ] 

            // State management for search bar 
            let selectCategory = items[0].label;
            let searchValue = ' '; 

            // State management for carousel
            let index = 0; 
           
            const trips = [
                { name: 'Trip 1', location: 'Location 1', description: 'Description 1', image: '/images/boatpic.jpeg'},
                {name: 'Trip 2', location: 'Location 2', description: 'Description 2', image: '/images/flower.jpeg'},
                {name: 'Trip 3', location: 'Location 3', description: 'Description 3', image: '/images/mountainandclouds.jpeg'}
            ];
</script>

<div class="min-h-screen bg-gradient-to-tr from-sky-200 via-cyan-400 to-sky-500 bg-opacity-75">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <h1 class="text-3xl pt-3 pb-4 font-bold text-slate-50">Explore Page</h1>

        <!-- Search Bar -->
        <form class="flex">
            <div class="relative">
                <Button class="rounded-xl whitespace-nowrap border border-sky-400 bg-sky-400 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all 
                hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                    {selectCategory}
                    <ChevronDown class="w-2.5 h-2.5 ms-2.5" />
                </Button>
               
                <Dropdown>
                    {#each items as { label, icon }}
                        <DropdownItem on:click={() => {
                            selectCategory = label;
                        }}
                        class={selectCategory === label ? 'underline' : ''}
                        >
                            {#if icon}
                                <svelte:component this={icon} class="w-4 h-4 me-1.5" />
                            {/if}
                            
                            {label}
                        </DropdownItem>
                        {/each}
                    </Dropdown>
            </div>
            <Search size="md" class="rounded-lg py-2.5 text-sky-500" bind:value={searchValue} placeholder="Search..." />
            <Button class="!p-2.5 rounded-s-none text-sky-300 bg-sky-400 hover:bg-sky-500 focus:ring focus:ring-primary-200">
                <SearchIcon class="w-6 h-6" />
            </Button>
        </form>
                    
        <!-- Carousel -->
    <div class="relative w-full max-w-2xl mx-auto p-4">
        <!-- Trip Details as Cards -->
         {#each trips as trip, i}
            {#if i === index }
                <div class="p-6 bg-white rounded-lg shadow-lg text-center">
                    <img src={trip.image} alt={trip.name} class="w-full h-40 object-cover rounded-md">
                    <h3 class="text-xl font-bold mt-2">Trip's name: {trip.name}</h3>
                    <p class="text-gray-600">Trip's destination: {trip.location}</p>
                    <p class="text-gray-600">Trip's description: {trip.description}</p>
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
      
    </div>
</div>

