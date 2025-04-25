<script lang="ts">
    import { goto } from '$app/navigation';
    import { A, Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { Tabs, TabItem, Modal, Button, Input, Label, Radio, RadioButton } from 'flowbite-svelte';
    import {writable} from 'svelte/store'; 
    import PackingListForm from './PackingList/PackingListForm.svelte';
    import { notifications } from '$lib/stores/notifications';
    let { data } = $props();


    import { 
        Luggage,
        Calendar,
        Receipt,
        MapPin,
        BadgeDollarSign,
        Vote,
        User,
        Clock,
        Share2,
        PlusCircle,
        UserPlus,
        Mail,
        Search,
        Settings
    } from 'lucide-svelte';

    // State management for sidebar
    let sidebarExtended = $state(false);
    let sidebarWidth = $state('80px');
    let createFormOpen = $state(false);

    // Add Member Modal state
    let addMemberModalOpen = $state(false);
    let inviteMethod = $state('email');
    let emailInput = $state('');
    let usernameInput = $state('');
    type TripUser = {
        id: number;
        username: string;
        name: string;
        avatar: string;
    };
    
    let searchResults = $state<TripUser[]>([]);
    let inviteMessage = $state('');

    async function inviteMember() {
    try {
        // Validate inputs
        if (inviteMethod === 'email' && !emailInput) {
            alert('Please enter an email address');
            return;
        }
        
        if (inviteMethod === 'username' && !usernameInput) {
            alert('Please enter a username');
            return;
        }
        
        // Use the trip ID from the loaded data if available
        const tripId = data?.trip?.id || 1;
        
        const res = await fetch('/api/trip-invites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: inviteMethod,
                recipient: inviteMethod === 'email' ? emailInput : usernameInput,
                trip_id: tripId,
                message: inviteMessage
            })
        });
        
        if (res.ok) {
            // Add a notification for the successful invitation
            notifications.addNotification({
                type: 'invite',
                title: 'Trip Invitation Sent',
                message: `Invitation sent to ${inviteMethod === 'email' ? emailInput : usernameInput} for ${tripData.title}`,
                timestamp: new Date(),
                read: false,
                action: {
                    label: 'View Trip',
                    href: `/tripspage/${tripData.title.toLowerCase().replace(/\s+/g, '-')}`
                }
            });

            // Reset form and close modal
            emailInput = '';
            usernameInput = '';
            inviteMessage = '';
            addMemberModalOpen = false;
            
            // Show success message
            alert('Invitation sent successfully!');
        } else {
            const errorData = await res.json();
            console.error('Error sending invitation:', errorData);
            alert('Failed to send invitation. Please try again.');
        }
    } catch (error) {
        console.error('Error sending invitation:', error);
        alert('An error occurred. Please try again.');
    }
}

    // Mock function to search for users
    function searchUsers() {
        // In a real application, this would make an API call to search for users
        if (usernameInput.length > 2) {
            // Mock results
            searchResults = [
                { id: 1, username: 'traveler123', name: 'John Doe', avatar: '/images/avatar1.jpg' },
                { id: 2, username: 'wanderlust', name: 'Jane Smith', avatar: '/images/avatar2.jpg' },
                { id: 3, username: 'globetrotter', name: 'Mike Johnson', avatar: '/images/avatar3.jpg' }
            ].filter(user => user.username.includes(usernameInput) || user.name.toLowerCase().includes(usernameInput.toLowerCase()));
        } else {
            searchResults = [];
        }
    }

    // Function to select a user from search results
    function selectUser(user) {
        usernameInput = user.username;
        searchResults = [];
    }

    // Share Trip Modal state
    let shareTripModalOpen = $state(false);

    //states for packing list 
    let packingList = $state<Array<{ 
        id: number, 
        name: string,
        quantity: number,
        created_by: string 
    }>>([]);

    let newItemName = $state(''); // Declare newItemName
    let newItemQuantity = $state(1); // Declare newItemQuantity with a default value
    let creatorName = $state(''); // Declare creatorName


    let packingListLoading = $state(false);
    let packingListError = $state<string | null>(null);
    let packingListEmpty = $state(false);

    async function loadPackingList() {
    try {
        packingListLoading = true; 
        packingListError = null;
        
        // Use the trip ID from the loaded data if available
        const tripId = data?.trip?.id || 1;
        const response = await fetch(`/api/packing-list?trip_id=${tripId}`);
        
        if (!response.ok) throw new Error('Failed to load packing list items');
        
        packingList = await response.json();
        packingListEmpty = packingList.length === 0;
    } catch (error) {
        packingListError = `Failed to load packing list: ${error.message}`;
        console.error('Error fetching packing list:', error);
    } finally {
        packingListLoading = false; 
    }
}
    

