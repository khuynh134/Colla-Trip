<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<a href="/">Welcome Landing Page</a>
	<a href="/">Login</a>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-around;
        padding: 1em;
        background-color: #65dede;
        border-bottom: 1px solid #35f0ed;

    }

    nav a {
        text-decoration: none;
        color: #333;
    }

    /* h1, p {
        text-align: center; 
    } */
</style>
{@render children()}
