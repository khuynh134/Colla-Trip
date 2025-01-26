<script>
	import '../app.css';
  </script>
  
  <div class="container mx-auto">
	<div class="pt-24 pb-8 text-center">
	  <h1 class="text-5xl font-bold mb-4">Plan Your Next Adventure</h1>
	  <p class="text-xl mb-8">Collaborate with friends and make travel planning easy</p>
	  <button class="bg-[#84eaeb] text-white px-8 py-3 rounded-lg text-xl hover:bg-[#3598db]">
		Start Planning
	  </button>
	</div>
  
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 my-12">
	  <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-2xl font-bold mb-3 text-[#3598db]">Group Planning</h3>
		<p>Create shared itineraries and vote on destinations</p>
	  </div>
	  
	  <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-2xl font-bold mb-3 text-[#3598db]">Budget Tracking</h3>
		<p>Split expenses and track group spending easily</p>
	  </div>
	  
	  <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-2xl font-bold mb-3 text-[#3598db]">Travel Tips</h3>
		<p>Get local recommendations and travel guides</p>
	  </div>
	</div>
  </div>

<Navbar class="bg-[#3598db] text-white fixed w-full p-4 flex items-center justify-between z-50">
	<!-- Logo and Brand Section -->
	<NavBrand href="/" class="flex items-center">
		<img src="/Colla-TripLogo-rem.png" class="h-20 mr-10" alt="Colla-Trip Logo" />
		<span class="self-center whitespace-nowrap text-3xl font-extrabold">Colla-Trip</span>
	</NavBrand>
 
	<!-- Navigation Links and Login Button -->
	<div class="flex items-center space-x-12">
		<a href="/" class="text-white">Home</a>
		<a href="/explore" class="text-white">Explore</a>
		<a href="/services" class="text-white">Services</a>
		<a href="/loginpage" class="bg-white text-cyan-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
			Log In
		</a>
	</div>
 </Navbar>

<div class="pt-20">
	<slot />
</div>

<footer class="bg-[#84eaeb] text-white p-4 text-center">
	<p>&copy; 2025 Colla-Trip. All rights reserved.</p>
	<p>Plan your trips with ease!</p>
</footer>