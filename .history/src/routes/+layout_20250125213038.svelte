<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
</script>

<Navbar class="bg-gray-800 text-white fixed w-full p-4">
	<NavBrand href="/">
		<img src="/Colla-Trip-rem" class="me-3 h-6 sm:h-9" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Colla-Trip</span>
	</NavBrand>

	<!-- Hamburger Menu for Mobile -->
	<NavHamburger class="md:hidden" />

	<!-- Navigation Links -->
	<NavUl class="hidden md:flex space-x-6">
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Navbar</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>

	<!-- Call-to-Action Button -->
	<Button size="sm" class="hidden md:block bg-blue-500 hover:bg-blue-600 text-white">
		Get Started
	</Button>
</Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>