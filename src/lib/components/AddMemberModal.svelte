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
    const res = await fetch('/api/trip-invites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripId,
        username,
        message: ''
      }),
      credentials: 'include'
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