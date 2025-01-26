<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar class="bg-cyan-600 text-white fixed w-full p-4 flex items-center justify-between">
	<!-- Logo and Brand Section -->
	<NavBrand href="/" class="flex items-center">
		<img src="/Colla-TripLogo-rem.png" class="h-12 mr-4" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-lg font-semibold">Colla-Trip</span>
	</NavBrand>

	<!-- Navigation Links -->
	<NavUl class="flex space-x-8">
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/services">Services</NavLi>
		<NavLi href="/portfolio">Portfolio</NavLi>
		<NavLi href="/blog">Blog</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
</Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>