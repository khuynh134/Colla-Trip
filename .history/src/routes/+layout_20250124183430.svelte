<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger} from 'flowbite-svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/output.css">
</svelte:head>

<Navbar class="bg-gray-800 text-white">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-2xl font-semibold">My App</span>
	</NavBrand>
	<NavUl>
		<NavLi>
			<a href="/">Home</a>
		</NavLi>
		<NavLi>
			<a href="/loginpage">Login</a>
		</NavLi>
	</NavUl>
	<NavHamburger />
</Navbar>


{@render children()}
