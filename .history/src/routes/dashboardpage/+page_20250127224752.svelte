<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { Home, MapPin, CheckSquare, Calendar, CreditCard, Briefcase } from 'lucide-svelte';
    let isSidebarOpen = false;

    function openSidebar() {
        isSidebarOpen = true;
    }

    function closeSidebar() {
        isSidebarOpen = false;
    }
</script>

<div class="min-h-screen bg-gray-50 flex">
    <!-- Icon Sidebar -->
    <nav class="fixed left-0 top-0 h-full w-20 p-4 bg-gradient-to-b from-[#3598db] to-[#2c3e50] text-white">
        <div class="flex justify-center mb-12">
            <img src="/Colla-TripLogo-rem.png" alt="Logo" class="w-12 h-12">
        </div>
        
        <div class="space-y-6">
            <a href="/overview" class="flex justify-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={openSidebar} on:mouseleave={closeSidebar}>
                <Home class="w-6 h-6" />
            </a>
            <a href="/trips" class="flex justify-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={openSidebar} on:mouseleave={closeSidebar}>
                <MapPin class="w-6 h-6" />
            </a>
            <a href="/polls" class="flex justify-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={openSidebar} on:mouseleave={closeSidebar}>
                <CheckSquare class="w-6 h-6" />
            </a>
            <a href="/schedule" class="flex justify-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={openSidebar} on:mouseleave={closeSidebar}>
                <Calendar class="w-6 h-6" />
            </a>
            <a href="/budget" class="flex justify-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={openSidebar} on:mouseleave={closeSidebar}>
                <CreditCard class="w-6 h-6" />
            </a>
            <a href="/packing" class="flex justify-center p-4 hover:bg-white hover:text-[#3598db] rounded-lg transition duration-300" on:mouseenter={openSidebar} on:mouseleave={closeSidebar}>
                <Briefcase class="w-6 h-6" />
            </a>
        </div>
    </nav>

    <!-- Hover Sidebar -->
    {#if isSidebarOpen}
        <div class="fixed left-20 top-0 h-full w-60 p-8 bg-white shadow-lg transition-all duration-300">
            <div class="space-y-6">
                <a href="/overview" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                    <span class="text-lg">Overview</span>
                </a>
                <a href="/trips" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                    <span class="text-lg">Trips</span>
                </a>
                <a href="/polls" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                    <span class="text-lg">Polls</span>
                </a>
                <a href="/schedule" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                    <span class="text-lg">Schedule</span>
                </a>
                <a href="/budget" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                    <span class="text-lg">Budget</span>
                </a>
                <a href="/packing" class="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                    <span class="text-lg">Packing Lists</span>
                </a>
            </div>
        </div>
    {/if}

 
    <!-- Main Content -->
    <div class="ml-80 p-12">
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