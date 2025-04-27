<script lang="ts">
	import { auth } from '$lib/firebase';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	let inviteCode = '';
	let token = '';
	let inviteAcceptSuccess: boolean | null = null;
	let inviteAcceptError = '';

	$: token = $page.url.searchParams.get('token') || '';

	async function handleAcceptInvite() {
		if (!auth.currentUser) {
			inviteAcceptError = 'You must be logged in.';
			return;
		}

		const email = auth.currentUser.email;
		if (!email) {
			inviteAcceptError = 'Missing user email.';
			return;
		}

		try {
			const res = await fetch('/api/accept-invite', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, invite_code: inviteCode, email })
			});

			if (res.ok) {
				inviteAcceptSuccess = true;
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
			<div class="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
		{/if}

		{#if !showInviteInput}
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<div>
					<label for="email" class="block text-gray-700 mb-2">Email</label>
					<input 
						id="email" 
						type="email" 
						bind:value={email}
						placeholder="Enter your email"
						required
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
					/>
				</div>

				<div>
					<label for="password" class="block text-gray-700 mb-2">Password</label>
					<input 
						id="password" 
						type="password" 
						bind:value={password}
						placeholder="Enter your password"
						required
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
					/>
				</div>

				<button 
					type="submit" 
					class="w-full bg-[#3598db] text-white py-3 rounded-lg hover:bg-[#3598db]/90 transition-colors"
					disabled={loading}
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p class="mt-4 text-center text-gray-600">
				Don't have an account? 
				<a href="/signuppage" class="text-[#3598db] hover:underline" on:click|preventDefault={handleSignUpClick}>
					Sign up
				</a>
			</p>
		{:else}
			<!-- Invite Code Input -->
			<div class="space-y-6">
				<p class="text-gray-700 text-center">Enter your invitation code:</p>
				<input 
					type="text"
					bind:value={inviteCode}
					placeholder="6-digit code"
					class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
					required
				/>

				<button 
					on:click={submitInviteCode}
					class="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-all"
				>
					Submit Code
				</button>
			</div>
		{/if}
	</div>
</div>