<section class="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
    <svg class="absolute w-full h-full" viewBox="0 0 100 100">
        <!-- Cloud patterns -->
        <path class="cloud" d="M10,30 Q15,20 20,30" fill="none" stroke="rgba(255,255,255,0.3)">
            <animate attributeName="d" 
                values="M10,30 Q15,20 20,30; M15,30 Q20,20 25,30; M10,30 Q15,20 20,30"
                dur="3s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate"
                values="0,0; 100,0; 0,0" dur="15s" repeatCount="indefinite"/>
        </path>
        
        <!-- Flying elements -->
        <path d="M20,50 l5,-2 l5,2" stroke="white" fill="none">
            <animateTransform attributeName="transform" type="translate"
                values="-20,0; 120,0" dur="7s" repeatCount="indefinite"/>
        </path>
        
        <!-- Gradient background -->
        <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#84eaeb">
                    <animate attributeName="stop-color" 
                        values="#84eaeb;#3598db;#84eaeb" 
                        dur="5s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" style="stop-color:#3598db"/>
            </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#skyGradient)"/>
    </svg>
    
    <img src="/Colla-TripLogo-rem.png" alt="Travel Planner Logo" class="w-70 h-70 mb-6 drop-shadow-lg relative z-10">
    <h1 class="text-4xl font-bold text-white relative z-10">Plan Your Next Adventure</h1>
    <p class="mt-4 text-lg text-white relative z-10">Discover, organize, and enjoy your trips effortlessly.</p>
</section>

<style>
	section {
		background: linear-gradient(135deg, #00c6ff, #8dbefa, #d7e9ff); /* Cyan gradient */
		background-size: cover;
		background-position: center;
	}
</style>