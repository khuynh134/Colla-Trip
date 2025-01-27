<section class="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
    <svg class="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#84eaeb" class="animate-pulse">
                    <animate attributeName="stop-color" 
						values="#ddebf5;#bbebf5;#ffebf5;#ddebf5" 
                        dur="10s" 
                        repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" style="stop-color:#3598db">
                    <animate attributeName="stop-color" 
                        values="#3598db;#84eaeb;#3598db" 
                        dur="4s" 
                        repeatCount="indefinite"/>
                </stop>
            </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad)"/>
    </svg>
    
	<script>
		import { onMount } from 'svelte';
		let bounceCount = 0;
		let shouldBounce = true;
	 
		onMount(() => {
			const interval = setInterval(() => {
				bounceCount++;
				if (bounceCount >= 4) {
					shouldBounce = false;
					clearInterval(interval);
				}
			}, 1500); // 1.5s per bounce
		});
	 </script>
	 
	 <img 
		src="/Colla-TripLogo-rem.png" 
		alt="Travel Planner Logo" 
		class="{shouldBounce ? 'animate-bounce' : ''} w-70 h-70 mb-6 drop-shadow-lg relative z-10">
</section>

<style>
	section {
		background: linear-gradient(135deg, #00c6ff, #8dbefa, #d7e9ff); /* Cyan gradient */
		background-size: cover;
		background-position: center;
	}
</style>