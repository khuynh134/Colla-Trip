<script lang="ts">
    import { onMount } from 'svelte';
    import { Mail } from 'lucide-svelte'; // Import Ticket icon
  
    // Props
    export let sidebarExtended = false;
    export let sidebarWidth = '80px';
    export let createFormOpen = false;
  
    let sidebarTransition = '';
    let invitedMembers: string[] = [''];

    // Notification count for trip polling (Example: Unread notifications)
    let tripPollNotifications = 3; // Dynamic value, adjust based on logic
  
    // Initialize sidebar transition on mount
    onMount(() => {
      sidebarTransition = 'transition-all duration-500 ease-in-out';
    });
  
    // Sidebar functions
    function toggleSidebar(): void {
      sidebarExtended = !sidebarExtended;
      sidebarWidth = sidebarExtended ? '300px' : '80px';
    }
  
    function handleCreateTripClick(event: MouseEvent): void {
      event.preventDefault();
      createFormOpen = true;
    }

    function closeCreateForm(): void {
      createFormOpen = false;
    }

    function addNewMemberField(): void {
      if (invitedMembers[invitedMembers.length - 1].trim() !== '') {
        invitedMembers = [...invitedMembers, ''];
      }
    }

    function updateMember(index: number, value: string): void {
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

       <!-- Notifications (Envelope Icon) -->
<a href="/trip-polling-notifications" class="relative flex items-center p-3 mt-4 hover:bg-blue-600 rounded-lg transition-colors">
  <div class="relative">
      <!-- Envelope Icon for Notifications -->
      <Mail class="w-7 h-7 text-white group-hover:text-gray-200 transition-colors" />

      <!-- Notification Badge -->
      {#if tripPollNotifications > 0}
          <span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {tripPollNotifications}
          </span>
      {/if}
  </div>

  <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
      <span class="text-lg">Notifications</span>
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
          <a href="/calendarpage" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Schedule">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
            </div>
            <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
              <span class="text-lg">Schedule</span>
            </div>
          </a> 

          <!-- Activity/ Voting  -->
           <a href="/activitypage" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-vote"><path d="m9 12 2 2 4-4"/>
                <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
            </div>
            <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
              <span class="text-lg">Activity</span>
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
        <p class="block text-sm font-medium text-gray-700 mb-2">Invite Members</p>
        {#each invitedMembers as member, index}
          <div class="flex gap-2 mb-2">
            <label for="member-{index}" class="flex-1">
              <span class="sr-only">Member {index + 1} email</span>
              <input
                type="email"
                id="member-{index}"
                name="member-{index}"
                placeholder="Enter email address"
                value={member}
                on:input={(e: Event) => updateMember(index, (e.target as HTMLInputElement).value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
              />
            </label>
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
  <button 
    type="button"
    class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 cursor-default"
    on:click={closeCreateForm}
    on:keydown={(e) => e.key === 'Escape' && closeCreateForm()}
    aria-label="Close modal overlay"
  ></button>
{/if}