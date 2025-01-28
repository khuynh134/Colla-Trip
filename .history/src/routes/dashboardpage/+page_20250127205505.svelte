<script lang="ts">
    import { Card } from 'flowbite-svelte';
 </script>
 
 <div class="container mx-auto p-6">
    <!-- Create Trip Button -->
    <button class="w-full md:w-auto bg-[#3598db] text-white font-bold py-4 px-8 rounded-lg mb-8 hover:bg-[#2980b9] transition-colors">
        Create New Trip
    </button>
 
    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">Polls</h3>
            <p>Vote on destinations and activities</p>
        </Card>
 
        <Card class="hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">Schedule</h3>
            <p>Plan your itinerary</p>
        </Card>
 
        <Card class="hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">Budget</h3>
            <p>Track expenses and split costs</p>
        </Card>
 
        <Card class="hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">Packing Lists</h3>
            <p>Create and share packing lists</p>
        </Card>
 
        <Card class="hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">Explore</h3>
            <p>Discover new destinations</p>
        </Card>
    </div>
 </div>