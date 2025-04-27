<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { Card} from 'flowbite-svelte';
    import { Calendar, MapPin } from 'lucide-svelte';
    let trips: { id: number; name: string; location: string; startDate: string; endDate: string }[] = [];
    let loading = true; 
    let error: string | null; 


    // Navigate to a specific trip page
    function navigateToTrip(tripId: number) {
        goto(`/tripspage/${tripId}`);
    }

    // Format a date string into a readable format
    function formatDate(dateString: string): string{
        if (!dateString) return 'No date available';

        const date = new Date(dateString);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            console.log('Invalid date:', dateString);
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // fetch trips when the page loads 
    onMount(() => {
        // getting the user's current auth 
        const auth = getAuth(); 
        // Use Firebase's auth state observer
        const unsubsribe = onAuthStateChanged(auth, async (user) => {
             try{
                if (!user) {
                    error = 'User not authenticated. Please log in.';
                    loading = false;
                    return;
                }
                const token = await user.getIdToken();
                const response = await fetch('/api/trips', {
                     headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch( () => null);
                    throw new Error(errorData?.message || 'Failed to fetch trips');
                }
                //trips = await response.json();
                const responseData =await response.json();
                console.log('API response:', responseData);
                trips = Array.isArray(responseData) ? responseData.map(trip => {
                    console.log('Trip dates:', {
                        startDate: trip.startDate,
                        endDate: trip.endDate

                    });
                    return trip;
                }) : [];
            } catch (err) {
                    error = err instanceof Error ? err.message : 'An unexpected error occurred';
            } finally {
                loading = false;
            } 
    });
    return unsubsribe;
    });


</script>
<div class="page-background">
    {#if loading}
    <p>Loading trips...</p>
{:else if error}
    <div class="error-message">
        <p>Error: {error}</p>
    </div>
{:else if trips.length === 0}
    <p> No trips found. Create a new trip to get started</p>
{:else}
    <div class="trip-list">
        <h1>My Trips</h1>
        
            {#each trips as trip}
                <button on:click={() => navigateToTrip(trip.id)} class="trip-card">
                    <Card>
                    <h3>Trip's name: {trip.name}</h3>
                    <div class ="location">
                        <MapPin class="w-5 h-5 text-cyan-600 mr-2" />
                        <p>Trip's location: {trip.location}</p>
                    </div>
                    <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>

                    </Card>
                </button>
            {/each}
        
    </div>
{/if}

</div>


<style>
    .trip-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-auto-rows: 1fr;
        gap: 1rem;
        padding: 1rem;
    }

    .trip-list h1 {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: rgb(71, 133, 180);
        text-align: center;
    }

    .trip-card {
        background-color: rgba(155, 220, 250, 0.239);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.6);
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 250px;
    }

    .trip-card:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    .trip-card h3 {
        font-size: 1.25 rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: rgb(71, 133, 180);
    }

    .trip-card p{
        font-size: 1 rem;
        margin-bottom: 0.5rem;
        color: #333;
    }

    .error-message {
        color: red;
        font-weight: bold;
        padding: 1rem;
    }
    .page-background {
        background: linear-gradient(
            to bottom right,
            rgba(133, 249, 255, 0.579),
            rgba(133, 249, 255, 0.05)
        );
        backdrop-filter: blur(15px);
        min-height: 100vh;
        padding: 2rem;
    }

    .location {
        display: flex; /* Align items horizontally */
        align-items: center; /* Vertically center the icon and text */
        gap: 0.1rem; /* Add spacing between the icon and text */
    }

    .location p {
        margin: 0; /* Remove default margin from the paragraph */
        font-size: 1rem; /* Ensure consistent font size */
        color: #333; /* Optional: Adjust text color */
    }
</style>