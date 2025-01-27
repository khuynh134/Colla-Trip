<script>
	import { onMount } from 'svelte';
	let isAnimating = true;
	
	onMount(() => {
		let duration = 1;
		let bounces = 0;
		const animate = () => {
			if (bounces < 4) {
				duration += 0.5; // Slow down each bounce
				bounces++;
				setTimeout(animate, duration * 1000);
			} else {
				isAnimating = false;
			}
		};
		animate();
	});
 </script>
 
 <style>
	@keyframes slowBounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20px); }
	}
	
	.bouncing {
		animation: slowBounce var(--duration) ease-in-out;
	}
 </style>
 
 <img 
	src="/Colla-TripLogo-rem.png" 
	alt="Travel Planner Logo" 
	class="w-70 h-70 mb-6 drop-shadow-lg relative z-10"
	class:bouncing={isAnimating}
	style="--duration: {duration}s">
        
    <h1 class="text-4xl font-bold text-white relative z-10">Plan Your Next Adventure</h1>
    <p class="mt-4 text-lg text-white relative z-10">Discover, organize, and enjoy your trips effortlessly.</p>
</section>

