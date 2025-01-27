<script>
    import { onMount } from 'svelte';
    let bounceHeight = 100;
 
    onMount(() => {
        let bounces = 4;
        const interval = setInterval(() => {
            if (bounces > 0) {
                bounceHeight *= 0.7;
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

    section {
        background: linear-gradient(135deg, #00c6ff, #8dbefa, #d7e9ff);
        background-size: cover;
        background-position: center;
    }
</style>
 
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
    
    <img 
        src="/Colla-TripLogo-rem.png" 
        alt="Travel Planner Logo" 
        class="w-70 h-70 mb-6 drop-shadow-lg relative z-10 bounce-animation"
        style="--bounce-height: {bounceHeight}">
        
    <h1 class="text-4xl font-bold text-white relative z-10">Plan Your Next Adventure</h1>
    <p class="mt-4 text-lg text-white relative z-10">Discover, organize, and enjoy your trips effortlessly.</p>
</section>

