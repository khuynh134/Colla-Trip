<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let token: string | null = null;
    let invite: {
        id: number;
        trip_id: number;
        trip_title: string;
        email: string | null;
        username: string | null;
        message: string | null;
        status: string;
    } | null = null;
    
    let errorMessage: string | null = null;
    let loading = true;
    let confirmDeclineOpen = false; // controls the modal

    onMount(async () => {
        const url = new URL(window.location.href);
        token = url.searchParams.get('token');

        if (!token) {
            errorMessage = 'Invalid invite link.';
            loading = false;
            return;
        }

        try {
            const res = await fetch(`/api/fetch-invite?token=${token}`);

            if (!res.ok) {
                const errorData = await res.json();
                errorMessage = errorData.error || 'Unable to fetch invite.';
            } else {
                invite = await res.json();
            }
        } catch (err) {
            console.error('Error fetching invite:', err);
            errorMessage = 'Something went wrong. Please try again.';
        } finally {
            loading = false;
        }
    });

    function handleAccept() {
        goto(`/signup?token=${token}`);
    }

    function handleDecline() {
        confirmDeclineOpen = true; // open the confirmation modal
    }

    async function handleDeclineConfirmed() {
        if (!token) return;

        try {
            const res = await fetch(`/api/fetch-invite/decline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (res.ok) {
                alert('Invitation declined.');
                goto('/');
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to decline invite.');
            }
        } catch (error) {
            console.error('Error declining invite:', error);
            alert('An error occurred. Please try again.');
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-100 to-cyan-300">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {#if loading}
            <p>Loading invitation...</p>
        {:else if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {:else if invite}
            <h1 class="text-2xl font-bold text-cyan-700 mb-4">
                You're invited to join {invite.trip_title}!
            </h1>
            
            {#if invite.message}
                <p class="mb-4 italic text-gray-600">"{invite.message}"</p>
            {/if}

            <p class="mb-6 text-gray-700">
                Accept this invitation to start planning and join the trip!
            </p>

            <div class="flex flex-col gap-3 mt-6">
                <button 
                    on:click={handleAccept}
                    class="px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-all"
                >
                    Accept Invitation
                </button>
                <button 
                    on:click={handleDecline}
                    class="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                >
                    Decline Invitation
                </button>
            </div>
            {#if confirmDeclineOpen}
                <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
                        <h2 class="text-xl font-semibold mb-4 text-gray-800">Decline Invitation?</h2>
                        <p class="text-gray-600 mb-6">Are you sure you want to decline this trip invitation? This cannot be undone.</p>
                        <div class="flex justify-center gap-4">
                            <button 
                                on:click={handleDeclineConfirmed}
                                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            >
                                Yes, Decline
                            </button>
                            <button 
                                on:click={() => confirmDeclineOpen = false}
                                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>