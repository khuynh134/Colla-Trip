<script lang="ts">
	import '../../app.css';
	let scrolled = false;

	// Detect scroll position
	window.addEventListener('scroll', () => {
		scrolled = window.scrollY > 50;
	});
</script>

<nav class="{scrolled ? 'bg-gray-800 shadow-md' : 'bg-transparent'} fixed w-full text-white p-4 transition duration-300">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-xl font-bold">Travel Planner</a>
		<div class="space-x-6">
			<a href="/" class="hover:text-blue-400">Home</a>
			<a href="/explore" class="hover:text-blue-400">Explore</a>
			<a href="/loginpage" class="hover:text-blue-400">Login</a>
		</div>
	</div>
</nav>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}
</style>