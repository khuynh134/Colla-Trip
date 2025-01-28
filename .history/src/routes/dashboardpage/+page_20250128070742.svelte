<script lang="ts">
    import { onMount } from 'svelte';
    let sidebarExtended = false;
    let sidebarWidth = '64px';
    let sidebarTransition = '';
  
    onMount(() => {
      sidebarTransition = 'transition-all duration-300';
    });
  
    function toggleSidebar() {
      sidebarExtended = !sidebarExtended;
      sidebarWidth = sidebarExtended ? '200px' : '64px';
    }
  </script>
  
  <div class="min-h-screen bg-gray-50">
    <!-- Left Sidebar -->
    <nav 
      class="fixed left-0 top-0 h-full bg-[#3598db] text-white p-4 flex flex-col {sidebarTransition}"
      style="width: {sidebarWidth};"
      on:mouseenter={toggleSidebar}
      on:mouseleave={toggleSidebar}
    >
      <div class="flex items-center mb-8">
        <img src="/Colla-TripLogo-rem.png" alt="Logo" class="w-12 h-12">
        {#if sidebarExtended}
          <span class="text-xl font-bold ml-4">Colla-Trip</span>
        {/if}
      </div>
  
      <div class="space-y-4">
        <a href="/dashboard" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
          <!-- Dashboard Icon -->
          {#if sidebarExtended}
            <span class="text-lg ml-4">Dashboard</span>
          {/if}
        </a>
        <a href="/trips" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
          <!-- Trips Icon -->
          {#if sidebarExtended}
            <span class="text-lg ml-4">Trips</span>
          {/if}
        </a>
        <!-- Add the rest of the sidebar items -->
      </div>
    </nav>
  
    <!-- Main Content -->
    <div 
      class="ml-64 p-6 sm:p-12 {sidebarTransition}"
      style="margin-left: {sidebarWidth};"
    >
        <div class="px-8">
            <!-- Search Bar -->
            <div class="mb-8">
                <input 
                    type="text" 
                    placeholder="Search trips..." 
                    class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                />
            </div>
 
            <div class="flex justify-between items-center mb-12 pt-8">
                <div>
                    <h1 class="text-3xl font-bold">Welcome Back,</h1>
                    <p class="text-xl text-gray-600 mt-2">User Name</p>
                </div>
                <button class="bg-[#3598db] text-white px-12 py-3 rounded-lg text-lg">
                    Create Trip
                </button>
            </div>
 
            <div class="grid grid-cols-2 gap-8 mb-12">
                <Card class="p-8 shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Total Trips</h3>
                    <div class="text-4xl font-bold">5</div>
                    <div class="text-green-500 text-lg mt-2">+2 this month</div>
                </Card>
                <Card class="p-8 shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Upcoming Trips</h3>
                    <div class="text-4xl font-bold">2</div>
                    <div class="text-blue-500 text-lg mt-2">Next: Paris, France</div>
                </Card>
            </div>
 
            <Card class="p-8 shadow-lg">
                <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
                <!-- Chart component -->
            </Card>
        </div>
    </div>
 </div>