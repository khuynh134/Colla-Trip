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

	// Simulated login/logout function
	function toggleLogin() {
		if (isLoggedIn) {
			// Perform logout actions (e.g., clear session)
			console.log("Logging out...");
			isLoggedIn = false;
		} else {
			// Redirect to login page or authentication logic
			console.log("Redirecting to login...");
			window.location.href = "/loginpage";
		}
	}
</script>
 
<Navbar class="bg-[#3598db] text-white fixed w-full p-4 z-50">
	<div class="container mx-0 flex justify-between items-center">
		<NavBrand href="/" class="flex items-center">
			<img src="/Colla-TripLogo-rem.png" class="h-20 mr-10 drop-shadow-lg" alt="Colla-Trip Logo" />
			<span class="text-white self-center whitespace-nowrap text-3xl font-extrabold">Colla-Trip</span>
		</NavBrand>
 
		<!-- Desktop Menu -->
		<div class="hidden md:flex items-center space-x-12 ml-auto">
			<a href="/" class="text-white font-bold text-lg">Home</a>
			<a href="/explorepage" class="text-white font-bold text-lg">Explore</a>
			<a href="/aboutpage" class="text-white font-bold text-lg">About</a>
			<a href="/contactpage" class="text-white font-bold text-lg">Contact Us</a>
			
			<!-- Login/Logout Button -->
			<button 
				on:click={toggleLogin} 
				class="bg-white text-cyan-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg"
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
				<a href="/" class="text-white">Home</a>
				<a href="/explorepage" class="text-white">Explore</a>
				<a href="/aboutpage" class="text-white">About</a>
				<a href="/contactpage" class="text-white">Contact Us</a>
				
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