async function addItem() {
    try {
        packingListLoading = true;
        
        // Use the trip ID from the loaded data if available
        const tripId = data?.trip?.id || 1;
        
        const response = await fetch('/api/packing-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newItemName,
                quantity: newItemQuantity,
                created_by: creatorName,
                trip_id: tripId
            })
        });

        if (!response.ok) throw new Error('Error adding item to packing list');

        const newItem = await response.json();
        packingList = [newItem, ...packingList];
        packingListEmpty = false;

        newItemName = '';
        newItemQuantity = 1;
        // Don't reset creatorName so they don't have to re-enter it
    } catch (error) {
        console.error('Error adding item:', error);
        packingListError = 'Failed to add item. Please try again.';
    } finally {
        packingListLoading = false;
    }
}
   
async function deleteItem(itemId: number) {
    try {
        packingListLoading = true;
        
        const response = await fetch(`/api/packing-list`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: itemId })
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
        
        // Remove the item from the packing list
        packingList = packingList.filter(item => item.id !== itemId);
        packingListEmpty = packingList.length === 0;
    } catch (error) {
        console.error('Error deleting item:', error);
        packingListError = 'Failed to delete item. Please try again.';
    } finally {
        packingListLoading = false; 
    }
}


    // Mock packing items
    const packingItems = [
        { id: 1, name: 'Passport', checked: true },
        { id: 2, name: 'Clothes', checked: true },
        { id: 3, name: 'Toiletries', checked: false },
        { id: 4, name: 'Medications', checked: true },
        { id: 5, name: 'Phone Charger', checked: false },
        { id: 6, name: 'Camera', checked: false },
        { id: 7, name: 'Travel Adapter', checked: false }
    ];

    // Add Items to packingItem list 
    function addPackingItem() {
        const newId = packingItems.length > 0 ? Math.max(...packingItems.map(item => item.id || 0)) + 1 : 1;
        packingItems.push({ id: newId, name: '', checked: false }); 
    }
    
   // Replace your hardcoded tripData with this version
const tripData = {
    title: data?.trip?.title || "Summer in Japan",
    location: data?.trip?.location || "Tokyo, Japan",
    dates: data?.trip?.start_date && data?.trip?.end_date 
        ? formatDateRange(data.trip.start_date, data.trip.end_date)
        : "Jun 15 - Jun 22, 2025",
    travelers: data?.tripMembers?.length || 4,
    // Keep the budget as is for now since it's not in your database yet
    budget: {
        spent: 2450,
        total: 3000,
        percentage: 81
    },
    highlights: data?.highlights || [
        "Tokyo Disneyland",
        "Mount Fuji Day Trip",
        "Shibuya Crossing",
        "Tokyo Skytree"
    ]
};

