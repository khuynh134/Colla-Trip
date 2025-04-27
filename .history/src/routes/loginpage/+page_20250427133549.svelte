<script lang="ts">
	import '../../app.css';
	import { auth, signInWithEmailAndPassword } from '$lib/firebase';
	import { user as userStore, isAuthenticated } from '$lib/stores/authStore';
	import { goto } from '$app/navigation'; 
	import { page } from '$app/stores';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	// Handle token from URL if it exists
	let token = '';
	let inviteCode = '';
	let showInviteInput = false;

	// Reactive: get token from URL
	$: token = $page.url.searchParams.get('token') || '';

	function handleSignUpClick(event: Event) {
		event.preventDefault();
		goto('/signuppage');
	}

	async function handleLogin(event: Event) {
		event.preventDefault();
		loading = true;
		error = '';

		console.log("Login attempt with:", email);

		try {
			const result = await signInWithEmailAndPassword(auth as any, email, password);
			console.log("Login successful - user:", result.user.uid);

			setTimeout(() => {
				console.log("Checking auth state after login:", { 
					isAuthenticated: $isAuthenticated,
					user: $userStore ? $userStore.email : null
				});

				// If token exists, show invite code input
				if (token) {
					showInviteInput = true;
				} else {
					goto('/dashboardpage');
				}
			}, 1000);
		} catch (error: any) {
			console.error("Login error:", error.code, error.message);
			error = error.message;
		} finally {
			loading = false;
		}
	}

	async function submitInviteCode() {
		if (!inviteCode) {
			error = 'Please enter your invitation code.';
			return;
		}

		try {
			const res = await fetch('/api/accept-invite', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token,
					invite_code: inviteCode
				})
			});

			if (res.ok) {
				goto('/tripspage');
			} else {
				const errorData = await res.json();
				error = errorData.error || 'Failed to accept invitation.';
			}
		} catch (err) {
			console.error('Error accepting invite:', err);
			error = 'Something went wrong.';
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