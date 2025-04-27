<script lang="ts">
	import { auth, signInWithEmailAndPassword } from '$lib/firebase';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	let inviteCode = '';
	let token = '';
	$: token = $page.url.searchParams.get('token') || '';

	let loggedIn = false;
	let inviteAcceptSuccess: boolean | null = null;
	let inviteAcceptError = '';
	let redirecting = false; 

	async function handleLogin(event: Event) {
		event.preventDefault();
		loading = true;
		error = '';

		try {
			await signInWithEmailAndPassword(auth, email, password);
			loggedIn = true;
		} catch (err: any) {
			console.error('Login error:', err);
			error = 'Invalid email or password.';
		} finally {
			loading = false;
		}
	}

	async function handleAcceptInvite() {
	if (!auth.currentUser) {
		inviteAcceptError = 'You must be logged in.';
		return;
	}

	const userEmail = auth.currentUser.email;
	if (!userEmail) {
		inviteAcceptError = 'Missing user email.';
		return;
	}

	try {
		const res = await fetch('/api/accept-invite', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, invite_code: inviteCode, email: userEmail })
		});

		if (res.ok) {
			inviteAcceptSuccess = true;
			redirecting = true; // ✨ Start spinner
			setTimeout(() => {
				goto('/tripspage');
			}, 2000);
		} else {
			const errorData = await res.json();
			inviteAcceptError = errorData.error || 'Failed to accept invite.';
			inviteAcceptSuccess = false;
		}
	} catch (err) {
		console.error('Error accepting invite:', err);
		inviteAcceptError = 'Something went wrong. Please try again.';
		inviteAcceptSuccess = false;
	}
}
</script>

<div class="min-h-screen bg-gradient-to-r from-[#84eaeb] to-[#3598db] flex flex-col items-center justify-center p-4">
	<div class="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
		<h1 class="text-3xl font-bold text-[#3598db] mb-6 text-center">Welcome Back!</h1>

		{#if error}
			<div class="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
		{/if}

		{#if !loggedIn}
			<!-- Login Form -->
			<form on:submit={handleLogin} class="space-y-6">
				<div>
					<label for="email" class="block text-gray-700 mb-2">Email</label>
					<input 
						id="email" 
						type="email" 
						bind:value={email}
						required
						placeholder="Enter your email"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="password" class="block text-gray-700 mb-2">Password</label>
					<input 
						id="password" 
						type="password" 
						bind:value={password}
						required
						placeholder="Enter your password"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
					/>
				</div>

				<button 
					type="submit" 
					class="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors"
					disabled={loading}
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p class="mt-4 text-center text-gray-600">
				Don't have an account? 
				<a href="/signuppage" class="text-[#3598db] hover:underline">
					Sign up
				</a>
			</p>
		{:else if token}
			<!-- After login, if token exists, show Accept Invite -->
			<div class="mt-10 p-6 bg-white rounded-lg shadow-md text-center">
				<h2 class="text-2xl font-bold mb-4 text-cyan-700">Join Your Trip!</h2>

				{#if inviteAcceptSuccess}
				{#if redirecting}
				<div class="flex flex-col items-center justify-center space-y-4">
					<div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
					<p class="text-cyan-700 font-semibold">Redirecting you to your trip...</p>
				</div>
			{:else}
				<p class="text-green-600 font-semibold mb-4">🎉 Invite accepted! You are now part of the trip!</p>
			{/if}
					<a href="/tripspage" class="text-cyan-600 underline">Go to Trips</a>
				{:else}
					{#if inviteAcceptError}
						<p class="text-red-600 font-semibold mb-4">{inviteAcceptError}</p>
					{/if}

					<input 
						type="text"
						placeholder="Enter your 6-digit invite code"
						bind:value={inviteCode}
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent mb-4"
					/>
					<button 
						on:click={handleAcceptInvite}
						class="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-all"
					>
						Accept Invite
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>