// Add this helper function to format date ranges
function formatDateRange(start, end) {
    if (!start || !end) return "Dates not set";
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${endDate.getFullYear()}`;
}
    
    // For the progress bar animation
    import { onMount } from 'svelte';
	import { stringify } from 'postcss';

    //import for highlights 
    import { highlights, refreshHighlights, type Highlight} from '$lib/stores/highlights'; 
   
	

    let animateProgress = $state(false);

    let loading = $state(false);
    let errorMessage: string | null; 

    //Load trip highlights from API
    async function addHighlight(activityId: number){
        try {
            loading = true;
            errorMessage = null; 
            //API call to add highlight
            const response = await fetch('/api/highlights', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: activityId,
                    highlighted: true
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update highlight');
            }

            //refresh both state and store 
            await refreshHighlights();
        } catch (error) {
            console.error('Error adding highlight:', error);
            errorMessage = 'Failed to add highlight. Please try again.';
        } finally {
            loading = false;
        }
    }

    //Delete highlight from the list
    async function unhighlightActivity(highlightId: number) {
        try {
            loading = true;
            errorMessage = null; 
            //API call to unhighlight activity 
            const response = await fetch('/api/highlights', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ id: highlightId, highlighted: false })
            });

            if (!response.ok) {
                throw new Error('Failed to delete highlight');
            }

            //refresh both state and store 
            await refreshHighlights();
        } catch (error) {
            console.error('Error deleting highlight:', error);
            errorMessage = 'Failed to delete highlight. Please try again.';
        } finally {
            loading = false;
        }
    }

    // State for polling notifications
    let pollNotifications = $state(0);

    // Function to increment poll notifications
    function incrementPollNotifications() {
        pollNotifications += 1;
    }

    //Vote results
    let voteResults = $state<Array<{ id: number, name: string, votes: number }>>([]);
    let isLoading = $state(false);
    let error = $state<string | null>(null); 
    let pollInterval = $state<NodeJS.Timeout | null>(null); 

    //Fetch results from API 
    async function loadVoteResults() {
        try{
            const res = await fetch('/api/activities?order=votes');
            const data = await res.json();
            voteResults = data.map((a: { id: number; name: string; votes: number; updated_at: string }) => ({
                id: a.id,
                name: a.name,
                votes: a.votes,
                updated_at: a.updated_at
            }));
            // Update poll notifications
            pollNotifications = voteResults.reduce((acc, result) => acc + result.votes, 0);

        } catch (err) {
            
            console.error('Error fetching voting results:', err);
        } finally {
            isLoading = false; 
        }
    }

    let pendingVotes = $state(0);

    async function voteForActivity(activityId: number) {
        try {
            const response = await fetch(`/api/activities`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: activityId, vote: 1})
        }); 
        if(!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.error || 'Failed to vote');
        }
        //after voting, refresh the results
        await loadVoteResults();
        if( pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(loadVoteResults, 5000);
        } catch (error) {
            console.error('Error voting for activity:', error);
            alert('An error occurred. Please try again.');
            
        } finally {
            pendingVotes = pendingVotes - 1; 
        }
    }
    //formatting the date 
    function formatDate(dateString: string){
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    //states for trip schedule
    let tripSchedule = $state<Array<{
        id: number;
        title: string;
        description: string;
        date: string;
        votes: number;
    }>>([]);
    let scheduleLoading = $state(false);
    let scheduleError = $state<string | null>(null);
  
        async function loadSchedule() {
    try {
        scheduleLoading = true; 
        // Use the trip ID from the loaded data if available
        const tripId = data?.trip?.id || 1;
        const response = await fetch(`/api/schedule?trip_id=${tripId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load schedule: ${response.status}`);
        }
        
        tripSchedule = await response.json(); 
    } catch (error) {
        scheduleError = `Failed to load schedule: ${error.message}`;
        console.error('Error fetching schedule:', error);
    } finally {
        scheduleLoading = false; 
    }
}

onMount(() => {
    (async () => {
        // Initialize from server data if available
        if (data?.tripSchedule) {
            tripSchedule = data.tripSchedule;
        }
        
        if (data?.voteResults) {
            voteResults = data.voteResults;
        }
        
        if (data?.packingList) {
            packingList = data.packingList;
            packingListEmpty = packingList.length === 0;
        }
        
        //Update the global highlights store
        await refreshHighlights();
        
        // Load trip schedule
        loadSchedule(); 
        
        // Load packing list if not already loaded
        if (!data?.packingList) {
            loadPackingList();
        }
        
        // Load voting results asynchronously
        loadVoteResults(); // initial load

        // Set up polling interval to poll every 5 seconds
        pollInterval = setInterval(loadVoteResults, 5000);

        // Trigger animation after component mounts
        setTimeout(() => {
            animateProgress = true;
        }, 300);
    })();

    // Cleanup function to clear polling interval
    return () => {
        if (pollInterval) clearInterval(pollInterval);
    };
});
</script>

<div class="min-h-screen bg-gradient-to-b from-[#e0f7fa] to-[#b2ebf2]">
    <Sidebar 
        bind:sidebarExtended 
        bind:sidebarWidth 
        bind:createFormOpen
    />

    <div class="transition-all duration-500 ease-in-out" style="margin-left: {sidebarWidth};">
        
        <!-- Trip Header -->
        <div class="bg-white border-b shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-cyan-700">{tripData.title}</h1>
                            <div class="mt-3 flex flex-wrap items-center text-gray-600 gap-x-6 gap-y-2">
                                <div class="flex items-center">
                                    <MapPin class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.location}</span>
                                </div>
                                <div class="flex items-center">
                                    <Calendar class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.dates}</span>
                                </div>
                                <div class="flex items-center">
                                    <User class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.travelers} travelers</span>
                                </div>
                                <div class="flex items-center">
                                    <Clock class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>7 days</span>
                                </div>
                            </div>
                        </div>

                        <!-- Button Group - FIXED -->
                        <div class="flex space-x-3">
                            <!-- Add Member Button -->
                            <button 
                                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                                onclick={() => addMemberModalOpen = true}
                            >
                                <UserPlus class="w-4 h-4" />
                                Add Member
                            </button>
                            
                            <!-- Create Poll Button -->
                            <button class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
                                onclick={() => goto('/activitypage')}
                                >
                                <Vote class="w-4 h-4" />
                                Create Poll
                            </button>
                            
                            <!-- Share Trip Button -->
                            <button 
                                class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm"
                                onclick={ () => shareTripModalOpen = true }
                                >
                            
                                <Share2 class="w-4 h-4" />
                                Share Trip 
                            </button>

                            <!-- Settings Button -->
                            <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm">
                                <Settings class="w-4 h-4" />
                                Settings
                        </div>
                    </div>

                    <!-- Trip Tabs -->
                    <Tabs tabStyle="underline" class="mt-8 flex w-full justify-between">
                        
                        <!-- Schedule Tab -->
                        <TabItem open>
                            <span slot="title" class="flex items-center p-3 gap-2 group">
                                <Calendar class="w-5 h-5 text-gray-500 group-hover:text-cyan-600 transition-colors"/>
                                <span class="text-gray-700 group-hover:text-cyan-600 transition-colors font-medium">Schedule</span>
                            </span>
                            <div class="bg-white rounded-lg shadow-md p-6 mt-2">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-lg font-semibold text-gray-800">Trip Schedule</h3>
                                    <button class="text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                                        <PlusCircle class="w-4 h-4" />
                                        <span>Add Event</span>
                                    </button>
                                </div>
                                
                                <div class="space-y-6">
                                    {#each tripSchedule as event, index}
                                        <div class="border-l-4 border-cyan-500 pl-4 py-2 relative bg-sky-300/30">
                                            <!-- Timeline dot -->
                                            <div class="absolute w-3 h-3 bg-cyan-500 rounded-full -left-1.5 top-5"></div>

                                            <!-- Day number and date -->
                                             <div class="text-sm text-gray-500">
                                                Event { index + 1 } - { formatDate(event.date)}
                                             </div>

                                            <!-- Activity title -->
                                             <div class="text-gray-800 font-medium mt-1">
                                                {event.title}
                                             </div>

                                            <!-- Activity description -->
                                            <div class="text-gray-600 text-sm mt-1">
                                                {event.description}
                                             </div>

                                             <!-- Votes -->
                                            <div class="text-xs text-cyan-600 mt-1">
                                                {event.votes} {event.votes === 1 ? 'vote' : 'votes'}
                                            </div>

                                            <!-- Add to highlight button -->
                                             <button 
                                                onclick={() => addHighlight(event.id)}
                                                disabled="{loading || $highlights.some((h: { id: number }) => h.id === event.id)}"
                                                class="text-cyan-600 hover:text-cyan-900 text-xs mt-2 rounded shadow-md px-2 py-1 bg-white border border-cyan-500 flex items-center gap-1"
                                             >

                                             {#if loading}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="lucide lucide-loader-icon lucide-loader"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                                                <span>Adding... </span>
                                            {:else if $highlights.some((h: { id: number }) => h.id === event.id)}
                                                 <!-- Star SVG -->
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" 
                                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                 class="lucide lucide-star-icon lucide-star">
                                                 <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                                                <span> Highlighted </span>
                                            {:else}
                                            <!-- Add to highlight button -->
                                                <!-- Star SVG -->
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="lucide lucide-star-icon lucide-star">
                                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                                                <span>Add to Trip Highlights</span>
                                            {/if}
                                            </button>
                                        
                                        </div>
                                    {:else}
                                        <div class="text-gray-500">No events scheduled yet. 
                                            Add dates to activities in 'create poll' to see them here. 
                                        </div>

                                    {/each}
                                </div>
                            </div>
                        </TabItem>

                        <!-- Budget Tab -->
                        <TabItem>
                            <span slot="title" class="flex items-center p-3 gap-2 group">
                                <Receipt class="w-5 h-5 text-gray-500 group-hover:text-cyan-600 transition-colors"/>
                                <span class="text-gray-700 group-hover:text-cyan-600 transition-colors font-medium">Budget</span>
                            </span>
                            <div class="bg-white rounded-lg shadow-md p-6 mt-2">
                                <p class="text-gray-700">Budget details will appear here.</p>
                            </div>
                        </TabItem>

                        <!-- Packing Tab -->
                        <TabItem>
                            <span slot="title" class="flex items-center p-3 gap-2 group">
                                <Luggage class="w-5 h-5 text-gray-500 group-hover:text-cyan-600 transition-colors"/>
                                <span class="text-gray-700 group-hover:text-cyan-600 transition-colors font-medium">Packing</span>
                            </span>
                        
                            {#if packingListError}
                                <div class="bg-red-50 text-red-500 p-4 rounded-md">
                                    {packingListError}
                                    <button onclick={loadPackingList} class="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                                        Retry loading
                                    </button>
                                </div>
                            {:else if packingListLoading}
                                <div class="animate-pulse space-y-4">
                                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                                    {#each Array(3) as _}
                                        <div class="h-12 bg-gray-100 rounded-md"></div>
                                    {/each}
                                </div>
                                {:else}
                                    <div class="bg-white rounded-lg shadow-md p-6 mt-2 space-y-4">
                                        {#if packingListEmpty}
                                            <p class="text-gray-500">No items in the packing list.</p>
                                        {:else}
                                            <ul class="space-y-3">
                                                {#each packingList as item (item.id)}
                                                    <li class= "flex justify-between items-center p-3 bg-gray-50 rounded">
                                                        <div>
                                                            <span class="font-medium">{item.name}</span>
                                                            <span class="text-sm text-gray-500 ml-2">x({item.quantity})</span>
                                                            <span class="text-xs text-gray-400 ml-2">added by {item.created_by}</span>
                                                        </div>
                                                        <button
                                                            onclick={() => deleteItem(item.id)}
                                                            class="text-red-500 hover:text-red-700"
                                                        >
                                                           <Trash class="w-4 h-4" />
                                                        </button> 

                                                    </li>
                                                {/each}
                                            </ul>
                                        {/if}

                                        <PackingListForm
                                            bind:newItemName
                                            bind:newItemQuantity
                                            bind:creatorName
                                            on:submit={addItem}
                                            
                                        />
                                    </div>
                            {/if}
              
                        </TabItem>

                        <!-- Polling Tab -->
                        <TabItem>
                            <span slot="title" class="relative flex items-center p-3 gap-2 group">
                                <Vote class="w-5 h-5 text-gray-500 group-hover:text-cyan-600 transition-colors"/>
                                
                                <!-- Notification Badge -->
                                {#if pollNotifications > 0}
                                    <span class="absolute top-0 right-0 -translate-y-1 translate-x-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {pollNotifications}
                                    </span>
                                {/if}

                                <span class="text-gray-700 group-hover:text-cyan-600 transition-colors font-medium">Polling</span>
                            </span>
                            <div class="bg-white rounded-lg shadow-md p-6 mt-2">
                                {#if isLoading && voteResults.length === 0}
                                    <div class="animate-pulse space-y-4">
                                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                                        {#each Array(3) as _}
                                            <div class="h-12 bg-gray-100 rounded-md"></div>
                                        {/each}
                                    </div>
                                {:else if error }
                                    <div class="text-red-500 p-4 bg-red-50 rounded-md">
                                        {error}
                                        <button onclick={loadVoteResults} class="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                                            Retry loading
                                        </button>
                                    </div>
                                {:else if voteResults.length > 0}
                                    <div class="space-y-4">
                                        <h3 class="text-lg font-semibold text-gray-800">Vote Results</h3>
                                        {#each voteResults as result}
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                                                <span class="text-gray-700">{result.name}</span>
                                                <button 
                                                    onclick={() => voteForActivity(result.id)}
                                                    class="text-sky-500 hover:text-sky-700"
                                                >
                                                    <span class="text-gray-500">{result.votes}</span>
                                                </button>
                                                
                                            </div>
                                        {/each}
                                    </div>
                                {:else}
                                    <p class="text-gray-700">Polling details will appear here.</p>
                                {/if}
                                    
                            </div>
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        </div>


        <!-- Widgets Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Budget Widget -->
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Budget Overview</h2>
                        <BadgeDollarSign class="w-6 h-6 text-cyan-600" />
                    </div>
                    <div class="text-3xl font-bold mb-1 text-gray-800">
                        ${tripData.budget.spent.toLocaleString()}
                    </div>
                    <div class="text-sm text-gray-500 mb-4">
                        of ${tripData.budget.total.toLocaleString()} budget
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-cyan-600 rounded-full transition-all duration-1000 ease-out"
                             style="width: {animateProgress ? tripData.budget.percentage : 0}%"></div>
                    </div>
                    <div class="mt-2 text-sm text-gray-600 flex justify-between">
                        <span>Spent: {tripData.budget.percentage}%</span>
                        <span>Remaining: ${(tripData.budget.total - tripData.budget.spent).toLocaleString()}</span>
                    </div>
                </div>

                <!-- Packing List Widget -->
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Packing List</h2>
                        <Luggage class="w-6 h-6 text-cyan-600" />
                    </div>
                    <div class="space-y-3">
                        {#each packingItems as item (item.id)}
                            <label class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                                <input type="checkbox" bind:checked={item.checked} class="rounded text-cyan-600 focus:ring-cyan-500" />
                                <span class="ml-2 text-gray-700 {item.checked ? 'line-through text-gray-400' : ''}">
                                    {item.name}
                                </span>
                            </label>
                        {/each}
                    </div>
                    <div class="mt-4 pt-3 border-t border-gray-100">
                        <button class="text-cyan-600 hover:text-cyan-700 text-sm flex items-center gap-1">
                            <PlusCircle class="w-4 h-4" />
                            <span>Add Item</span>
                        </button>
                    </div>
                </div>

                <!-- Trip Highlights Widget -->
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Trip Highlights</h2>
                        <MapPin class="w-6 h-6 text-cyan-600" />
                    </div>

                    {#if errorMessage}
                        <div class="text-red-500 text-sm mb-4">{errorMessage}</div>
                    {/if}

                    <div class="space-y-3">
                        {#each $highlights as highlight, i}
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <div>
                                    <span class="text-gray-700 font-medium">{highlight.name}</span>
                                    {#if highlight.description}
                                        <p class="text-gray-500 text-sm mt-1">{highlight.description}</p>
                                    {/if}

                                    <button 
                                    onclick={() => unhighlightActivity(highlight.id)}
                                    class="text-cyan-600 hover:text-cyan-900 text-xs mt-2 rounded shadow-md px-2 py-1 bg-white border border-cyan-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                    class="lucide lucide-star-off-icon lucide-star-off">
                                    <path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43"/>
                                    <path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                    <span>Unhighlight</span>
                                </button>
                                </div>

                            </div>
                        {:else}
                            <div class="text-gray-500">No highlights added yet.</div>
        
                        {/each}
                    </div>
                    <div class="mt-4 pt-3 border-t border-gray-100">
                        <button class="text-cyan-600 hover:text-cyan-700 text-sm flex items-center gap-1">
                            <PlusCircle class="w-4 h-4" />
                            <span>Add Highlight</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Member Modal -->
        <Modal bind:open={addMemberModalOpen} size="md" autoclose={false} class="w-full">
            <div class="text-center">
                <UserPlus class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Invite a member to join "{tripData.title}"
                </h3>
                
                <!-- Invite Method Selection -->
                <div class="mb-4">
                    <div class="flex flex-col gap-3">
                    <label class="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input 
                        type="radio" 
                        bind:group={inviteMethod} 
                        value="email" 
                        class="text-cyan-600 focus:ring-cyan-500 mr-3"
                        />
                        <div class="flex items-center">
                        <Mail class="w-4 h-4 mr-2 text-gray-600" />
                        <span class="text-gray-700">Invite by Email</span>
                        </div>
                    </label>
                    
                    <label class="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input 
                        type="radio" 
                        bind:group={inviteMethod} 
                        value="username" 
                        class="text-cyan-600 focus:ring-cyan-500 mr-3"
                        />
                        <div class="flex items-center">
                        <User class="w-4 h-4 mr-2 text-gray-600" />
                        <span class="text-gray-700">Invite by Username</span>
                        </div>
                    </label>
                    </div>
                </div>
                
                <!-- Email Input -->
                {#if inviteMethod === 'email'}
                    <div class="mb-4">
                        <Label for="email" class="mb-2">Email address</Label>
                        <Input id="email" placeholder="Enter email address" bind:value={emailInput} type="email" required />
                    </div>
                {/if}
                
                <!-- Username Input -->
                {#if inviteMethod === 'username'}
                    <div class="mb-4">
                        <Label for="username" class="mb-2">Username</Label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search class="w-4 h-4 text-gray-500" />
                            </div>
                            <Input 
                                id="username" 
                                placeholder="Search for user" 
                                bind:value={usernameInput} 
                                on:input={searchUsers}
                                class="pl-10"
                            />
                        </div>
                        
                        <!-- User Search Results -->
                        {#if searchResults.length > 0}
                            <div class="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-40 overflow-y-auto">
                                {#each searchResults as user}
                                    <div 
                                        class="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                        onclick={() => selectUser(user)}
                                    >
                                        <div class="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold mr-2">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium">{user.name}</div>
                                            <div class="text-xs text-gray-500">@{user.username}</div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
                
                <!-- Optional Message -->
                <div class="mb-4">
                    <Label for="message" class="mb-2">Personal message (optional)</Label>
                    <textarea
                        id="message"
                        rows="3"
                        class="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Add a personal message to your invitation"
                        bind:value={inviteMessage}
                    ></textarea>
                </div>
                
                <div class="flex justify-center gap-4">
                    <Button color="alternative" on:click={() => addMemberModalOpen = false}>
                        Cancel
                    </Button>
                    <Button color="success" on:click={inviteMember}>
                        Send Invitation
                    </Button>
                </div>
            </div>
        </Modal>

        <!-- Share Trip Modal -->
        <Modal bind:open={shareTripModalOpen} size="md" autoclose={false} class="w-full">
            <div class="text-center">
                <Share2 class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Share "{tripData.title}" with your friends!
                </h3>
                
                <div class="flex justify-center gap-4">
                    <Button color="alternative" on:click={() => shareTripModalOpen = false}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>


    </div>
</div>