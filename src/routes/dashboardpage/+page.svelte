<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { onMount } from 'svelte';
  import { user as userStore, isAuthenticated } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { createFormOpen } from '$lib/stores/createFormStore';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { auth } from '$lib/firebase';
  
  // State management for sidebar only
  let sidebarExtended = false;
  let sidebarWidth = '80px';

  let formError: string | null = null;


  let recentTrips = $state([]);
  let loading = true;
  let error = $state<string | null>(null);

    // Fetch recent trips from the server
 async function fetchRecentTrips() {
 try {
   loading = true;
   error = null;
  
   // Get auth token if available
   let headers: Record<string, string> = {
     'Content-Type': 'application/json'
   };
  
   if (auth.currentUser) {
     const token = await auth.currentUser.getIdToken(true);
     headers['Authorization'] = `Bearer ${token}`;
   }
  
   const response = await fetch('/api/recent-trips', {
     method: 'GET',
     headers
   });
  
   if (!response.ok) {
     throw new Error('Failed to fetch recent trips');
   }
  
   recentTrips = await response.json();
 } catch (err) {
   error = err instanceof Error ? err.message : 'An unknown error occurred';
   console.error('Error fetching recent trips:', err);
 } finally {
   loading = false;
 }
}


async function ensureSession() {
 if (!browser || !$isAuthenticated || !auth.currentUser) return;
  try {
   // Get a fresh token and create a session cookie
   const token = await auth.currentUser.getIdToken(true);
  
   await fetch('/api/auth/session', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     }
   });
  
   console.log('Session established');
 } catch (error) {
   console.error('Error establishing session:', error);
 }
}


 // Format date function
 function formatDate(dateString) {
   const options = { year: 'numeric', month: 'long', day: 'numeric' };
   return new Date(dateString).toLocaleDateString(undefined, options);
}

  

  
  const handleSubmit: SubmitFunction = async ({ formData }) => {
    try {
      formError = null;
      const currentUser = $userStore;
        if (!currentUser) throw new Error('Not logged in');
        const token = await (currentUser as import('firebase/auth').User).getIdToken();
        formData.append('idToken', token);
      // Perform your custom submission logic here
      console.log('Form submitted with:', formData);
    } catch (err) {
      formError = err instanceof Error ? err.message : 'Submission failed';
    }
  };

   // Navigate to trips
 async function navigateToTrips() {
   if (!auth.currentUser) {
   goto('/loginpage');
   return;
   }
   goto('/totaltripspage');
 }



    // Redirect if not logged in (backup to layout protection)
    onMount(() => {
        if (!$isAuthenticated) {
            goto('/loginpage');
        }
    });

    function handleCreateClick() {
      createFormOpen.set(true);
    }
    /*
  // Sample trip data for recent trips
  const recentTrips = [
    { 
      id: 1, 
      title: 'Summer in Japan', 
      destination: 'Tokyo, Japan', 
      dates: 'Jun 15 - Jun 22, 2025',
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop'
    },
    { 
      id: 2, 
      title: 'Paris Weekend', 
      destination: 'Paris, France', 
      dates: 'Apr 10 - Apr 14, 2025',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1887&auto=format&fit=crop'
    },
    { 
      id: 3, 
      title: 'New York City', 
      destination: 'New York, USA', 
      dates: 'May 1 - May 7, 2025',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop'
    }
  ];
*/
  // Data for trip activity chart
  const tripActivityData = [
    { month: 'Jan', trips: 1 },
    { month: 'Feb', trips: 0 },
    { month: 'Mar', trips: 2 },
    { month: 'Apr', trips: 1 },
    { month: 'May', trips: 0 },
    { month: 'Jun', trips: 1 }
  ];

  // User data
  const userData = {
    name: 'Sophie Martinez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    stats: {
      totalTrips: 5,
      upcomingTrips: 2,
      nextDestination: 'Paris, France',
      monthlyIncrease: 2,
      countriesVisited: 7
    }
  };

  // Initialize trip activity chart
  let chartRendered = false;
  
  onMount(() => {
    renderTripActivityChart();
  });

  function renderTripActivityChart() {
    if (typeof window !== 'undefined' && !chartRendered) {
      // This would normally use a chart library
      // For this example, we'll use a simple DOM-based bar chart
      setTimeout(() => {
        const chartContainer = document.getElementById('trip-activity-chart');
        if (chartContainer) {
          let maxTrips = Math.max(...tripActivityData.map(d => d.trips));
          let html = `<div class="flex items-end h-40 space-x-4">`;
          
          tripActivityData.forEach(data => {
            const height = data.trips === 0 ? 4 : (data.trips / maxTrips) * 100;
            html += `
              <div class="flex flex-col items-center flex-1">
                <div class="w-full bg-blue-500 rounded-t-md" style="height: ${height}%"></div>
                <div class="mt-2 text-xs font-medium">${data.month}</div>
                <div class="text-sm font-bold">${data.trips}</div>
              </div>
            `;
          });
          
          html += `</div>`;
          chartContainer.innerHTML = html;
          chartRendered = true;
        }
      }, 100);
    }
  }

  // Quick actions
  const quickActions = [
    { title: 'New Trip', icon: 'plus', color: 'bg-blue-500' },
    { title: 'My Trips', icon: 'briefcase', color: 'bg-purple-500' },
    { title: 'Calendar', icon: 'calendar', color: 'bg-green-500' },
    { title: 'Settings', icon: 'cog', color: 'bg-gray-500' }
  ];

  // Navigate to trip detail page
  function goToTripDetail(id: number) {
    // Navigation logic would go here
    alert(`Navigating to trip ${id}`);
  }
