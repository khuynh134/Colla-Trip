<script lang="ts">
  import { onMount } from 'svelte';
  import { Mail } from 'lucide-svelte';
  import { isAuthenticated, logout, isLoading } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { LogIn, LogOut } from 'lucide-svelte';
  import { createFormOpen } from '$lib/stores/createFormStore';
  import { notifications } from '$lib/stores/notifications';


  import { user } from '$lib/stores/authStore';
  import { getAuth} from 'firebase/auth';
  import type { User as FirebaseUser } from 'firebase/auth';
  import type { SubmitFunction } from '@sveltejs/kit'

  // Form data variables 
  let tripName = '';
  let tripStartDate = '';
  let tripEndDate = '';
  let tripLocation = '';
  let tripTotalDays = 0;
  let formError: string | null = null; // Declare formError


  // Props
  export let sidebarExtended = false;
  export let sidebarWidth = '80px';
  export let notificationsOpen = false; // New prop to control notifications panel

  let sidebarTransition = '';
  let invitedMembers: string[] = [''];
  let isHovered = false;

  // Reactive statement to get unread notification count
  $: unreadNotificationsCount = $notifications.filter(n => !n.read).length;
  $: sidebarExtended = isHovered || notificationsOpen;
  $: sidebarWidth = sidebarExtended ? '300px' : '80px';  // Keep this as a reactive statement

  // Notification count for trip polling (Example: Unread notifications)
  let tripPollNotifications = 3; // Dynamic value, adjust based on logic

  
  $: if ( tripStartDate && tripEndDate) {
     const start = new Date(tripStartDate);
     const end = new Date(tripEndDate);
     if ( !isNaN(start.getTime()) && !isNaN(end.getTime())) {
       tripTotalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
       if ( tripTotalDays < 1) tripTotalDays = 1; //Ensure at least 1 day
     } else {
       tripTotalDays = 0;
     }
   }
  
  // Initialize sidebar transition on mount
  onMount(() => {
    sidebarTransition = 'transition-all duration-500 ease-in-out';
    console.log('Auth status on mount:', $isAuthenticated, $user);
  });

function handleMouseEnter() {
  isHovered = true;
}

function handleMouseLeave() {
  isHovered = false;
} 
  
  // Sidebar functions
  function toggleSidebar(): void {
    sidebarExtended = !sidebarExtended;
    sidebarWidth = sidebarExtended ? '300px' : '80px';
  }
  
  function handleCreateTripClick(event: MouseEvent): void {
     event.preventDefault();
     createFormOpen.set(true);
  }

  function closeCreateForm(): void {
    createFormOpen.set(false);
    invitedMembers = [''];
    // Reset form data
    tripName = '';
    tripStartDate = '';
    tripEndDate = '';
    formError = null;
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
/*
  function handleSubmitTrip(event: SubmitEvent): void {
    event.preventDefault();
    closeCreateForm();
  }
    */
  
  async function handleAuthButton(): Promise<void> {
    if ($isAuthenticated) {
      // User is logged in, log them out
      const result = await logout();
      if (result.success) {
        goto('/'); // Redirect to home page after logout
      }
    } else {
      // User is not logged in, redirect to login page
      goto('/loginpage');
    }
  }  

  function toggleNotifications() {
    notificationsOpen = !notificationsOpen;
    if (notificationsOpen) {
      notifications.markAllAsRead();
    }
  }

  function handleNotificationAction(notification) {
    if (notification.action?.href) {
      goto(notification.action.href);
    }
    notifications.markAsRead(notification.id);
    notificationsOpen = false;
  }

  async function handleManualSubmit() {
    try {
       formError = null;
       console.log('Starting manual submit..');
       console.log('Auth status:', $isAuthenticated, !!$user);

       if(!$isAuthenticated || !$user) {
         formError = 'You must be logged in to create a trip.';
         console.error('Auth failed:', { isAuthenticated: $isAuthenticated, user: $user });
         return;
       }

       //Validate required fields
       if( !tripName || !tripStartDate || !tripEndDate) {
         formError = 'Please fill in all required fields.';
         return;
       }

       const currentUser = getAuth().currentUser;
       console.log('Current Firebase user:', !!currentUser);

       if( !currentUser){
         formError = 'Firebase user not found. Please log in again.';
         return;
       }

       console.log('Getting token..');
       const token = await currentUser.getIdToken(true);
       console.log('Token obtained:', token ? 'Yes (length: ' + token.length + ')' : 'No');

       //Filter out empty member emails
       const validMembers = invitedMembers.filter(m => m.trim() !== '');


       //Calculate total days between start and end dates
       let calculatedTotalDays = 0;


       if ( tripStartDate && tripEndDate) {
         const start = new Date(tripStartDate);
         const end = new Date(tripEndDate);
         if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
           calculatedTotalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
           if( calculatedTotalDays < 1) calculatedTotalDays = 1; //Ensure at least 1 day
         }
       }

        //Create json request data
        const requestedData = {
         tripName,
         tripStartDate,
         tripEndDate,
         tripLocation,
         firebaseToken: token,
         tripTotalDays: calculatedTotalDays,
         members: validMembers
       };

       console.log('Sending fetch request with JSON...');

       const response = await fetch('api/create-trip', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(requestedData)
       });


       console.log('Response status:', response.status);


       const data = await response.json();


       if(response.ok) {
         console.log('Response data:', data);
         if(data && data.id) {
           closeCreateForm();
           console.log(`Navigating to trip page with ID: ${data.id}`);
           goto(`/tripspage/${data.id}`);
         } else {
           closeCreateForm();
           goto('/tripspage');
         }
       } else {
         formError = data.error || `Server error: ${response.status}`;
         console.error('Server error:', response.status, data);
       }
     } catch (error) {
       formError = 'An unexpected error occured.';
       console.error('Unexpected error:', error);
     }

  }


