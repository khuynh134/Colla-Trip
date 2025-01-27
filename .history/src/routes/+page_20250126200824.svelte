<script>
	import { onMount } from 'svelte';
	let bounceHeight = 100;
 
	onMount(() => {
		let bounces = 4;
		const interval = setInterval(() => {
			if (bounces > 0) {
				bounceHeight *= 0.7; // Reduce height by 30% each bounce
				bounces--;
			} else {
				clearInterval(interval);
			}
		}, 1000);
	});
 </script>
 
 <style>
	.bounce-animation {
		animation: bounce 1s ease-in-out infinite;
	}
 
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(calc(-1px * var(--bounce-height)));
		}
	}
 </style>
 
 <section class="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
	<!-- SVG gradient background remains the same -->
	
	<img 
		src="/Colla-TripLogo-rem.png" 
		alt="Travel Planner Logo" 
		class="w-70 h-70 mb-6 drop-shadow-lg relative z-10 bounce-animation"
		style="--bounce-height: {bounceHeight}">
	
	<!-- Rest of the content remains the same -->
 </section>

<style>
	section {
		background: linear-gradient(135deg, #00c6ff, #8dbefa, #d7e9ff); /* Cyan gradient */
		background-size: cover;
		background-position: center;
	}
</style>