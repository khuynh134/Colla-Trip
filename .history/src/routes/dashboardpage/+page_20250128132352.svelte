<script lang="ts">
    import { onMount } from 'svelte';
    import { Card } from 'flowbite-svelte';
  
    // State for sidebar
    let sidebarExtended = false;
    let sidebarWidth = '80px';
  let sidebarTransition = '';

  // Initialize sidebar transition on mount
  onMount(() => {
    sidebarTransition = 'transition-all duration-500 ease-in-out';
  });

  // Toggle sidebar width and extended state
  function toggleSidebar() {
    sidebarExtended = !sidebarExtended;
    sidebarWidth = sidebarExtended ? '300px' : '80px';
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Left Sidebar -->
  <nav
    class="fixed left-0 top-0 h-full bg-[#3598db] text-white p-4 flex flex-col {sidebarTransition}"
    style="width: {sidebarWidth};"
    on:mouseenter={toggleSidebar}
    on:mouseleave={toggleSidebar}
    aria-label="Sidebar"
  >
    <div class="space-y-8 mt-40">
      <!-- Create Trip Link -->
      <a href="/create-trip" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
        <div class="bg-[#85e9eb] text-cyan rounded-full p-2 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Create Trip">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
          <span class="text-lg">Create</span>
        </div>
      </a>

      <!-- Dashboard Link -->
      <a href="/dashboard" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Dashboard">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
          <span class="text-lg">Dashboard</span>
        </div>
      </a>

      <!-- Trips Link -->
      <a href="/trips" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Trips">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
          <span class="text-lg">Trips</span>
        </div>
      </a>
      <!-- Add more sidebar items here -->
    </div>
  </nav>

  <!-- Main Content -->
  <div
    class="ml-64 p-6 sm:p-12 {sidebarTransition}"
    style="margin-left: {sidebarWidth};"
  >
    
      <div class="px-4 sm:px-8">
        <!-- Search Bar -->
        <div class="mt-12 mb-8">
          <input
            type="text"
            placeholder="Search trips..."
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
            aria-label="Search trips"
          />
        </div>
  
        <!-- Welcome Section -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 pt-4 sm:pt-8">
          <div class="mb-4 sm:mb-0">
            <h1 class="text-2xl sm:text-3xl font-bold">Welcome Back,</h1>
            <p class="text-lg sm:text-xl text-gray-600 mt-2">User Name</p>
          </div>
        </div>
  
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Card class="p-6 sm:p-8 shadow-lg">
            <h3 class="text-xl font-semibold mb-4">Total Trips</h3>
            <div class="text-3xl sm:text-4xl font-bold">5</div>
            <div class="text-green-500 text-lg mt-2">+2 this month</div>
          </Card>
          <Card class="p-6 sm:p-8 shadow-lg">
            <h3 class="text-xl font-semibold mb-4">Upcoming Trips</h3>
            <div class="text-3xl sm:text-4xl font-bold">2</div>
            <div class="text-blue-500 text-lg mt-2">Next: Paris, France</div>
          </Card>
        </div>
  
        <!-- Trip Activity Section -->
        <Card class="p-6 sm:p-8 shadow-lg">
          <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
          <!-- Chart component can go here -->
        </Card>
      </div>
    </div>
  </div>