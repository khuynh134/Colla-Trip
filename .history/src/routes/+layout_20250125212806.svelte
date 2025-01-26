<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, Button } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
	  <img src="/Colla-Trip-rem" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
	  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<NavHamburger  />
	<NavUl >
	  <NavLi href="/">Home</NavLi>
	  <NavLi href="/about">About</NavLi>
	  <NavLi href="/docs/components/navbar">Navbar</NavLi>
	  <NavLi href="/pricing">Pricing</NavLi>
	  <NavLi href="/contact">Contact</NavLi>
	</NavUl>
  </Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>