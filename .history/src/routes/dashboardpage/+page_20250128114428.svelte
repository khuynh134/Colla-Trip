<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { Home, MapPin, CheckSquare, Calendar, CreditCard, Briefcase } from 'lucide-svelte';
    let isSidebarOpen = false;
    let activeIcon = '';

    function openSidebar(icon: string) {
        isSidebarOpen = true;
        activeIcon = icon;
    }

    function closeSidebar() {
        isSidebarOpen = false;
        activeIcon = '';
    }
</script>

<div class="min-h-screen bg-gray-50 flex">
    <!-- Icon Sidebar -->
    <nav class="fixed left-0 top-0 h-full w-20 p-4 bg-gradient-to-b from-[#3598db] to-[#2c3e50] text-white z-10">
        <div class="flex justify-center mb-12 mt-8">
            <img src="/Colla-TripLogo-rem.png" alt="Logo" class="w-12 h-12">
        </div>
        
        <div class="space-y-6 mt-8">
            <a href="/overview" class="flex flex-col items-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={() => openSidebar('overview')} on:mouseleave={closeSidebar}>
                <Home class="w-6 h-6" />
                <span class="text-xs mt-2">Overview</span>
            </a>
            <a href="/trips" class="flex flex-col items-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={() => openSidebar('trips')} on:mouseleave={closeSidebar}>
                <MapPin class="w-6 h-6" />
                <span class="text-xs mt-2">Trips</span>
            </a>
            <a href="/polls" class="flex flex-col items-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={() => openSidebar('polls')} on:mouseleave={closeSidebar}>
                <CheckSquare class="w-6 h-6" />
                <span class="text-xs mt-2">Polls</span>
            </a>
            <a href="/schedule" class="flex flex-col items-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={() => openSidebar('schedule')} on:mouseleave={closeSidebar}>
                <Calendar class="w-6 h-6" />
                <span class="text-xs mt-2">Schedule</span>
            </a>
            <a href="/budget" class="flex flex-col items-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={() => openSidebar('budget')} on:mouseleave={closeSidebar}>
                <CreditCard class="w-6 h-6" />
                <span class="text-xs mt-2">Budget</span>
            </a>
            <a href="/packing" class="flex flex-col items-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={() => openSidebar('packing')} on:mouseleave={closeSidebar}>
                <Briefcase class="w-6 h-6" />
                <span class="text-xs mt-2">Packing</span>
            </a>
        </div>
    </nav>

    <!-- Hover Sidebar -->
    {#if isSidebarOpen}
        <div class="fixed left-20 top-0 h-full w-60 p-8 bg-white shadow-lg transition-all duration-300 z-20 mt-16">
            <div class="space-y-6">
                {#if activeIcon === 'overview'}
                    <a href="/overview" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                        <Home class="w-6 h-6 mr-4" />
                        <span class="text-lg">Overview</span>
                    </a>
                {:else if activeIcon === 'trips'}
                    <a href="/trips" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                        <MapPin class="w-6 h-6 mr-4" />
                        <span class="text-lg">Trips</span>
                    </a>
                {:else if activeIcon === 'polls'}
                    <a href="/polls" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                        <CheckSquare class="w-6 h-6 mr-4" />
                        <span class="text-lg">Polls</span>
                    </a>
                {:else if activeIcon === 'schedule'}
                    <a href="/schedule" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                        <Calendar class="w-6 h-6 mr-4" />
                        <span class="text-lg">Schedule</span>
                    </a>
                {:else if activeIcon === 'budget'}
                    <a href="/budget" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                        <CreditCard class="w-6 h-6 mr-4" />
                        <span class="text-lg">Budget</span>
                    </a>
                {:else if activeIcon === 'packing'}
                    <a href="/packing" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                        <Briefcase class="w-6 h-6 mr-4" />
                        <span class="text-lg">Packing Lists</span>
                    </a>
                {/if}
            </div>
        </div>
    {/if}
    
      <!-- Main Content -->
      <div 
        class="ml-64 p-6 sm:p-12 {sidebarTransition}"
        style="margin-left: {sidebarWidth};"
      >
        <div class="px-4 sm:px-8">
          <!-- Search Bar -->
          <div class="mb-8">
            <input 
              type="text" 
              placeholder="Search trips..." 
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
            />
          </div>
    
          <div class="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 pt-4 sm:pt-8">
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl sm:text-3xl font-bold">Welcome Back,</h1>
              <p class="text-lg sm:text-xl text-gray-600 mt-2">User Name</p>
            </div>
            <button class="bg-[#3598db] text-white px-8 sm:px-12 py-3 rounded-lg text-lg">
              Create Trip
            </button>
          </div>
    
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
    
          <Card class="p-6 sm:p-8 shadow-lg">
            <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
            <!-- Chart component -->
          </Card>
        </div>
      </div>
    </div>