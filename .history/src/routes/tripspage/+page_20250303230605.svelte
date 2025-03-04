<script lang="ts">
    import { goto } from '$app/navigation';
    import { Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { Tabs, TabItem } from 'flowbite-svelte'; 

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
        PlusCircle
    } from 'lucide-svelte';

    // State management for sidebar
    let sidebarExtended = false;
    let sidebarWidth = '80px';
    let createFormOpen = false;

    const packingItems = [
        { name: 'Passport', checked: true },
        { name: 'Clothes', checked: true },
        { name: 'Toiletries', checked: false },
        { name: 'Medications', checked: true },
        { name: 'Phone Charger', checked: false },
        { name: 'Camera', checked: false },
        { name: 'Travel Adapter', checked: false }
    ];

    // State for polling notifications
    let pollNotifications = 3;
    
    // Trip data
    const tripData = {
        title: "Summer in Japan",
        location: "Tokyo, Japan",
        dates: "Jun 15 - Jun 22, 2025",
        travelers: 4,
        budget: {
            spent: 2450,
            total: 3000,
            percentage: 81
        },
        highlights: [
            "Tokyo Disneyland",
            "Mount Fuji Day Trip",
            "Shibuya Crossing",
            "Tokyo Skytree"
        ]
    };
    
    // For the progress bar animation
    import { onMount } from 'svelte';
    let animateProgress = false;
    
    onMount(() => {
        // Trigger animation after component mounts
        setTimeout(() => {
            animateProgress = true;
        }, 300);
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
                        <div class="flex space-x-3">
                            <button class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm">
                                <Vote class="w-4 h-4" />
                                Create Poll
                            </button>
                            <button class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm">
                                <Share2 class="w-4 h-4" />
                                Share Trip 
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
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-lg font-semibold text-gray-800">Trip Schedule</h3>
                                    <button class="text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                                        <PlusCircle class="w-4 h-4" />
                                        <span>Add Event</span>
                                    </button>
                                </div>
                                
                                <div class="space-y-4">
                                    <div class="border-l-4 border-cyan-500 pl-4 py-2">
                                        <div class="text-sm text-gray-500">Day 1 - June 15</div>
                                        <div class="text-gray-800 font-medium">Arrive at Narita Airport</div>
                                        <div class="text-gray-600 text-sm">Check in at hotel in Shinjuku</div>
                                    </div>
                                    
                                    <div class="border-l-4 border-cyan-500 pl-4 py-2">
                                        <div class="text-sm text-gray-500">Day 2 - June 16</div>
                                        <div class="text-gray-800 font-medium">Tokyo Disneyland</div>
                                        <div class="text-gray-600 text-sm">Full day at the park</div>
                                    </div>
                                    
                                    <div class="border-l-4 border-cyan-500 pl-4 py-2">
                                        <div class="text-sm text-gray-500">Day 3 - June 17</div>
                                        <div class="text-gray-800 font-medium">Shibuya & Harajuku</div>
                                        <div class="text-gray-600 text-sm">Shopping and exploring</div>
                                    </div>
                                    
                                    <button class="text-cyan-600 hover:text-cyan-700 text-sm mt-2">
                                        View full schedule
                                    </button>
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
                            <div class="bg-white rounded-lg shadow-md p-6 mt-2">
                                <p class="text-gray-700">Packing list details will appear here.</p>
                            </div>
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
                                <p class="text-gray-700">Polling details will appear here.</p>
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
                        {#each packingItems as item}
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
                    <div class="space-y-3">
                        {#each tripData.highlights as highlight, i}
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <span class="text-gray-700">{highlight}</span>
                            </div>
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
    </div>
</div>