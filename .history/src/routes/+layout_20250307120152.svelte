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
		const token = localStorage.getItem('userToken');
		isLoggedIn = !!token; // Convert to boolean
	}

	// Login/logout function
	function toggleLogin() {
		if (isLoggedIn) {
			localStorage.removeItem('userToken');
			localStorage.removeItem('userData');
			isLoggedIn = false;
			console.log("Logged out successfully");
		} else {
			console.log("Redirecting to login...");
			window.location.href = "/loginpage";
		}
	}
</script>

<!-- Custom styling to override Flowbite defaults -->
<style>
  /* Override any built-in margins in the Navbar component */
  :global(.navbar-container) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  /* Target potential inner containers */
  :global(.navbar-container > div) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  /* Custom styling for our container */
  .nav-custom-container {
    width: 100%;
    padding: 0;
  }
</style>
 
<!-- Removed all padding and added !important classes to override -->
<Navbar class="bg-[#3598db] text-white fixed w-full !p-0 z-50">
	<!-- Custom container with no default padding -->
	<div class="nav-custom-container flex justify-between items-center">
		<!-- Logo section with minimal or no margins -->
		<NavBrand href="/" class="flex items-center !ml-1">
			<img src="/Colla-TripLogo-rem.png" class="h-20 !mr-2" alt="Colla-Trip Logo" />
			<span class="text-white self-center whitespace-nowrap text-3xl font-extrabold">Colla-Trip</span>
		</NavBrand>
 
		<!-- Desktop Menu pushed far right -->
		<div class="hidden md:flex items-center gap-5 lg:gap-8 !mr-1">
			<a href="/" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">Home</a>
			<a href="/explorepage" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">Explore</a>
			<a href="/aboutpage" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">About</a>
			<a href="/contactpage" class="text-white font-bold text-lg hover:text-blue-100 transition-colors">Contact Us</a>
			
			<!-- Login/Logout Button pushed to the edge -->
			<button 
				on:click={toggleLogin} 
				class="bg-white text-cyan-600 px-5 py-2 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg"
			>
				{isLoggedIn ? 'Log Out' : 'Log In'}
			</button>
		</div>
 
		<!-- Hamburger Button -->
		<button 
			class="md:hidden text-white !mr-2"
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

<!-- View the NavBrand component structure -->
<div class="hidden">
  <!-- This is to help understand what classes might need overriding -->
  <pre>{JSON.stringify(NavBrand, null, 2)}</pre>
</div>

<div class="pt-20">
	<slot />
</div>

<footer class="bg-[#84eaeb] text-blue-700 p-4 text-center font-bold">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>