<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
  
    let tripName = 'your trip';
  
    onMount(() => {
      const url = new URL(window.location.href);
      const tripParam = url.searchParams.get('trip');
      if (tripParam) {
        tripName = decodeURIComponent(tripParam);
      }
    });
  </script>
  
  <div class="min-h-screen bg-gradient-to-b from-cyan-100 to-cyan-300 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
      <h1 class="text-3xl font-bold text-cyan-700 mb-6">
        🎉 Welcome to {tripName}!
      </h1>
      <p class="text-gray-600 mb-6">
        You've successfully joined the trip! You can now collaborate, plan activities, and more.
      </p>
      <a href="/loginpage" class="inline-block px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-all">
        Log In and View Trip
      </a>
    </div>
  </div>