</script>


<div class="min-h-screen bg-gray-50">
  <Sidebar 
    bind:sidebarExtended 
    bind:sidebarWidth 
   
  />

  <!-- Main Content -->
  <div
    class="transition-all duration-500 ease-in-out"
    style="margin-left: {sidebarWidth};"
  >
    <div class="px-4 sm:px-8 max-w-7xl mx-auto">
      <!-- Welcome Section with Search -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-12 mb-8">
        <div class="flex items-center">
          <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <img src={userData.avatar} alt="User avatar" class="h-12 w-12 rounded-full" />
          </div>
          <div>
            <h1>Welcome, {$userStore ? ($userStore.displayName || $userStore.email) : 'there'}!</h1>
            <p class="text-gray-600 mt-1">Ready to plan your next adventure?</p>
          </div>
        </div>
        <div class="w-full md:w-1/3">
          <div class="relative">
            <input
              type="text"
              placeholder="Search trips..."
              class="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search trips"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {#each quickActions as action}
          {#if action.title === 'New Trip'}
            <Card class="p-4 shadow-md hover:shadow-lg transition-shadow">
             <button
                type="button"
                class="w-full h-full cursor-pointer"
                on:click={() => {createFormOpen.set(true)}}
              >
                <div class="flex flex-col items-center text-center">
                  <div class="bg-blue-500 text-white p-3 rounded-lg mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span class="font-medium">New Trip</span>
                </div>
              </button>
            </Card>
          {:else}
        <Card
          class="p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          on:click={() => {
            if (action.title === 'My Trips') {
              goto ('/tripspage');
            } else if (action.title === 'Calendar') {
              goto('/calendarpage');
            } else if (action.title === 'Settings') {
              goto('/settings');
    }
  }}
 >
            <div class="flex flex-col items-center text-center">
              <div class="{action.color} text-white p-3 rounded-lg mb-3">
                {#if action.icon === 'plus'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                {:else if action.icon === 'briefcase'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                {:else if action.icon === 'calendar'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                {:else if action.icon === 'cog'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                {/if}
              </div>
              <span class="font-medium">{action.title}</span>
            </div>
          </Card>
          {/if}
        {/each}
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card class="p-6 shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-semibold mb-1">Total Trips</h3>
              <div class="text-3xl sm:text-4xl font-bold">{userData.stats.totalTrips}</div>
              <div class="text-green-500 font-medium mt-2">+{userData.stats.monthlyIncrease} this month</div>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card class="p-6 shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-semibold mb-1">Upcoming Trips</h3>
              <div class="text-3xl sm:text-4xl font-bold">{userData.stats.upcomingTrips}</div>
              <div class="text-blue-500 font-medium mt-2">Next: {userData.stats.nextDestination}</div>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card class="p-6 shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-semibold mb-1">Countries Visited</h3>
              <div class="text-3xl sm:text-4xl font-bold">{userData.stats.countriesVisited}</div>
              <div class="text-gray-500 font-medium mt-2">View passport</div>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2.5M15 11.75h-3.5M6.055 7L6 7.8M19 7l-.955.8" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11v4m4-7v7m4-4v4m-8-4v3" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <!-- Two Column Section: Chart and Recent Trips -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Trip Activity Chart -->
        <Card class="p-6 shadow-lg">
          <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
          <div id="trip-activity-chart">
            <!-- Chart will be rendered here -->
            <div class="flex justify-center items-center h-40 bg-gray-50">
              <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </Card>

        <!-- Recent Trips -->
        <Card class="p-6 shadow-lg">
          <h3 class="text-xl font-semibold mb-6">Recent Trips</h3>
          <div class="space-y-4">
            {#if loading}
              <div class="animate-pulse">
                <div class="h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div class="h-16 bg-gray-200 rounded-lg mb-4"></div>
              </div>
            {:else if error}
              <div class="text-red-500">{error}</div>
            {:else if recentTrips.length > 0}
              {#each recentTrips as trip}
                <div
                  class="flex items-center border-b border-gray-100 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  on:click={() => goto(`/tripspage/${trip.id}`)}
                >
                  <!-- ... trip item content ... -->
                </div>
              {/each}
              <button
                class="text-blue-500 font-medium hover:text-blue-600 transition-colors flex items-center mt-2"
                on:click={() => goto('/totaltripspage')}
              >
                <span>View all trips</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            {:else}
              <div class="text-gray-500 p-4 text-center">
                <p>No trips found. Create your first trip to get started!</p>
                <button
                  class="mt-4 text-blue-500 hover:text-blue-600"
                  on:click={() => goto('/create-trip')}
                >
                  Create a trip
                </button>
              </div>
            {/if}
          </div>
        </Card>
      </div>

      <!-- Destination Inspiration -->
      <Card class="p-6 shadow-lg mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">Destination Inspiration</h3>
          <button class="text-blue-500 hover:text-blue-600 text-sm font-medium">View all</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {#each ['Bali, Indonesia', 'Santorini, Greece', 'Kyoto, Japan'] as destination, i}
            <div class="rounded-lg overflow-hidden relative h-48 group cursor-pointer">
              <img 
                src={`https://source.unsplash.com/featured/300x200?${destination.split(',')[0].toLowerCase()}`} 
                alt={destination} 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div class="text-white">
                  <h4 class="font-bold text-lg">{destination}</h4>
                  <p class="text-sm text-gray-200">Trending destination</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </div>
</div>
