<script lang="ts">
	import '../../app.css';
	import { auth, signInWithEmailAndPassword } from '$lib/firebase';
	import { user as userStore, isAuthenticated } from '$lib/stores/authStore';
	import { goto } from '$app/navigation'; 
	
	// Form state variables
	let email = '';
	let password = '';
	let error = '';
	let loading = false;

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
			
			// Add a small delay to ensure Firebase auth state updates
			setTimeout(() => {
				console.log("Checking auth state after login:", { 
					isAuthenticated: $isAuthenticated,
					user: $userStore ? $userStore.email : null
				});
				goto('/dashboardpage');
			}, 1000);
		} catch (error: any) {
			console.error("Login error:", error.code, error.message);
			error = error.message;
		} finally {
			loading = false;
		}
	}
</script>
 
<div class="min-h-screen bg-gradient-to-r from-[#84eaeb] to-[#3598db] flex flex-col items-center justify-center p-4">
	<div class="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
		<h1 class="text-3xl font-bold text-[#3598db] mb-6 text-center">Welcome Back!</h1>
		
		<form on:submit|preventDefault={handleLogin} class="space-y-6">
			{#if error}
				<div class="p-3 bg-red-100 text-red-700 rounded-lg">
					{error}
				</div>
			{/if}
			
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
			<a href="/signuppage" class="text-[#3598db] hover:underline" on:click|preventDefault={handleSignUpClick}>Sign up</a>
		</p>
	</div>
</div>