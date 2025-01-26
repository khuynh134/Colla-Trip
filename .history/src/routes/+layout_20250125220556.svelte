<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<svelte:head>
	<link rel="stylesheet" href="/styles.css">
	<link rel="stylesheet" href="/output.css">
</svelte:head>

<Navbar let:hidden let:toggle fluid={true}>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold">
			Colla-Trip
		</span>
	</NavBrand>
	
	<NavHamburger on:click={toggle} />
	
	<NavUl {hidden}>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/explore">Explore</NavLi>
		<NavLi href="/loginpage">Login</NavLi>
	</NavUl>
</Navbar>

{@render children()}

<footer class="bg-gray-800 text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>