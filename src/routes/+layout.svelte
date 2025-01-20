<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/output.css">
</svelte:head>

<nav>
	<a href="/">Welcome Landing Page</a>
	<a href="/">Login</a>
</nav>


{@render children()}
