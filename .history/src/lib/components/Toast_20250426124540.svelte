<script lang="ts">
    import { showToast, toastMessage } from '$lib/stores/notifications';
  </script>
  
  {#if $showToast}
    <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md z-50">
      {$toastMessage}
    </div>
  {/if}