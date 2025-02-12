<script lang="ts">
    import { onMount } from 'svelte';
  
    // Props
    export let sidebarExtended = false;
    export let sidebarWidth = '80px';
    export let createFormOpen = false;
  
    let sidebarTransition = '';
  
    // Initialize sidebar transition on mount
    onMount(() => {
      sidebarTransition = 'transition-all duration-500 ease-in-out';
    });
  
    // Sidebar functions
    function toggleSidebar() {
      sidebarExtended = !sidebarExtended;
      sidebarWidth = sidebarExtended ? '300px' : '80px';
    }
  
    function handleCreateTripClick(event: Event) {
      event.preventDefault();
      createFormOpen = true;
    }
  </script>
  
  <nav
    class="fixed left-0 top-0 h-full bg-[#3598db] text-white p-4 flex flex-col {sidebarTransition}"
    style="width: {sidebarWidth};"
    on:mouseenter={toggleSidebar}
    on:mouseleave={toggleSidebar}
    aria-label="Sidebar"
  >
    <div class="space-y-8 mt-40">
      <!-- Sidebar Links -->
      <div class="space-y-4">
        <!-- Create Trip Link -->
        <a 
          href="/create-trip" 
          class="flex items-center p-1 hover:bg-blue-600 rounded-lg transition-colors" 
          on:click={handleCreateTripClick}
        >
          <div class="bg-[#85e9eb] text-cyan rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Create Trip">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
            <span class="text-lg">Create</span>
          </div>
        </a>
  
        <!-- Dashboard Link -->
        <a href="/dashboardpage" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Dashboard">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
            <span class="text-lg">Dashboard</span>
          </div>
        </a>
  
        <!-- Other links remain the same -->
         <!-- Trips Link -->
        <a href="/tripspage" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Trips">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
              <span class="text-lg">Trips</span>
            </div>
          </a>
  
          <!-- Schedule-->
          <a href="/schedule" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Schedule">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
            </div>
            <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
              <span class="text-lg">Schedule</span>
            </div>
          </a> 
      </div>
    </div>
  </nav>