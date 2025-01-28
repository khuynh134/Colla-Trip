<script lang="ts">
    import { Card } from 'flowbite-svelte';
 </script>
 
 <div class="min-h-screen bg-gray-50 p-6">
    <!-- Left Navigation Icons -->
    <nav class="fixed left-0 top-0 h-full w-16 bg-white shadow-lg flex flex-col items-center py-6 space-y-8">
        <img src="/Colla-TripLogo-rem.png" alt="Logo" class="w-10 h-10">
        <div class="space-y-8">
            <a href="/profile" class="text-gray-500 hover:text-[#3598db]">👤</a>
            <a href="/trips" class="text-gray-500 hover:text-[#3598db]">✈️</a>
            <a href="/schedule" class="text-gray-500 hover:text-[#3598db]">📅</a>
            <a href="/map" class="text-gray-500 hover:text-[#3598db]">🗺️</a>
        </div>
    </nav>
 
    <!-- Main Content -->
    <div class="ml-24">
        <!-- Header with Weather -->
        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="col-span-2">
                <h1 class="text-3xl font-bold mb-2">My Ticket</h1>
                <Card class="p-6">
                    <!-- Flight Ticket -->
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-2xl font-bold">PRG</div>
                            <div class="text-sm">Prague</div>
                        </div>
                        <div>✈️</div>
                        <div>
                            <div class="text-2xl font-bold">AMS</div>
                            <div class="text-sm">Amsterdam</div>
                        </div>
                    </div>
                    <div class="mt-4 text-sm text-gray-600">May 24, 8:35 PM</div>
                </Card>
            </div>
            
            <div>
                <h2 class="text-xl font-bold mb-2">Today's Weather</h2>
                <Card class="bg-purple-100 p-6">
                    <div class="text-3xl font-bold">25°</div>
                    <div class="flex justify-between mt-4">
                        <div class="text-center">
                            <div>Tue</div>
                            <div>19°</div>
                        </div>
                        <div class="text-center">
                            <div>Wed</div>
                            <div>18°</div>
                        </div>
                        <div class="text-center">
                            <div>Thu</div>
                            <div>21°</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
 
        <!-- Popular Destinations -->
        <div>
            <h2 class="text-xl font-bold mb-4">Popular Destinations</h2>
            <div class="grid grid-cols-3 gap-6">
                <Card>
                    <h3>Italy, Orvieto</h3>
                    <p class="text-gray-600">from $800</p>
                </Card>
                <Card>
                    <h3>Portugal, Algarve</h3>
                    <p class="text-gray-600">from $750</p>
                </Card>
                <Card>
                    <h3>Greece, Santorini</h3>
                    <p class="text-gray-600">from $955</p>
                </Card>
            </div>
        </div>
    </div>
 </div>