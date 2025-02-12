<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  
  // State management
  let sidebarExtended = false;
  let sidebarWidth = '80px';
  let createFormOpen = false;
  let invitedMembers: string[] = [''];

  // Form functions
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

  function handleSubmitTrip(event: Event) {
    event.preventDefault();
    closeCreateForm();
  }
</script>

<div class="min-h-screen bg-gray-50">
  <Sidebar 
    bind:sidebarExtended 
    bind:sidebarWidth 
    bind:createFormOpen
  />

  <!-- Main Content -->
  <div
    class="transition-all duration-500 ease-in-out"
    style="margin-left: {sidebarWidth};"
  >
    <div class="px-4 sm:px-8">
      <!-- Search Bar -->
      <div class="mt-12 mb-8">
        <input
          type="text"
          placeholder="Search trips..."
          class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
          aria-label="Search trips"
        />
      </div>

      <!-- Welcome Section -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 pt-4 sm:pt-8">
        <div class="mb-4 sm:mb-0">
          <h1 class="text-2xl sm:text-3xl font-bold">Welcome Back,</h1>
          <p class="text-lg sm:text-xl text-gray-600 mt-2">User Name</p>
        </div>
      </div>

      <!-- Stats Cards -->
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

      <!-- Trip Activity Section -->
      <Card class="p-6 sm:p-8 shadow-lg">
        <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
        <!-- Chart component can go here -->
      </Card>
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
