<script lang="ts">
    import { notifications, type Notification } from '$lib/stores/notifications';
    import { goto } from '$app/navigation';
  
    // Component state
    let isOpen = false;
    let unreadCount = 0;
  
    // Reactive statement to count unread notifications
    $: unreadCount = $notifications.filter(n => !n.read).length;
  
    // Function to toggle notifications
    function toggleNotifications() {
      isOpen = !isOpen;
      if (isOpen) {
        notifications.markAllAsRead();
      }
    }
  
    // Function to handle notification action
    function handleNotificationAction(notification: Notification) {
      if (notification.action?.onClick) {
        notification.action.onClick();
      }
      if (notification.action?.href) {
        goto(notification.action.href);
      }
      notifications.markAsRead(notification.id);
    }
  
    // Format timestamp
    function formatTimestamp(timestamp: Date) {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes}m`;
      return `${seconds}s`;
    }
  </script>
  
  <div class="fixed top-4 right-4 z-50">
    <!-- Notification Bell -->
    <button 
      on:click={toggleNotifications}
      class="relative bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {#if unreadCount > 0}
        <span 
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                 w-5 h-5 flex items-center justify-center rounded-full"
        >
          {unreadCount}
        </span>
      {/if}
    </button>
  
    <!-- Notifications Slide-out -->
    {#if isOpen}
      <div 
        class="fixed top-20 right-4 w-96 bg-white shadow-2xl rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-bold text-gray-800">Notifications</h2>
          <button 
            on:click={() => notifications.clearNotifications()}
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
  
        <!-- Notifications List -->
        {#if $notifications.length === 0}
          <div class="p-4 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications</p>
          </div>
        {:else}
          <ul>
            {#each $notifications as notification (notification.id)}
              <li 
                class="px-4 py-3 border-b last:border-b-0 
                       hover:bg-gray-50 transition-colors 
                       cursor-pointer flex items-start"
                on:click={() => handleNotificationAction(notification)}
              >
                <!-- Notification Content -->
                <div class="flex-grow">
                  <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-gray-800">{notification.title}</h3>
                    <span class="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{notification.message}</p>
                  
                  <!-- Action Button -->
                  {#if notification.action}
                    <button 
                      class="mt-2 text-sm text-blue-600 hover:text-blue-800 
                             flex items-center gap-1"
                    >
                      {notification.action.label}
                    </button>
                  {/if}
                </div>
  
                <!-- Read Status -->
                {#if !notification.read}
                  <div class="ml-2 mt-1">
                    <span class="w-2 h-2 bg-blue-500 rounded-full block"></span>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  </div>