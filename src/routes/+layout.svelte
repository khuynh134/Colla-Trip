<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger} from 'flowbite-svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/output.css">
</svelte:head>

<nav>
	<a href="/">Welcome Landing Page</a>
	<a href="/loginpage">Login page</a>
</nav>


{@render children()}
