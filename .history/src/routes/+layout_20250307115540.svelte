<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let isMenuOpen: boolean = false; 
	let isLoggedIn: boolean = false; // Track login state

	// Close menu when route changes
	$: if ($page.url.pathname) {
       isMenuOpen = false;
   }

	// Check login status when component mounts
	onMount(() => {
		checkLoginStatus();
	});

	// Function to check if user is logged in
	function checkLoginStatus() {
		// Check for user session, token, or other auth indicator
		// This will depend on how you're storing auth state in your app
		
		// Example using localStorage:
		const token = localStorage.getItem('userToken');
		isLoggedIn = !!token; // Convert to boolean
		
		// Alternative example if using a cookie:
		// isLoggedIn = document.cookie.includes('authenticated=true');
	}

	// Login/logout function
	function toggleLogin() {
		if (isLoggedIn) {
			// Perform logout actions
			localStorage.removeItem('userToken'); // Remove token
			// Optionally clear other user data
			localStorage.removeItem('userData');
			
			// Update UI state
			isLoggedIn = false;
			
			console.log("Logged out successfully");
			
			// Optional: redirect to home page
			// window.location.href = "/";
		} else {
			// Redirect to login page
			console.log("Redirecting to login...");
			window.location.href = "/loginpage";
		}
	}
</script>
 
<Navbar class="bg-[#3598db] text-white fixed w-full p-4 z-50">
	<!-- Changed from container to full width + padding for better spacing -->
	<div class="w-full flex justify-between items-center px-2 sm:px-6 lg:px-8">
		<!-- Reduced margin on the logo -->
		<NavBrand href="/" class="flex items-center">
			<img src="/Colla-TripLogo-rem.png" class="h-20 mr-6 drop-shadow-lg" alt="Colla-Trip Logo" />
			<span class="text-white self-center whitespace-nowrap text-3xl font-extrabold">Colla-Trip</span>
		</NavBrand>
 
		<!-- Desktop Menu with more space between items -->
		<div class="hidden md:flex items-center space-x-8 lg:space-x-12">
			<a href="/" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">Home</a>
			<a href="/explorepage" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">Explore</a>
			<a href="/aboutpage" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">About</a>
			<a href="/contactpage" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">Contact Us</a>
			
			<!-- Login/Logout Button - now with more padding -->
			<button 
				on:click={toggleLogin} 
				class="bg-white text-cyan-600 px-5 py-2 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg"
			>
				{isLoggedIn ? 'Log Out' : 'Log In'}
			</button>
		</div>
 
		<!-- Hamburger Button -->
		<button 
			class="md:hidden text-white"
			on:click={() => isMenuOpen = !isMenuOpen}
			aria-label="Toggle menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
			</svg>
		</button>
	</div>
 
	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden absolute top-full left-0 right-0 bg-[#3598db] p-4">
			<div class="flex flex-col space-y-4">
				<a href="/" class="text-white hover:text-blue-100 transition-colors">Home</a>
				<a href="/explorepage" class="text-white hover:text-blue-100 transition-colors">Explore</a>
				<a href="/aboutpage" class="text-white hover:text-blue-100 transition-colors">About</a>
				<a href="/contactpage" class="text-white hover:text-blue-100 transition-colors">Contact Us</a>
				
				<!-- Mobile Login/Logout Button -->
				<button 
					on:click={toggleLogin} 
					class="bg-white text-cyan-600 px-4 py-2 rounded-md transition-colors text-center"
				>
					{isLoggedIn ? 'Log Out' : 'Log In'}
				</button>
			</div>
		</div>
	{/if}
</Navbar>

<div class="pt-20">
	<slot />
</div>

<footer class="bg-[#84eaeb] text-blue-700 p-4 text-center font-bold">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>