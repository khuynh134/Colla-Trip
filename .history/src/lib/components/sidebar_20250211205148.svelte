<script lang="ts">
    import { onMount } from 'svelte';
  
    // Props
    export let sidebarExtended = false;
    export let sidebarWidth = '80px';
    export let createFormOpen = false;
  
    let sidebarTransition = '';
    let invitedMembers: string[] = [''];
  
    // Initialize sidebar transition on mount
    onMount(() => {
      sidebarTransition = 'transition-all duration-500 ease-in-out';
    });
  
    // Sidebar functions
    function toggleSidebar() {
      sidebarExtended = !sidebarExtended;
      sidebarWidth = sidebarExtended ? '300px' : '80px';
    }
  
    function handleCreateTripClick(event: MouseEvent): void {
  event.preventDefault();
  createFormOpen = true;
}

    function closeCreateForm() {
    createFormOpen = false;
  }

  function addNewMemberField() {
    if (invitedMembers[invitedMembers.length - 1].trim() !== '') {
      invitedMembers = [...invitedMembers, ''];
    }
  }

  function updateMember(index: number, value: string) {
    invitedMembers[index] = value;
    invitedMembers = [...invitedMembers];
  }

  function handleSubmitTrip(event: SubmitEvent): void {
  event.preventDefault();
  closeCreateForm();
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
           type="date"
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
           type="date"
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