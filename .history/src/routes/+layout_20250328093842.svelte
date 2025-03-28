<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isAuthenticated, isLoading, logout } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
    import PublicNavbar from '$lib/components/PublicNavbar.svelte';

	let isMenuOpen: boolean = false;

	// Close menu when route changes
	$: if ($page.url.pathname) {
        isMenuOpen = false;
    }

	// List routes that require login
	const protectedRoutes = ['/dashboardpage', '/tripspage', '/calendarpage', '/activitypage'];

	// Check if we need to redirect
	$: {
		// Get the current page path
		const currentPath = $page.url.pathname;
		
		// Check if this page requires login
		const needsAuth = protectedRoutes.some(route => 
			currentPath.startsWith(route)
		);

	
		// If page needs login, auth check is done, and user isn't logged in
		if (needsAuth && !$isLoading && !$isAuthenticated) {
			// Redirect to login
			goto('/loginpage');
		}
	}

	// Login/logout function using Firebase
	async function toggleLogin() {
		if ($isAuthenticated) {
			const result = await logout();
			if (result.success) {
				goto('/');
			}
		} else {
			goto('/loginpage');
		}
	}
</script>

<style>
  /* Force the navbar to go edge to edge */
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Prevent horizontal scrolling */
  }
  
  /* Style for the navbar to emulate Amazon's design */
  .amazon-style-nav {
    width: 100vw; /* Full viewport width */
    max-width: 100%; /* Ensure it doesn't overflow */
    padding: 0;
    box-sizing: border-box;
  }
  
  /* Remove default list styling */
  .nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  /* Style for logo */
  .logo-img {
    height: 50px;
    width: auto;
    object-fit: contain;
  }
</style>

<!-- Amazon-Style Full-Width Nav -->
<nav class="amazon-style-nav bg-[#3598db] text-white fixed top-0 left-0 right-0 z-50">
    <!-- Upper Nav - Main Navigation -->
    <div class="flex items-center h-14 px-2">
        <!-- Logo - Flush to the left edge -->
        <a href="/" class="flex items-center pl-0">
            <img src="/Colla-TripLogo-rem.png" alt="Colla-Trip Logo" class="logo-img mr-2" />
            <span class="text-white text-xl font-bold whitespace-nowrap">Colla-Trip</span>
        </a>
        
        <!-- Center area - grows to fill space -->
        <div class="flex-grow"></div>
        
        <!-- Nav links - right aligned with minimal spacing -->
        <ul class="nav-links hidden md:flex items-center h-full">
            <li><a href="/" class="px-3 py-2 inline-block text-white hover:bg-[#2b85c3] transition-colors">Home</a></li>
            <li><a href="/explorepage" class="px-3 py-2 inline-block text-white hover:bg-[#2b85c3] transition-colors">Explore</a></li>
            <li><a href="/aboutpage" class="px-3 py-2 inline-block text-white hover:bg-[#2b85c3] transition-colors">About</a></li>
            <li><a href="/contactpage" class="px-3 py-2 inline-block text-white hover:bg-[#2b85c3] transition-colors">Contact Us</a></li>
        </ul>
        
        <!-- Login button - Flush to the right edge -->
        <button 
            on:click={toggleLogin} 
            class="ml-4 mr-0 bg-white text-[#3598db] px-3 py-1 rounded hover:bg-gray-100 transition-colors font-medium"
        >
            {$isAuthenticated ? 'Log Out' : 'Log In'}
        </button>
        
        <!-- Mobile hamburger menu -->
        <button 
            class="md:hidden ml-3 p-2"
            on:click={() => isMenuOpen = !isMenuOpen}
            aria-label="Toggle menu"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    </div>
    
    <!-- Mobile Menu Dropdown -->
    {#if isMenuOpen}
        <div class="md:hidden bg-[#3598db] w-full border-t border-[#2b85c3]">
            <div class="flex flex-col">
                <a href="/" class="px-4 py-3 text-white hover:bg-[#2b85c3] transition-colors border-b border-[#2b85c3]">Home</a>
                <a href="/explorepage" class="px-4 py-3 text-white hover:bg-[#2b85c3] transition-colors border-b border-[#2b85c3]">Explore</a>
                <a href="/aboutpage" class="px-4 py-3 text-white hover:bg-[#2b85c3] transition-colors border-b border-[#2b85c3]">About</a>
                <a href="/contactpage" class="px-4 py-3 text-white hover:bg-[#2b85c3] transition-colors">Contact Us</a>
            </div>
        </div>
    {/if}

    {#if !$isAuthenticated}
        <PublicNavbar />
    {/if}
</nav>

<div class="pt-14">
    <slot />
</div>

<footer class="bg-[#84eaeb] text-blue-700 p-4 text-center font-bold w-full">
    <p>&copy; 2025 Colla-Trip. All rights reserved.</p>
    <p>Plan your trips with ease!</p>
</footer>