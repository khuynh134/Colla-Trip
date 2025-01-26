<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>

<Navbar class="bg-cyan-600 text-white p-4 flex items-center justify-between">
	<!-- Brand Section -->
	<NavBrand href="/">
		<img src="/Colla-TripLogo-rem.png" class="h-12" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-lg font-semibold ml-2">Colla-Trip</span>
	</NavBrand>

	<!-- Navigation Links -->
	<NavUl class="flex space-x-8 items-center">
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