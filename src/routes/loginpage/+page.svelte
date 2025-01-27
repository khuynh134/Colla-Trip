<script lang="ts">
	import '../../app.css';
	let name = $state('');

	import { goto } from '$app/navigation'; 

	function handleSignUpClick(event: Event){
		event.preventDefault();
		goto('/signuppage');
	}
 </script>
 
 <div class="min-h-screen bg-gradient-to-r from-[#84eaeb] to-[#3598db] flex flex-col items-center justify-center p-4">
	<div class="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
		<h1 class="text-3xl font-bold text-[#3598db] mb-6 text-center">Welcome Back!</h1>
		
		<form method="post" class="space-y-6">
			<div>
				<label for="email" class="block text-gray-700 mb-2">Email</label>
				<input 
					id="email" 
					type="email" 
					placeholder="Enter your email"
					class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
				/>
			</div>
			
			<div>
				<label for="password" class="block text-gray-700 mb-2">Password</label>
				<input 
					id="password" 
					type="password" 
					placeholder="Enter your password"
					class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
				/>
			</div>
 
			<button 
				type="submit" 
				class="w-full bg-[#3598db] text-white py-3 rounded-lg hover:bg-[#3598db]/90 transition-colors"
			>
				Login
			</button>
		</form>
		
		<p class="mt-4 text-center text-gray-600">
			Don't have an account? 
			<a href="/signuppage" class="text-[#3598db] hover:underline" onclick={handleSignUpClick}>Sign up</a>
		</p>
	</div>
 </div>