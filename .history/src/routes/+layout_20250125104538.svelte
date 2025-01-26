<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input } from 'flowbite-svelte';
</script>

  <Navbar>
	<NavBrand href="/">
	  <img src="/Colla-TripLogo.png" class="me-3 h-7 sm:h-10" alt="Colla Trip Logo" />
	  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<div class="flex md:order-2">
	  <Button size="sm">Get started</Button>
	  <NavHamburger />
	</div>
	<NavUl class="order-1">
	  <NavLi href="/" active={true}>Home</NavLi>
	  <NavLi href="/about">About</NavLi>
	  <NavLi href="/docs/components/navbar">Log In</NavLi>
	  <NavLi href="/contact">Contact</NavLi>
	</NavUl>
  </Navbar>

<slot />

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>