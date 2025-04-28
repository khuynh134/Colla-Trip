<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	import { auth } from '$lib/firebase'; 

	const dispatch = createEventDispatcher();

	export let tripId: number;

	let username = '';
	let loading = false;
	let errorMessage = '';

	async function handleInvite() {
		loading = true;
		errorMessage = '';

		try {
			const currentUser = auth.currentUser;
if (!currentUser) {
  throw new Error('Not authenticated.');
}

const token = await currentUser.getIdToken(true);

const res = await fetch('/api/invite-username', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({
        tripId: tripId,
        username: username
    })
});
			if (!res.ok) {
				const errorData = await res.json();
				errorMessage = errorData.error || 'Failed to send invite.';
				return;
			}

			dispatch('close'); 
		} catch (err) {
			console.error('Error inviting member:', err);
			errorMessage = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-6">
	<h2 class="text-xl font-bold mb-4">Invite Member by Username</h2>

	{#if errorMessage}
		<p class="text-red-500 mb-4">{errorMessage}</p>
	{/if}

	<input
		type="text"
		bind:value={username}
		placeholder="Enter username"
		class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
		required
	/>

	<button
		class="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
		on:click={handleInvite}
		disabled={loading}
	>
		{loading ? 'Sending invite...' : 'Send Invite'}
	</button>
</div>