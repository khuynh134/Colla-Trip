<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, Button } from 'flowbite-svelte';
</script>

<Navbar class="bg-gray-800 text-white fixed w-full p-4">
	<NavBrand href="/">
		<img src="/Colla-TripLogo-rem.png" class="me-3 h-20 sm:h-25" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-xl font-bold">Colla-Trip</span>
	</NavBrand>

	<!-- Navigation Menu -->
	<div class="flex items-center space-x-8">
		<NavUl class="flex space-x-6">
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/docs/components/navbar">Log In</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl>

		<!-- Call to Action Button -->
		<Button size="sm" class="bg-blue-500 hover:bg-blue-600 text-white">
			Get Started
		</Button>
	</div>
</Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>