<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  
 // State management for sidebar only
 let sidebarExtended = false;
  let sidebarWidth = '80px';
  let createFormOpen = false;
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
      <div class="mt-12 mb-8 mt-16">
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
</div>

 
