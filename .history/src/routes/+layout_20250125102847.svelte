<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<Navbar class="bg-gray-800 text-white fixed w-full p-4">
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold">Colla-Trip</span>
	</NavBrand>
	<NavUl>
		<NavLi>
			<a href="/" class="hover:text-blue-400">Home</a>
		</NavLi>
		<NavLi>
			<a href="/explore" class="hover:text-blue-400">Explore</a>
		</NavLi>
		<NavLi>
			<a href="/loginpage" class="hover:text-blue-400">Login</a>
		</NavLi>
	</NavUl>
	<NavHamburger />
</Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>