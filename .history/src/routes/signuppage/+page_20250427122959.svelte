<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { getAuth, validatePassword, createUserWithEmailAndPassword } from 'firebase/auth';
	import { Users } from 'lucide-svelte';
    import { page } from '$app/stores';

    let token = '';
    $: token = $page.url.searchParams.get('token') || '';  // ✅ reactive!

    // Form state
    let firstName = '';
    let lastName = '';
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = ''; 
    let success: boolean | undefined = undefined;
    let isLoading = false;

    // (No need for onMount anymore!)

    async function validatePasswords(): Promise<boolean> {
        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            success = false;
            return false;
        }
        const status = await validatePassword(getAuth(), password);
        if (!status.isValid) {
            errorMessage = 'Password does not meet requirements';
            if (status.containsLowercaseLetter !== true) errorMessage += ' (needs lowercase)';
            if (status.containsUppercaseLetter !== true) errorMessage += ' (needs uppercase)';
            if (status.containsNumericCharacter !== true) errorMessage += ' (needs number)';
            if (status.meetsMinPasswordLength !== true) errorMessage += ' (needs 8 characters)';
            success = false;
            return false;
        }
        return true;
    }

    async function isUsernameUnique(username: string): Promise<boolean> {
        return true; // Placeholder
    }

    async function handleSignUp(event: Event) {
        event.preventDefault();
        isLoading = true;
        errorMessage = '';
        success = undefined;

        if (!await validatePasswords()) {
            isLoading = false;
            return;
        }

        const isUnique = await isUsernameUnique(username);
        if (!isUnique) {
            errorMessage = 'Username is already taken';
            success = false;
            isLoading = false;
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebase_uid: user.uid,
                    email: user.email,
                    username: username,
                    profile: `${firstName} ${lastName}`,
                    roles: ['user'],
                    token: token  
                })
            });

            if (!response.ok) {
                throw new Error('Error saving user to database');
            }

            success = true;
            const redirectUrl = token ? `/invite-success` : '/loginpage';
            goto(redirectUrl);
        } catch (error) {
            console.error('Error signing up:', error);
            errorMessage = 'Error signing up. Please try again.';
            success = false;
        } finally {
            isLoading = false;
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
                <label for="firstName" class="block text-gray-700 mb-2">First Name</label>
                <input 
                    id="firstName" 
                    type="text" 
                    bind:value={firstName} 
                    placeholder="Enter your first name"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label for="lastName" class="block text-gray-700 mb-2">Last Name</label>
                <input 
                    id="lastName" 
                    type="text" 
                    bind:value={lastName} 
                    placeholder="Enter your last name"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label for="username" class="block text-gray-700 mb-2">Username</label>
                <input 
                    id="username" 
                    type="text" 
                    bind:value={username} 
                    placeholder="Choose a username"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                    required
                />
                <p class="text-sm text-gray-500 mt-1">Username must be unique</p>
            </div>

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
                    minlength="8"
                />
                <p class="text-sm text-gray-500 mt-1">Password must be at least 8 characters long, must contain lower case, uppercase & a number</p>
            </div>

            <div>
                <label for="confirmPassword" class="block text-gray-700 mb-2">Confirm Password</label>
                <input 
                    id="confirmPassword" 
                    type="password" 
                    bind:value={confirmPassword} 
                    placeholder="Re-enter your password"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3598db] focus:border-transparent"
                    required
                    minlength="8"
                />
            </div>
 
            <button 
                type="submit" 
                class="w-full bg-[#3598db] text-white py-3 rounded-lg hover:bg-[#3598db]/90 transition-colors disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
        </form>

        <div class="mt-6 text-center">
            <p class="text-gray-600">
                Already have an account? 
                <a href="/loginpage" class="text-[#3598db] hover:underline">Log in</a>
            </p>
        </div>
    </div>
</div>