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
                 <!-- Create Trip Form Panel -->
<div 
class="fixed inset-0 flex items-center justify-center z-50"
style="visibility: {createFormOpen ? 'visible' : 'hidden'};"
>
<div 
  class="bg-white rounded-lg shadow-lg w-[500px] transform transition-transform duration-300 ease-in-out {createFormOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}"
>
  <div class="p-6">
    <!-- Form Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Create New Trip</h2>
      <button 
        type="button"
        on:click={closeCreateForm}
        class="text-gray-500 hover:text-gray-700"
        aria-label="Close form"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Form Content -->
    <form class="space-y-6" on:submit={handleSubmitTrip}>
      <div>
        <label for="tripName" class="block text-sm font-medium text-gray-700 mb-2">
          Trip Name
        </label>
        <input
          type="text"
          id="tripName"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
          placeholder="Enter trip name"
        />
      </div>

      <div>
        <label for="tripStartDate" class="block text-sm font-medium text-gray-700 mb-2">
          Trip Start Date
        </label>
        <input
          type="Date"
          id="tripStartDate"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
        />
      </div>

      <div>
        <label for="tripEndDate" class="block text-sm font-medium text-gray-700 mb-2">
          Trip End Date
        </label>
        <input
          type="Date"
          id="tripEndDate"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Invite Members
        </label>
        {#each invitedMembers as member, index}
          <div class="flex gap-2 mb-2">
            <input
              type="email"
              placeholder="Enter email address"
              value={member}
              on:input={(e) => updateMember(index, e.target.value)}
              class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
            />
            {#if index === invitedMembers.length - 1}
              <button
                type="button"
                on:click={addNewMemberField}
                class="bg-[#3598db] text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Add member"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            {/if}
          </div>
        {/each}
      </div>

      <button
        type="submit"
        class="w-full bg-[#3598db] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create Trip
      </button>
    </form>
  </div>
</div>
</div>

<!-- Overlay -->
{#if createFormOpen}
<div 
  class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
  on:click={closeCreateForm}
></div>
{/if}

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