</script>

<nav
class="fixed left-0 top-0 h-full bg-[#3598db] text-white p-4 flex flex-col {sidebarTransition}"
style="width: {sidebarWidth};"
on:mouseenter={handleMouseEnter}
on:mouseleave={handleMouseLeave}
aria-label="Sidebar"
>
  <div class="space-y-8 mt-40"> 
    <!-- Sidebar Links -->
    <div class="space-y-4">
      <!-- Create Trip Link -->
      <a 
        href="/create-trip" 
        class="flex items-center p-1 hover:bg-blue-600 rounded-lg transition-colors" 
        on:click|preventDefault={handleCreateTripClick}
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
      <a 
        href="#" 
        class="relative flex items-center p-3 mt-4 hover:bg-blue-600 rounded-lg transition-colors"
        on:click|preventDefault={toggleNotifications}
      >
        <div class="relative">
          <Mail class="w-7 h-7 text-white group-hover:text-gray-200 transition-colors" />
          {#if unreadNotificationsCount > 0}
            <span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {unreadNotificationsCount}
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-vote">
            <path d="m9 12 2 2 4-4"/>
            <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
            <path d="M22 19H2"/>
          </svg>
        </div>
        <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
          <span class="text-lg">Activity</span>
        </div>
      </a>
    </div>
  </div>

  <!-- Logout Button -->
  <div class="mt-auto mb-8">
    <a 
      href={$isAuthenticated ? "/logout" : "/loginpage"} 
      on:click|preventDefault={handleAuthButton} 
      class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors"
    >
      <div>
        {#if $isAuthenticated}
          <LogOut class="h-6 w-6" aria-label="Log Out" />
        {:else}
          <LogIn class="h-6 w-6" aria-label="Log In" />
        {/if}
      </div>
      <div class="ml-4 {sidebarExtended ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500">
        <span class="text-lg">{$isAuthenticated ? 'Log Out' : 'Log In'}</span>
      </div>
    </a>
  </div>
  
</nav>

<!-- Notifications Panel -->
{#if notificationsOpen}
<div 
  class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
         {notificationsOpen ? 'translate-x-0' : 'translate-x-full'}"
  style="left: calc({sidebarWidth} + 0px);"
>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Notifications</h2>
      <button 
        on:click={() => notificationsOpen = false}
        class="text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {#if $notifications.length === 0}
      <div class="text-center text-gray-500 py-4">
        No notifications
      </div>
    {:else}
      <ul class="space-y-4">
        {#each $notifications as notification (notification.id)}
          <li 
            class="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            on:click={() => handleNotificationAction(notification)}
          >
            <div class="flex justify-between">
              <h3 class="font-bold">{notification.title}</h3>
              <span class="text-sm text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p class="text-gray-600 mt-2">{notification.message}</p>
            {#if notification.action}
              <button class="text-blue-500 mt-2">
                {notification.action.label}
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
{/if}

<!-- Create Trip Form Panel -->
<div
class="fixed inset-0 flex items-center justify-center z-50"
style="visibility: {$createFormOpen ? 'visible' : 'hidden'};"
>
<div
  class="bg-white rounded-lg shadow-lg w-[500px] transform transition-transform duration-300 ease-in-out {$createFormOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}"
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
    <div class="space-y-6">
     <!-- Trip Name -->
      <div>
         <label for="tripName" class="block text-sm font-medium text-gray-700 mb-2">
           Trip Name
         </label>
         <input
           type = "text"
           id = "tripName"
           bind:value={tripName}
           required
           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
           placeholder="Enter trip name"
           />
      </div>


       <!-- Start Date -->
        <div>
           <label for="tripStartDate" class ="block text-sm font-medium text-gray-700 mb-2">
             Trip Start Date
           </label>
           <input
             type="date"
             id="tripStartDate"
             bind:value={tripStartDate}
             required
             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
             />
        </div>

        <!-- End Date -->
        <div>
          <label for="tripEndDate" class="block text-sm font-medium text-gray-700 mb-2">
            Trip End Date
          </label>
          <input
            type="date"
            id="tripEndDate"
            bind:value={tripEndDate}
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
            />
        </div>


        <!-- Total Days Display (read-only)-->
         {#if tripTotalDays > 0}
          <div>
            <span class="block text-sm font-medium text-gray-700 mb-2">
              Trip Duration
            </span>
            <p class="p-3 border border-gry-300 rounded-lg bg-gray-50">
              {tripTotalDays} {tripTotalDays === 1 ? 'day' : 'days'}
            </p>
          </div>
         {/if}


        <!-- Location -->
         <div>
          <label for="tripLocation" class="block text-sm font-medium text-gray-700 mb-2">
            Trip Location
          </label>
          <input
            type="text"
            id="tripLocation"
            bind:value={tripLocation}
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
            placeholder="Enter trip location"
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


        <!-- Error Display -->
         {#if formError}
            <div class="text-red-500 text-sm mt-2">
              {formError}
            </div>
          {/if}


       <!-- Submit button -->
        <button
          type="button"
          on:click={handleManualSubmit}
          class="w-full bg-[#3598db] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
          Create Trip
        </button>
    </div>
  </div>
</div>
</div>

<!-- Overlay -->
{#if $createFormOpen}
 <button
   type="button"
   class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 cursor-default"
   on:click={closeCreateForm}
   on:keydown={(e) => e.key === 'Escape' && closeCreateForm()}
   aria-label="Close modal overlay"
 ></button>
{/if}

