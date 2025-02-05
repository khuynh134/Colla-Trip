<script lang="ts">
    import '../../app.css';
    import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { createUserWithEmailAndPassword } from 'firebase/auth';

    let email = '';
    let password = '';
    let errorMessage = ''; 
    let success: boolean | undefined = undefined; 


    async function handleSignUp(event: Event) {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Signed in successfully
            const user = userCredential.user; 
            console.log(user);
            success = true;
            // Redirect to another page after successful signup
            goto('/loginpage'); 
        } catch (error) {
            console.error('Error signing up:', error);
            errorMessage = 'Error signing up. Please try again.';
            success = false;
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-r from-[#84eaeb] to-[#3598db] flex flex-col items-center justify-center p-4">
    <div class="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-3xl font-bold text-[#3598db] mb-6 text-center">Sign Up</h1>
        
        {#if success === true}
            <p class="text-green-600 text-center mb-4">Signup successful! Redirecting...</p>
        {:else if success === false}
            <p class="text-red-600 text-center mb-4">{errorMessage}</p>
        {/if}
        
        <form on:submit={handleSignUp} class="space-y-6">
            <div>
                <label for="email" class="block text-gray-700 mb-2">Email</label>
                <input 
                    id="email" 
                    type="email" 
                    bind:value={email} 
                    placeholder="Enter your email"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                    required
                />
            </div>
            
            <div>
                <label for="password" class="block text-gray-700 mb-2">Password</label>
                <input 
                    id="password" 
                    type="password" 
                    bind:value={password} 
                    placeholder="Enter your password"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                    required
                />
            </div>
 
            <button 
                type="submit" 
                class="w-full bg-[#3598db] text-white py-3 rounded-lg hover:bg-[#3598db]/90 transition-colors"
            >
                Sign Up
            </button>
        </form>
    </div>
</div>

