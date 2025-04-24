<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { Card} from 'flowbite-svelte';
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
                    <p>Trip's location: {trip.location}</p>
                    <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>

                    </Card>
                </button>
            {/each}
        
    </div>
{/if}

<style>
    .trip-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1rem;
    }

    .trip-card {
        background-color: rgb(115, 234, 253);
        border: 1px solid #b5fafa;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease;
    }

    .trip-card:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    .error-message {
        color: red;
        font-weight: bold;
        padding: 1rem;
    }
</style>