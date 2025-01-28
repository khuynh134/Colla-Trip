<Navbar class="bg-[#3598db] text-white fixed w-full p-4 z-50">
	<div class="flex justify-between items-center w-full">
		<div class="flex items-center">
			<NavBrand href="/" class="flex items-center">
				<img src="/Colla-TripLogo-rem.png" class="h-12 mr-3" alt="Colla-Trip Logo" />
			</NavBrand>
 
			<!-- Desktop Menu -->
			<div class="hidden md:flex items-center space-x-6 ml-4">
				<a href="/" class="text-white font-bold">Home</a>
				<a href="/explore" class="text-white font-bold">Explore</a>
				<a href="/aboutpage" class="text-white font-bold">About</a>
				<a href="/contactpage" class="text-white font-bold">Contact Us</a>
			</div>
		</div>
 
		<div class="flex items-center">
			<!-- Login Button -->
			<a href="/loginpage" class="hidden md:block bg-white text-[#3598db] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-bold">
				Log In
			</a>
 
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
	</div>
 
	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden absolute top-full left-0 right-0 bg-[#3598db] p-4">
			<div class="flex flex-col space-y-4">
				<a href="/" class="text-white">Home</a>
				<a href="/explore" class="text-white">Explore</a>
				<a href="/aboutpage" class="text-white">About</a>
				<a href="/contactpage" class="text-white">Contact Us</a>
				<a href="/loginpage" class="bg-white text-cyan-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-center">
					Log In
				</a>
			</div>
		</div>
	{/if}
 </Navbar>
 
 <div class="pt-20">
	<slot />
 </div>
 
 <footer class="bg-[#84eaeb] text-blue-700 p-4 text-center font-bold">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
 </footer>