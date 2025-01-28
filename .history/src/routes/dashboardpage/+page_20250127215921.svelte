<script lang="ts">
    import { Card, Navbar, NavBrand } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import '../app.css';

    let isMenuOpen: boolean = false;
    $: showNavbar = !$page.url.pathname.startsWith('/dashboard');
</script>

{#if showNavbar}
<Navbar class="bg-[#3598db] text-white fixed w-full p-4 z-50">
	<div class="container mx-auto flex justify-between items-center">
		<NavBrand href="/" class="flex items-center">
			<img src="/Colla-TripLogo-rem.png" class="h-20 mr-10 drop-shadow-lg" alt="Colla-Trip Logo" />
			<span class="self-center whitespace-nowrap text-3xl font-extrabold">Colla-Trip</span>
		</NavBrand>
 
		<!-- Desktop Menu -->
		<div class="hidden md:flex items-center space-x-12 ml-auto">
			<a href="/" class="text-white font-bold text-lg">Home</a>
			<a href="/explore" class="text-white font-bold text-lg">Explore</a>
			<a href="/aboutpage" class="text-white font-bold text-lg">About</a>
			<a href="/contactpage" class="text-white font-bold text-lg">Contact Us</a>
			<a href="/loginpage" class="bg-white text-cyan-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg">
				Log In
			</a>
		</div>
 
		<!-- Hamburger Button -->
		<button 
			class="md:hidden text-white"
			on:click={() => isMenuOpen = !isMenuOpen}
			aria-label="Toggle menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
			</svg>
		</button>
	</div>
 
	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden absolute top-full left-0 right-0 bg-[#3598db] p-4">
			<div class="flex flex-col space-y-4">
				<a href="/" class="text-white">Home</a>
				<a href="/explore" class="text-white">Explore</a>
				<a href="/aboutpage" class="text-white">About</a>
				<a href="/contactpage" class="text-white">Contact Us</a>
				<a href="/loginpage" class="bg-white text-cyan-600 px-4 py-2 rounded-md transition-colors text-center">
					Log In
				</a>
			</div>
		</div>
	{/if}
 </Navbar>
{/if}

 <div class="min-h-screen bg-gray-50">
    <!-- Left Sidebar -->
    <nav class="fixed left-0 top-0 h-full w-72 bg-[#3598db] text-white p-12">
        <div class="flex items-center mb-12">
            <img src="/Colla-TripLogo-rem.png" alt="Logo" class="w-16 h-16">
            <span class="text-2xl font-bold ml-4">Colla-Trip</span>
        </div>
        
        <div class="space-y-6">
            <a href="/overview" class="flex items-center p-4 hover:bg-blue-600 rounded-lg">
                <span class="text-lg">Overview</span>
            </a>
            <a href="/trips" class="flex items-center p-4 hover:bg-blue-600 rounded-lg">
                <span class="text-lg">Trips</span>
            </a>
            <a href="/polls" class="flex items-center p-4 hover:bg-blue-600 rounded-lg">
                <span class="text-lg">Polls</span>
            </a>
            <a href="/schedule" class="flex items-center p-4 hover:bg-blue-600 rounded-lg">
                <span class="text-lg">Schedule</span>
            </a>
            <a href="/budget" class="flex items-center p-4 hover:bg-blue-600 rounded-lg">
                <span class="text-lg">Budget</span>
            </a>
            <a href="/packing" class="flex items-center p-4 hover:bg-blue-600 rounded-lg">
                <span class="text-lg">Packing Lists</span>
            </a>
        </div>
    </nav>
 
    <!-- Main Content -->
    <div class="ml-80 p-12">
        <div class="px-8">
            <!-- Search Bar -->
            <div class="mb-8">
                <input 
                    type="text" 
                    placeholder="Search trips..." 
                    class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                />
            </div>
 
            <div class="flex justify-between items-center mb-12 pt-8">
                <div>
                    <h1 class="text-3xl font-bold">Welcome Back,</h1>
                    <p class="text-xl text-gray-600 mt-2">User Name</p>
                </div>
                <button class="bg-[#3598db] text-white px-12 py-3 rounded-lg text-lg">
                    Create Trip
                </button>
            </div>
 
            <div class="grid grid-cols-2 gap-8 mb-12">
                <Card class="p-8 shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Total Trips</h3>
                    <div class="text-4xl font-bold">5</div>
                    <div class="text-green-500 text-lg mt-2">+2 this month</div>
                </Card>
                <Card class="p-8 shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Upcoming Trips</h3>
                    <div class="text-4xl font-bold">2</div>
                    <div class="text-blue-500 text-lg mt-2">Next: Paris, France</div>
                </Card>
            </div>
 
            <Card class="p-8 shadow-lg">
                <h3 class="text-xl font-semibold mb-6">Trip Activity</h3>
                <!-- Chart component -->
            </Card>
        </div>
    </div>
 </div>