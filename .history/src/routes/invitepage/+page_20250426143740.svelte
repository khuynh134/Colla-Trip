<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let token = '';
    let invitation: any = null;
    let loading = true;
    let error = '';

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') ?? '';

        if (!token) {
            error = 'No invitation token provided.';
            loading = false;
            return;
        }

        try {
            const res = await fetch(`/api/invitations?token=${token}`);
            if (res.ok) {
                invitation = await res.json();
            } else {
                error = 'Invalid or expired invitation.';
            }
        } catch (err) {
            console.error(err);
            error = 'Failed to fetch invitation details.';
        } finally {
            loading = false;
        }
    });

    function acceptInvitation() {
        if (token) {
            goto(`/signuppage?token=${token}`);
        }
    }
</script>

{#if loading}
    <p>Loading invitation details...</p>
{:else if error}
    <div class="text-red-500">{error}</div>
{:else}
    <div class="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold mb-4">You're Invited!</h1>
        <p class="mb-2">Trip: <strong>{invitation.trip_title}</strong></p>
        <p class="mb-2">Invited by: <strong>{invitation.invited_by}</strong></p>
        {#if invitation.message}
            <p class="mb-4 text-gray-600 italic">"{invitation.message}"</p>
        {/if}

        <button
            class="px-6 py-3 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            on:click={acceptInvitation}
        >
            Accept Invitation
        </button>
    </div>
{/if}