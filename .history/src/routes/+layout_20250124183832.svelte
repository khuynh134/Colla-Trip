<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger} from 'flowbite-svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/output.css">
</svelte:head>

<nav class="bg-gray-800 text-white p-4">
	<a href="/" class="px-4 hover:text-blue-400">Welcome Landing Page</a>
	<a href="/loginpage" class="px-4 hover:text-blue-400">Login Page</a>
  </nav>


{@render children()}
