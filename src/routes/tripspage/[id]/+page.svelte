<script lang="ts">
    import { goto } from '$app/navigation';
    import { A, Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { Tabs, TabItem, Modal, Button, Input, Label, Radio, RadioButton } from 'flowbite-svelte';
    import {writable} from 'svelte/store'; 
    import PackingListForm from '../PackingList/PackingListForm.svelte';
    import { notifications } from '$lib/stores/notifications';
    import {page} from '$app/stores';
    import { getAuth } from 'firebase/auth';
    import { triggerToast } from '$lib/stores/notifications';
    import AddMemberModal from '$lib/components/AddMemberModal.svelte';
  


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
        Settings,
        Trash
    } from 'lucide-svelte';

    // State management for sidebar
    let sidebarExtended = $state(false);
    let sidebarWidth = $state('80px');
    let createFormOpen = $state(false);

  let showAddMemberModal = false; // controls showing the modal


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
    let confirmDeleteModalOpen = $state(false);

     // Function to handle member invitation
     async function inviteMember() {
  try {
    if (inviteMethod === 'email' && !emailInput) {
      triggerToast('Please enter an email address');
      return;
    }

    if (inviteMethod === 'username' && !usernameInput) {
      triggerToast('Please enter a username');
      return;
    }

    if (!tripId) {
      console.error('Missing trip ID');
      triggerToast('Trip ID not found.');
      return;
    }

    if (inviteMethod === 'email') {
      const res = await fetch('/api/invite-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, email: emailInput, message: inviteMessage })
      });

      if (res.ok) {
        triggerToast('Email invitation sent successfully!');
      } else {
        const errorData = await res.json();
        console.error('Error sending email invitation:', errorData);
        triggerToast('Failed to send email invitation. Please try again.');
      }
    } 
    else if (inviteMethod === 'username') {
      const res = await fetch('/api/trip-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: usernameInput,
          tripId: tripId,
          message: inviteMessage
        })
      });

      if (res.ok) {
        triggerToast('Username invitation sent successfully!');
      } else {
        const errorData = await res.json();
        console.error('Error sending username invitation:', errorData);
        triggerToast('Failed to send username invitation. Please try again.');
      }
    }

    emailInput = '';
    usernameInput = '';
    inviteMessage = '';
    addMemberModalOpen = false;

  } 
  catch (error) {
    console.error('Error sending invitation:', error);
    triggerToast('An error occurred. Please try again.');
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
    function selectUser(user: TripUser) {
    usernameInput = user.username;
    searchResults = [];
    }

    //export trip data
    const { data } = $props();
    //Get the trip ID from the URL
    const tripId = $page.params.id;
    
    let averageBudget = $state(0); // Calculated average
    let tripData = $state({
    id: tripId,
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    owner: '',
    members: [] as Array<{ username: string }>, // <-- NEW
    loading: false,
    error: null as string | null,
    budget: {
        spent: 0,
        total: averageBudget,
        percentage: 0
    },
    imageUrl: ''
});

    // Function to share trip
    async function shareTrip() {
        try {
            const response = await fetch('/api/shared-trips', {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ tripId: tripData.id })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Failed to share trip');
            }
            triggerToast('Trip shared successfully!');
            shareTripModalOpen = false;
        } catch (error) {
            console.error('Error sharing trip:', error);
            triggerToast('Failed to share trip. Please try again.');
        }
    }

    async function loadTripData() {
        try {
            console.log('Loading trip data for ID:', tripId);
            tripData.loading = true;
            tripData.error = null;

              // Get authentication token if available
              let headers = new Headers({
                'Content-Type': 'application/json'
            });
            
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;
                
                if (currentUser) {
                    const token = await currentUser.getIdToken();
                    headers.append('Authorization', `Bearer ${token}`);
                    console.log('Added auth token to request');
                }
            } catch (authError) {
                console.warn('Failed to get auth token:', authError);
                // Continue without auth
            }
            // Make API result
            const response = await fetch(`/api/trips/${tripId}`, { headers });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Trip not found: ${tripId}`);
                }
                throw new Error(`Failed to load trip: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Trip data received:', data);
            
            tripData = {
                ...tripData,
                title: data.title,
                location: data.location,
                startDate: data.startDate,
                endDate: data.endDate,
                imageUrl: data.imageUrl,
                members: data.members || [], // ✅ NEW LINE
                loading: false,
                error: null
            };

            // Calculate budget percentage
            const spent = data.budget.spent || 0;
            const total = data.budget.total || 0;
            tripData.budget.spent = spent;
            tripData.budget.total = total;
            tripData.budget.percentage = total > 0 ? Math.round((spent / total) * 100) : 0;

            // Calculate average budget
            if (tripData.members.length > 0) {
                averageBudget = Math.round(total / tripData.members.length);
            } else {
                averageBudget = 0;
            }
        } catch (error) {
            console.error('Error loading trip:', error);
            tripData.error = (error as Error).message;
            tripData.loading = false;
        }
    }

    function calculateDuration(start: string, end: string){
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1; // Add 1 to include the start date 
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }

    // Share Trip Modal state
    let shareTripModalOpen = $state(false);

    // Setting Modal state
    let settingsModalOpen = $state(false);

    //states for packing list 
    let packingList = $state<Array<{ 
        id: number, 
        name: string,
        quantity: number,
        created_by: string,
        checked: boolean // Added 'checked' property
    }>>([]);

    let newItemName = $state(''); // Declare newItemName
    let newItemQuantity = $state(1); // Declare newItemQuantity with a default value
    let creatorName = $state(''); // Declare creatorName
    let travelersModalOpen = $state(false);

    let packingListLoading = $state(false);
    let packingListError = $state<string | null>(null);
    let packingListEmpty = $state(false);

    //fetch packing list from API 
    async function loadPackingList() {
        try {
            packingListLoading = true; 
            packingListError = null;
            const response = await fetch(`/api/packing-list?trip_id=${tripId}`);
            if (!response.ok) throw new Error('Failed to load packing list items');

            const data = await response.json();
            if (!Array.isArray(data)) {
            throw new Error('Invalid data format received from API');
        }
            packingList = data.map(item => ({
                ...item,
                checked: false
            }))
            packingListEmpty = packingList.length === 0; 
            
        } catch (error) {
            packingListError = `Failed to load packing list: ${(error as Error).message}`;
            console.error('Error fetching packing list:', error);
        } finally {
            packingListLoading = false; 
        }
    }

    async function toggleItemChecked(itemId: number, isChecked: boolean) {
    try {
        const response = await fetch('/api/packing-list', {
            method: 'PATCH', // Use PATCH to update the item
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: itemId,
                checked: isChecked
            })
        });

        if (!response.ok) throw new Error('Failed to update item state');

        // Update the local state
        packingList = packingList.map(item =>
            item.id === itemId ? { ...item, checked: isChecked } : item
        );
    } catch (error) {
        console.error('Error updating item state:', error);
        packingListError = 'Failed to update item. Please try again.';
    }
}
    

