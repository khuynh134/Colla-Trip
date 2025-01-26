<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar class="bg-[#3598db] text-white fixed w-full p-4 flex items-center justify-between z-50">
	<!-- Logo and Brand Section -->
	<NavBrand href="/" class="flex items-center">
		<img src="/Colla-TripLogo-rem.png" class="h-20 mr-10" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-3xl font-extrabold">Colla-Trip</span>
	</NavBrand>
 
	<!-- Navigation Links and Login Button -->
	<div class="flex items-center space-x-12">
		<a href="/" class="text-white">Home</a>
		<a href="/explore" class="text-white">Explore</a>
		<a href="/about" class="text-white">About</a>
		<a href="/contac" class="text-white">Contact Us</a>
		<a href="/loginpage" class="bg-white text-cyan-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
			Log In
		</a>
	</div>
 </Navbar>

<div class="pt-20">
	<slot />
</div>

<footer class="bg-[#84eaeb] text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>