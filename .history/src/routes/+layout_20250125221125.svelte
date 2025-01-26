<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar class="bg-cyan-600 text-white fixed w-full p-4 flex items-center justify-between z-50">
	<!-- Logo and Brand Section -->
	<NavBrand href="/" class="flex items-center">
		<img src="/Colla-TripLogo-rem.png" class="h-12 mr-4" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-lg font-semibold">Colla-Trip</span>
	</NavBrand>

	<!-- Navigation Links -->
	<NavUl class="flex flex-row space-x-6 items-center">
		<NavLi href="/">Home</NavLi>
		<NavLi href="/explore">Explore</NavLi>
		<NavLi href="/services">Services</NavLi>
	</NavUl>

	<!-- Login/Signup Button -->
	<div class="flex items-center">
		<a 
			href="/loginpage" 
			class="bg-white text-cyan-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
		>
			Log In
		</a>
	</div>
</Navbar>

<div class="pt-20"> <!-- Add padding to prevent content from being hidden behind fixed navbar -->
	<slot />
</div>

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>