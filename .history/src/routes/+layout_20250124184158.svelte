<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger} from 'flowbite-svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/output.css">
</svelte:head>

<nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
	<div>
		<a href="/" class="text-xl font-bold">Welcome Landing Page</a>
	</div>
	<div class="space-x-4">
		<a href="/" class="hover:text-blue-400">Home</a>
		<a href="/loginpage" class="hover:text-blue-400">Login</a>
	</div>
</nav>


{@render children()}
