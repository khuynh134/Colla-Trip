<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, Button } from 'flowbite-svelte';
</script>

<Navbar class="bg-blue-400 text-white fixed w-full p-4">
	<NavBrand href="/">
		<img src="/Colla-TripLogo.png" class="me-3 h-9 sm:h-12" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Colla-Trip</span>
	</NavBrand>

	<!-- Navigation Links -->
	<NavUl class="flex space-x-4">
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Log In</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>

	<!-- Call to Action Button -->
	<Button class="ml-auto hidden md:block" size="sm">
		Get Started
	</Button>
</Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>