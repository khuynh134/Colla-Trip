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
     </div>v

     
    
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
