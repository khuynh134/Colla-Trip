<script lang="ts">
    import { showToast, toastMessage } from '$lib/stores/notifications';
  </script>
  
  {#if $showToast}
    <div class="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-50">
      {$toastMessage}
    </div>
  {/if}
  
  <style>
    @keyframes fadeInOut {
      0%, 100% { opacity: 0; transform: translateY(20px); }
      10%, 90% { opacity: 1; transform: translateY(0); }
    }
  
    .animate-fade-in-out {
      animation: fadeInOut 3s ease-in-out forwards;
    }
  </style>