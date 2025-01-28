<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import '../app.css';

    // Hide navbar on dashboard routes
    $: showNavbar = !$page.url.pathname.startsWith('/dashboard');
</script>

{#if showNavbar}
    <!-- Your existing navbar code -->
    <Navbar>...</Navbar>
{/if}

<div class="min-h-screen bg-gray-50">
    <!-- Rest of your dashboard code stays the same -->
    <nav class="fixed left-0 top-0 h-full w-72 bg-[#3598db] text-white p-12">
        <!-- Sidebar content -->
    </nav>

    <div class="ml-80 p-12">
        <!-- Main content -->
    <div class="ml-80 p-12">
        <div class="px-8">
            <!-- Search Bar -->
            <div class="mb-8">
                <input 
                    type="text" 
                    placeholder="Search trips..." 
                    class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                />
            </div>
 
            <div class="flex justify-between items-center mb-12 pt-8">
                <div>
                    <h1 class="text-3xl font-bold">Welcome Back,</h1>
                    <p class="text-xl text-gray-600 mt-2">User Name</p>
                </div>
                <button class="bg-[#3598db] text-white px-12 py-3 rounded-lg text-lg">
                    Create Trip
                </button>
            </div>
 
            <div class="grid grid-cols-2 gap-8 mb-12">
                <Card class="p-8 shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Total Trips</h3>
                    <div class="text-4xl font-bold">5</div>
                    <div class="text-green-500 text-lg mt-2">+2 this month</div>
                </Card>
                <Card class="p-8 shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Upcoming Trips</h3>
                    <div class="text-4xl font-bold">2</div>
                    <div class="text-blue-500 text-lg mt-2">Next: Paris, France</div>
                </Card>
            </div>
 
            <Card class="p-8 shadow-lg">
                <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
                <!-- Chart component -->
            </Card>
        </div>
    </div>
 </div>