async function addItem(event: Event) {
    event.preventDefault();  // <-- this is the missing part!

    try {
        const response = await fetch(`/api/packing-list`, {
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

        await loadPackingList();

        newItemName = '';
        newItemQuantity = 1;
        creatorName = '';
    } catch (error) {
        console.error('Error adding item:', error);
        packingListError = 'Failed to add item. Please try again.';
    } finally {
        packingListLoading = false;
    }
}
   
    async function deleteItem(itemId: number) {
        try {
        const response = await fetch(`/api/packing-list`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: itemId, trip_id: tripId }) // <-- ADD trip_id to be safe
        });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            // Remove the item from the packing list
            packingList = packingList.filter(item => item.id !== itemId);
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
  
    // For the progress bar animation
    import { onMount } from 'svelte';

    let imageLoaded = false; // Declare imageLoaded variable

    //import for highlights 
    import { highlights, refreshHighlights, addHighlight, removeHighlight, type Highlight} from '$lib/stores/highlights'; 
	import { stringify } from 'postcss';

   
    let animateProgress = $state(false);

    let loading = $state(false);
    let errorMessage: string | null; 

    // Function to load highlights
    async function loadHighlights() { 
        try {
            await refreshHighlights(tripId); // Pass the tripId to the refreshHighlights function
        } catch (error) {
            console.error('Error loading highlights:', error);
            errorMessage = 'Failed to load highlights. Please try again.';
        }  
    }
     // Add a highlight for the specific trip
     async function handleAddHighlight(activityId: number) {
        try {
            loading = true;
            errorMessage = null;
            await addHighlight(tripId, activityId); // Pass the tripId to add a highlight for the current trip
        } catch (error) {
            console.error('Error adding highlight:', error);
            errorMessage = 'Failed to add highlight. Please try again.';
        } finally {
            loading = false;
        }
    }

    // Remove a highlight for the specific trip
    async function handleRemoveHighlight(activityId: number) {
        try {
            loading = true;
            errorMessage = null;
            await removeHighlight(tripId, activityId); // Pass the tripId to remove a highlight for the current trip
        } catch (error) {
            console.error('Error removing highlight:', error);
            errorMessage = 'Failed to remove highlight. Please try again.';
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
            const res = await fetch(`/api/trips/${tripId}/activities?order=votes`);
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

    // Declare tripActivities state 
    let tripActivities = $state<Array<{
        id: number;
        title: string;
        description: string;
        date: string;
        votes: number } >>([]);

    // Function to load Activity details for Share Trip Modal
    async function loadActivities() {
        try {
            const response = await fetch(`/api/trips/${tripId}/activities`);
            if (!response.ok) {
                throw new Error('Failed to load activity details');
            }
            const data = await response.json();
            tripActivities = data;
        } catch (error) {
            console.error('Error fetching activity details:', error);
        }
    }

    let pendingVotes = $state(0);

    async function voteForActivity(activityId: number) {
        try {
            const response = await fetch(`/api/trips/${tripId}/activities`, {
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
            triggerToast('An error occurred. Please try again.');
            
        } finally {
            pendingVotes = pendingVotes - 1; 
        }
    }
    //formatting the date 
    function formatDate(dateString: string){
        if(!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });
    }

    let newBudget = $state<number | null>(null); // User's input
let tripBudgets = $state<Array<{ id: number; username: string; proposed_budget: number }>>([]); // All budgets



// Submit a budget
async function submitBudget() {
  try {
    if (!newBudget || newBudget <= 0) {
      triggerToast('Please enter a valid budget amount.');
      return;
    }

    // Get token (if you need to authenticate) — or use your existing auth code
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers.append('Authorization', `Bearer ${token}`);
      }
    } catch (err) {
      console.warn('No auth token available:', err);
    }

    const response = await fetch('/api/trip-budgets', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        trip_id: tripId,
        proposed_budget: newBudget
      })
    });

    if (!response.ok) throw new Error('Failed to submit budget.');

    newBudget = null; // Reset form
    await loadBudgets(); // Reload list
    triggerToast('Budget submitted!');
  } catch (err) {
    console.error('Error submitting budget:', err);
    triggerToast('Error submitting budget. Try again.');
  }
}

