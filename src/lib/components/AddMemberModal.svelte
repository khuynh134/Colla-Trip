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
			const currentUser = await new Promise((resolve, reject) => {
				const unsubscribe = auth.onAuthStateChanged((user) => {
					unsubscribe();
					if (user) resolve(user);
					else reject(new Error('User not authenticated.'));
				});
			});

			const token = await (currentUser as any).getIdToken(true);

			// 👇 THE FIX: window.location.origin
			const apiUrl = `${window.location.origin}/api/trip-invites`;

			const res = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				credentials: 'include',
				body: JSON.stringify({
					tripId,
					username,
					message: '' 
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