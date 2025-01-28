<script lang="ts">
    import { Card } from 'flowbite-svelte';
 </script>
 
 <div class="min-h-screen bg-gray-50">
    <!-- Left Sidebar -->
    <nav class="fixed left-0 top-0 h-full w-64 bg-[#3598db] text-white p-12">
        <div class="flex items-center mb-8">
            <img src="/Colla-TripLogo-rem.png" alt="Logo" class="w-12 h-12">
            <span class="text-xl font-bold ml-2">Colla-Trip</span>
        </div>
        
        <div class="space-y-4">
            <a href="/overview" class="flex items-center p-3 hover:bg-blue-600 rounded">
                <span>Overview</span>
            </a>
            <a href="/trips" class="flex items-center p-3 hover:bg-blue-600 rounded">
                <span>Trips</span>
            </a>
            <a href="/polls" class="flex items-center p-3 hover:bg-blue-600 rounded">
                <span>Polls</span>
            </a>
            <a href="/schedule" class="flex items-center p-3 hover:bg-blue-600 rounded">
                <span>Schedule</span>
            </a>
            <a href="/budget" class="flex items-center p-3 hover:bg-blue-600 rounded">
                <span>Budget</span>
            </a>
            <a href="/packing" class="flex items-center p-3 hover:bg-blue-600 rounded">
                <span>Packing Lists</span>
            </a>
        </div>
    </nav>
 
    <!-- Main Content -->
    <div class="ml-64 p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 pt-12">
            <div>
                <h1 class="text-2xl font-bold">Welcome Back,</h1>
                <p class="text-gray-600">User Name</p>
            </div>
            <button class="bg-[#3598db] text-white px-12 py-2 rounded-lg">
                Create Trip
            </button>
        </div>
 
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-6 mb-8">
            <Card class="p-6">
                <h3 class="text-lg font-semibold mb-2">Total Trips</h3>
                <div class="text-3xl font-bold">5</div>
                <div class="text-green-500 text-sm">+2 this month</div>
            </Card>
            <Card class="p-6">
                <h3 class="text-lg font-semibold mb-2">Upcoming Trips</h3>
                <div class="text-3xl font-bold">2</div>
                <div class="text-blue-500 text-sm">Next: Paris, France</div>
            </Card>
        </div>
 
        <!-- Recent Activity Chart -->
        <Card class="p-6 mb-8">
            <h3 class="text-lg font-semibold mb-4">Trip Activity</h3>
            <!-- Add chart component here -->
        </Card>
    </div>
 </div>