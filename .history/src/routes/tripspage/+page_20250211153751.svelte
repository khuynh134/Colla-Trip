<script>
    //import '../../app.css';

    import { goto } from '$app/navigation';


    import Luggage from 'lucide-svelte/icons/luggage'; 
    import Calendar from 'lucide-svelte/icons/calendar'; 
    import Receipt from 'lucide-svelte/icons/receipt';
    import MapPin from 'lucide-svelte/icons/map-pin';
    import BadgeDollarSign from 'lucide-svelte/icons/badge-dollar-sign';
    import Vote from 'lucide-svelte/icons/vote';
    import User from 'lucide-svelte/icons/user';

    import { Tabs, TabItem } from  'flowbite-svelte'; 

    const packingItems = ['Passport', 'Clothes', 'Toiletries', 'Medications', 'Phone Charger', 'Camera'];

</script>

<div class="min-h-screen bg-[#85e9eb]">
    <!-- Trip Header -->
     <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 text-cyan-700">Summer in Japan</h1>
                    <div class="mt-2 flex items-center text-gray-500 space-x-4">
                        <div class="flex items-center space-x-2">
                            <MapPin class="w-6 h-6" />
                            <span> Tokyo, Japan</span>
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
        </div>
     </div>

     <!-- Left Sidebar -->
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
      <a href="/create-trip" class="flex items-center p-1 hover:bg-blue-600 rounded-lg transition-colors" on:click={handleCreateTripClick}>
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


    
     <!-- Widgets Section -->
     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Budget Widget -->
                <div class="bg-white border-2 border-cyan-500 rounded-lg shadow p-7">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-lg font-semibold text-cyan-700">Budget</h2>
                        <BadgeDollarSign class="w-6 h-6 text-gray-400" />
                    </div>
                    <div class="text-3xl font-bold mb-2">$2,450</div>
                    <div class="text-sm text-gray-500">of $3,000 budget</div>
                    <div class="mt-2 h-4 bg-gray-200 rounded-full">
                        <div class="h-full bg-cyan-600 rounded-full" style="width: 81%"></div>
                    </div>
                </div>

                <!-- Packing lists Widget -->
                 <div class="bg-white rounded-lg shadow p-7">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-lg font-semibold text-cyan-700">Packing List</h2>
                        <Luggage class="w-6 h-6 text-gray-400" />
                    </div>
                    <div class="space-y-3">
                        {#each packingItems as item} 
                            <label class="flex items-center space-x-2">
                                <input type="checkbox" class="rounded text-blue-500" />
                                <span class="ml-2 text-gray-700">{item}</span>
                            </label>
                        {/each}
                    </div>
                 </div>
            </div>

     </div>

     <!-- Main Content -->
    <div class="w-128 max-h-auto mx-auto px-2 pt-1 pb-1.5 sm:px-6 lg:px-8">

        <div class="flex flex-col justify-between items-normal">
         <!-- Trip Tabs -->
            <Tabs tabStyle="underline" 
            class="border-b-2 [--tab-underline:theme(colors.blue.600)] [--tab-underline-hover:theme(colors.blue.400)] 
            [--tab-text-hover:them(colors.blue.600)]  [--tab-underline-height:2] [--tab-text-size:1.125rem]"
            >

         <!-- Schedule Tab -->
            <TabItem open>
                <div slot="title" class="flex items-center gap-2">
                    <Calendar class="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors shadow-xl" />
                    <div class="group-hover:text-blue-600 transition-colors">Schedule</div>
                   
                </div>
                <div class="bg-cyan-200/50 rounded-lg shadow p-2 mx-4">
                    <p class="text-sm text-gray-500">
                        <b>Schedule:</b>
                             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                </div>
             </TabItem>


             <!-- Budget Tab -->
              <TabItem>
                <span slot="title" class="flex items-center gap-2">
                    <Receipt class="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors"/>
                    <div class="group-hover:text-blue-600 transition-colors">Budget</div>
                </span>
                <div class="bg-cyan-200/50 rounded-lg shadow p-2 mt-4">
                    <p class="text-sm text-gray-500">
                        <b>Budeget:</b>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                </div>
              </TabItem>

              <!-- Packing Tab -->
                <TabItem>
                    <span slot="title" class="flex items-center gap-2">
                        <Luggage class="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors"/>
                        <div class="group-hover:text-blue-600 transition-colors">Packing</div>
                    </span>
                    <div class="bg-cyan-200/50 rounded-lg shadow p-2 mt-4">
                        <p class="text-sm text-gray-500">
                            <b>Packing:</b>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
    
                    </div>
                </TabItem>

            <!-- Polling Tab -->
             <TabItem>
                <span slot="title" class="flex items-center gap-2">
                    <Vote class="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors"/>
                    <div class="group-hover:text-blue-600 transition-colors">Polling</div>
                </span>
                <div class="bg-cyan-200/50 rounded-lg shadow p-2 mt-4">
                    <p class = "text-sm text-gray-500">
                        <b>Polling:</b>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>
             </TabItem>
            </Tabs>
        </div>
    </div>
</div>
