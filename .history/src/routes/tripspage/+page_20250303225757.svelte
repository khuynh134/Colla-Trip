<script lang="ts">
    //import '../../app.css';
    
    import { goto } from '$app/navigation';
    import { Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    import { 
        Luggage,
        Calendar,
        Receipt,
        MapPin,
        BadgeDollarSign,
        Vote,
        User
    } from 'lucide-svelte';

    import { Tabs, TabItem } from 'flowbite-svelte'; 

    // State management for sidebar
    let sidebarExtended = false;
    let sidebarWidth = '80px';
    let createFormOpen = false;

    const packingItems = ['Passport', 'Clothes', 'Toiletries', 'Medications', 'Phone Charger', 'Camera'];

    //state for polling notifications
    let pollNotifications = 3;

</script>



<div class="min-h-screen bg-[#85e9eb]">
    <Sidebar 
        bind:sidebarExtended 
        bind:sidebarWidth 
        bind:createFormOpen
    />

    <div class="transition-all duration-500 ease-in-out"
        style="margin-left: {sidebarWidth};"
    >
     <!-- Trip Header -->
<div class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">
        <div class="flex flex-col">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 text-cyan-700">Summer in Japan</h1>
                    <div class="mt-2 flex items-center text-gray-500 space-x-4">
                        <div class="flex items-center space-x-2">
                            <MapPin class="w-6 h-6" />
                            <span>Tokyo, Japan</span>
                        </div>
                        <div class="flex items-center">
                            <Calendar class="w-6 h-6" />
                            Jun 15 - Jun 22, 2025
                        </div>
                        <div class="flex items-center">
                            <User class="h-4 w-4 mr-1" />
                            4 travelers
                        </div>
                    </div>
                </div>
                <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Share Trip 
                </button>
            </div>

            <!-- Filing Tabs (Moved Below Trip Name) -->
            <Tabs tabStyle="underline" 
                class="mt-6 flex w-full justify-between bg-gray-100 rounded-t-lg shadow-md"
            >
                <!-- Schedule Tab -->
                <TabItem open>
                    <span slot="title" class="flex flex-col items-center p-4 bg-white rounded-t-lg border-b-4 border-transparent hover:border-blue-500 transition">
                        <Calendar class="w-8 h-8 text-gray-500 group-hover:text-blue-500 transition-colors"/>
                        <span class="mt-1 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Schedule</span>
                    </span>
                </TabItem>

                <!-- Budget Tab -->
                <TabItem>
                    <span slot="title" class="flex flex-col items-center p-4 bg-white rounded-t-lg border-b-4 border-transparent hover:border-blue-500 transition">
                        <Receipt class="w-8 h-8 text-gray-500 group-hover:text-blue-500 transition-colors"/>
                        <span class="mt-1 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Budget</span>
                    </span>
                </TabItem>

                <!-- Packing Tab -->
                <TabItem>
                    <span slot="title" class="flex flex-col items-center p-4 bg-white rounded-t-lg border-b-4 border-transparent hover:border-blue-500 transition">
                        <Luggage class="w-8 h-8 text-gray-500 group-hover:text-blue-500 transition-colors"/>
                        <span class="mt-1 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Packing</span>
                    </span>
                </TabItem>

                <!-- Polling Tab -->
                <TabItem>
                    <span slot="title" class="relative flex flex-col items-center p-4 bg-white rounded-t-lg border-b-4 border-transparent hover:border-blue-500 transition">
                        <Vote class="w-8 h-8 text-gray-500 group-hover:text-blue-500 transition-colors"/>
                
                        <!-- Notification Badge (only shows if there are notifications) -->
                        {#if pollNotifications > 0}
                            <span class="absolute -top-1 right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {pollNotifications}
                            </span>
                        {/if}

                        <span class="mt-1 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Polling</span>
                    </span>
                </TabItem>
            </Tabs>
        </div>
    </div>
</div>
   