// Load budgets for the trip
async function loadBudgets() {
  try {
    const res = await fetch(`/api/trip-budgets?trip_id=${tripId}`);
    if (!res.ok) throw new Error('Failed to fetch budgets.');

    const data = await res.json();
    tripBudgets = data;

    if (tripBudgets.length > 0) {
      const total = tripBudgets.reduce((acc, item) => acc + Number(item.proposed_budget), 0);
      averageBudget = Math.round(total / tripBudgets.length);
    } else {
      averageBudget = 0;
    }

  } catch (err) {
    console.error('Error loading budgets:', err);
  }
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
  
    //Load trip schedule in Schedule Tab 
    async function loadSchedule() {
        try {
            scheduleLoading = true; 
            scheduleError = null; 

            const response = await fetch(`/api/schedule/${tripId}`);
            if (!response.ok) {
                throw new Error(`Failed to load schedule: ${response.status}`);
            }
            tripSchedule = await response.json(); 
            // Process and display the schedule data
        } catch (error) {
            scheduleError = `Failed to load schedule: ${(error as Error).message}`;
            console.error('Error fetching schedule:', error);
        } finally {
            scheduleLoading = false; 
        }

    }
    // Function to delete the trip 
    async function deleteTrip() {
    try {
        const response = await fetch(`/api/trips/${tripId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete trip');
        }
        triggerToast('Trip deleted successfully!');
        window.location.href= '/totaltripspage';
    } catch (error) {
        console.error('Error deleting trip:', error);
        triggerToast('Failed to delete trip. Please try again.');
    }
}

    onMount(() => {
  (async () => {
    // Load all necessary data
    await Promise.all([
      loadBudgets(),
      loadPackingList(),
      loadTripData(),
      loadHighlights(),
      loadSchedule(),
      loadVoteResults()
    ]);

     // Start polling vote results every 5 seconds
     pollInterval = setInterval(loadVoteResults, 5000);

    // Trigger animation after component mounts
    setTimeout(() => {
    animateProgress = true;
    }, 300);
    })();

        // Load trip data when the component mounts
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
        {#if tripData.error}
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p class="font-bold">Error loading trip data</p>
                <p>{tripData.error}</p>
                <button
                    onclick={loadTripData}
                    class="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red:600">
                    Retry
                </button>
            </div>
        
        {:else if tripData.loading}
            <div class="animate-pulse space-y-4">
                <!-- Header Loading -->
                <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                <div class="flex space-x-4">
                    <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
        
                 <!-- Tabs Loading -->
                <div class="flex space-x-4 border-b">
                    {#each ['Schedule', 'Budget', 'Packing', 'Polling'] as tab}
                    <div class="h-10 bg-gray-200 rounded w-24"></div>
                    {/each}
                </div>
        
                <!-- Content Loading -->
                <div class="h-64 bg-gray-200 rounded"></div>
            </div>
        {:else}
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
                                    <span>{formatDate(tripData.startDate)} - {formatDate(tripData.endDate)}</span>
                                </div>
                                                          
                                  
                                <div class="flex items-center relative group">
                                    <User class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.members.length} traveler{tripData.members.length === 1 ? '' : 's'}</span>
                                  
                                    <!-- Tooltip that appears on hover -->
                                    <div class="absolute left-0 top-8 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none p-3 z-10">
                                      <h4 class="text-sm font-semibold text-gray-700 mb-2">Members:</h4>
                                      {#if tripData.members.length > 0}
                                        <ul class="space-y-1 text-sm text-gray-600">
                                          {#each tripData.members as member}
                                            <li>@{member.username}</li>
                                          {/each}
                                        </ul>
                                      {:else}
                                        <p class="text-gray-500 text-sm">No members yet.</p>
                                      {/if}
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
                                onclick={() => goto(`/tripspage/${tripId}/activities`)}
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
                            <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm"
                                onclick={ () => settingsModalOpen = true}
                            >
                                <Settings class="w-4 h-4" />
                                Settings
                            </button>
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
                                {#if scheduleLoading}
                                    <div class="animate-pulse space-y-4">
                                        <div class="h-4 bg-gray-200 rounded w-1/2">
                                        {#each Array(3) as _}
                                            <div class="h-12 bg-gray-100 rounded-m"></div>
                                        {/each}
                                        </div>
                                    </div>
                                {:else if scheduleError}
                                    <div class="text-red-500 p-4 bg-red-50 rounded-md">
                                        {scheduleError}
                                        <button onclick={loadSchedule} class="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                                            Retry loading
                                        </button>
                                    </div>
                                {:else if tripSchedule.length > 0}
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
                                                <div class="text-gray-800 font-medium mt-1">{event.title}</div>
                                            <!-- Activity description -->
                                            <div class="text-gray-600 text-sm mt-1">{event.description}</div>
                                            <!-- Votes -->
                                            <div class="text-xs text-cyan-600 mt-1">
                                                {event.votes} {event.votes === 1 ? 'vote' : 'votes'}
                                            </div>

                                            <!-- Add to highlight button -->
                                             <button 
                                                onclick={() => handleAddHighlight(event.id)}
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
                                    {/each}
                                </div>
                            {:else}
                                <div class="text-gray-500">No events scheduled yet. 
                                    Add dates to activities in 'create poll' to see them here. 
                                </div>
                            {/if}
                            </div>
                        </TabItem>

                        <!-- Budget Tab -->
                        <TabItem>
                            <span slot="title" class="flex items-center p-3 gap-2 group">
                                <Receipt class="w-5 h-5 text-gray-500 group-hover:text-cyan-600 transition-colors"/>
                                <span class="text-gray-700 group-hover:text-cyan-600 transition-colors font-medium">Budget</span>
                            </span>
                            <div class="bg-white rounded-lg shadow-md p-6 mt-2">
                                <div class="space-y-6">

                                    <!-- Submit New Budget -->
                                    <form on:submit|preventDefault={submitBudget} class="space-y-4">
                                      <div>
                                        <label for="budget" class="block text-sm font-medium text-gray-700">Enter Your Budget ($)</label>
                                        <input
                                          id="budget"
                                          type="number"
                                          min="0"
                                          bind:value={newBudget}
                                          placeholder="e.g., 1500"
                                          required
                                          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                                        />
                                      </div>
                                  
                                      <button
                                        type="submit"
                                        class="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
                                      >
                                        Submit Budget
                                      </button>
                                    </form>
                                  
                                    <!-- Show Submitted Budgets -->
                                    <div class="mt-6">
                                      <h3 class="text-lg font-semibold text-gray-800 mb-2">All Members' Budgets</h3>
                                  
                                      {#if tripBudgets.length > 0}
                                        <ul class="divide-y divide-gray-200">
                                          {#each tripBudgets as budget}
                                            <li class="py-2 flex justify-between">
                                              <span class="text-gray-700">{budget.username}</span>
                                              <span class="font-medium text-cyan-700">${budget.proposed_budget}</span>
                                            </li>
                                          {/each}
                                        </ul>
                                  
                                        <!-- Average Budget -->
                                        <div class="mt-4 text-gray-800">
                                          <strong>Average Budget:</strong> ${averageBudget}
                                        </div>
                                      {:else}
                                        <p class="text-gray-500">No budgets submitted yet.</p>
                                      {/if}
                                    </div>
                                  
                                  </div>
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
                                            onsubmit={addItem}
                                            
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
                  ${averageBudget.toLocaleString()}
                </div>
                <div class="text-sm text-gray-500 mb-4">
                  Group Average Budget
                </div>
          
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-cyan-600 rounded-full transition-all duration-1000 ease-out" style="width: 100%"></div>
                </div>
          
                <div class="mt-2 text-sm text-gray-600 flex justify-between">
                  <span>Spent: $0</span> <!-- You can improve this later to show tripData.budget.spent -->
                  <span>Remaining: ${averageBudget.toLocaleString()}</span> <!-- Same -->
                </div>
              </div>
          
              <!-- Packing List Widget -->
              <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold text-gray-800">Packing List</h2>
                  <Luggage class="w-6 h-6 text-cyan-600" />
                </div>
          
                <div class="space-y-3">
                  {#each packingList as item (item.id)}
                    <label class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <input 
                        type="checkbox" 
                        bind:checked={item.checked} 
                        class="rounded text-cyan-600 focus:ring-cyan-500"
                        onchange={() => toggleItemChecked(item.id, item.checked)}
                      />
                      <span class="ml-2 text-gray-700 {item.checked ? 'line-through text-gray-400' : ''}">
                        {item.name}
                      </span>
                    </label>
                  {/each}
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
                                    onclick={() => handleRemoveHighlight(highlight.id)}
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
                                oninput={searchUsers}
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
                    <Button color="alternative" onclick={() => addMemberModalOpen = false}>
                        Cancel
                    </Button>
                    <Button color="success" onclick={inviteMember}>
                        Send Invitation
                    </Button>
                </div>
            </div>
        </Modal>

        <Modal bind:open={confirmDeleteModalOpen} size="md" autoclose={false}>
            <div class="text-center p-6">
              <Trash class="mx-auto mb-4 text-red-500 w-12 h-12" />
              <h3 class="mb-5 text-lg font-semibold text-gray-700">
                Confirm Deletion
              </h3>
              <p class="text-gray-500 mb-6">
                Are you sure you want to delete this trip? This action cannot be undone.
              </p>
              <div class="flex justify-center gap-4">
                <Button color="alternative" onclick={() => confirmDeleteModalOpen = false}>
                  Cancel
                </Button>
                <Button color="red" onclick={async () => {
                  confirmDeleteModalOpen = false;
                  await deleteTrip();
                }}>
                  Yes, Delete
                </Button>
              </div>
            </div>
          </Modal>

        <!-- Share Trip Modal -->
        <Modal bind:open={shareTripModalOpen} size="md" autoclose={false} class="w-full"
        on:open={() => {
            loadActivities();
            loadHighlights();
        }} >
            <div class="flex items-center justify-center h-full">
                <div class="flex flex-col items-center gap-6 bg-cyan-50 p-6 rounded-lg shadow-md max-w-md w-full">
                    {#if tripData.imageUrl}
                    <img
                        src={tripData.imageUrl}
                        alt="{tripData.title}"
                        class:blue-sm={!imageLoaded}
                        class:scale-105={!imageLoaded}
                        onload={() => (imageLoaded = true)}
                    />
                    {:else}
                    <img
                        src="https://source.unsplash.com/400x300/?travel"
                        alt="Travel"
                        class:blue-sm={!imageLoaded}
                        class:scale-105={!imageLoaded}
                        onload={() => (imageLoaded = true)}
                    />
                    {/if}

                    <div class="flex flex-col items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        class="lucide lucide-share-icon lucide-share">
                       <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                       <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                           Share "{tripData.title}" with your friends!
                       </h3>
                    </div>
                   <p class="text-sm text-gray-500">Trips's location: {tripData.location}</p>
                   <p class="text-sm text-gray-500">Trip's dates: {formatDate(tripData.startDate)} - {formatDate(tripData.endDate)}</p>
                   
                   <div class="w-full">
                    <h4 class="text-md font-semibold text-gray-700 mb-2">Activities</h4>
                    {#if tripActivities.length > 0}
                        <ul class="list-disc list-inside text-sm text-gray-600">
                            {#each tripActivities as activity}
                                <li>{activity.title} {activity.description}</li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-sm text-gray-500">No activities available.</p>
                    {/if}
                   </div>

                    <!-- Highlights -->
            <div class="w-full mt-4">
                <h4 class="text-md font-semibold text-gray-700 mb-2">Highlights</h4>
                {#if $highlights.length > 0}
                    <ul class="list-disc list-inside text-sm text-gray-600">
                        {#each $highlights as highlight}
                            <li>{highlight.name}</li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-sm text-gray-500">No highlights available.</p>
                {/if}
            </div>

                   <div class="flex justify-center gap-4">
                    <Button color="alternative" onclick={() => shareTripModalOpen = false}>
                        Close
                    </Button>
                    <Button color="green" onclick={shareTrip}>
                        Share This Trip
                    </Button>
                    </div>
                </div>
            </div>
        </Modal>

        <!-- Setting Trip Modal -->
         <Modal bind:open={settingsModalOpen} size="md" autoclose={false} class="w-full">
            
            <div class="text-center">
                <Settings class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Trip Settings
                </h3>

                <!-- Delete Trip -->
                <div class="mb-4">
                    <Label for="deleteTrip" class="mb-2">Delete Trip</Label>
                    <p class="text-sm text-gray-500">This action cannot be undone.</p>
                    <Button color="red" onclick={() => confirmDeleteModalOpen = true}>
                        Delete Trip
                    </Button>
                </div>
                
                <!-- Settings Content -->
                <div class="flex justify-center gap-4">
                    <Button color="alternative" onclick={() => settingsModalOpen = false}>
                        Close
                    </Button>
                </div>
            </div>
         </Modal>

    {/if}
    
    </div>
</div>