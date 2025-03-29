<script lang="ts">
    import '../../app.css';
    import { onMount } from 'svelte';

  
    // Form data state
    let firstName = '';
    let lastName = '';
    let email = '';
    let message = '';
    
    // Form status
    let isSubmitting = false;
    let submitSuccess = false;
    let submitError = '';
  
    // Get the access key from environment variables
    const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    // Handle form submission
    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
      
      // Form validation
      if (!firstName || !lastName || !email || !message) {
        submitError = 'Please fill in all fields';
        return;
      }
      
      try {
        isSubmitting = true;
        submitError = '';
        
        // Send data to Web3Forms
        const formData = new FormData();
        formData.append('access_key', WEB3FORMS_ACCESS_KEY);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('email', email);
        formData.append('message', message);
        // Optional: Add a subject
        formData.append('subject', 'New Contact Form Submission');
        // Add any custom fields you want
        formData.append('from_page', 'Contact Page');
        
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Clear form on success
          firstName = '';
          lastName = '';
          email = '';
          message = '';
          submitSuccess = true;
          
          // Reset success message after 5 seconds
          setTimeout(() => {
            submitSuccess = false;
          }, 5000);
        } else {
          throw new Error(data.message || 'Failed to send message');
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
        submitError = 'Failed to send message. Please try again later.';
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  
  <div class="min-h-screen bg-gradient-to-r from-[#84eaeb] to-[#3598db] flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white/90 rounded-lg p-8 shadow-lg">
      <h1 class="text-3xl font-bold text-[#3598db] mb-6 text-center">Contact Us</h1>
      
      {#if submitSuccess}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
          Thank you for your message! We'll get back to you soon.
        </div>
      {/if}
      
      {#if submitError}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
          {submitError}
        </div>
      {/if}
      
      <form class="space-y-6" on:submit={handleSubmit}>
        <!-- Web3Forms requires a hidden field with the access key -->
        <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY}>
        <!-- Optional: Honeypot field to prevent spam -->
        <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="first-name" class="block text-gray-700 mb-2">First Name</label>
            <input id="first-name" name="first_name" type="text" class="w-full p-3 border rounded-lg" bind:value={firstName} required />
          </div>
          <div>
            <label for="last-name" class="block text-gray-700 mb-2">Last Name</label>
            <input id="last-name" name="last_name" type="text" class="w-full p-3 border rounded-lg" bind:value={lastName} required />
          </div>
        </div>
        
        <div>
          <label for="email" class="block text-gray-700 mb-2">Email</label>
          <input id="email" name="email" type="email" class="w-full p-3 border rounded-lg" bind:value={email} required />
        </div>
        
        <div>
          <label for="message" class="block text-gray-700 mb-2">Message</label>
          <textarea id="message" name="message" rows="4" class="w-full p-3 border rounded-lg resize-none" bind:value={message} required></textarea>
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-[#3598db] text-white py-3 rounded-lg hover:bg-[#3598db]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3598db] focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  </div>