<script lang="ts">
  import { onMount } from 'svelte';
  import { Mail } from 'lucide-svelte';
  import { writable } from 'svelte/store';
  import { notifications } from '$lib/stores/notifications'; 
  import { createFormOpen } from '$lib/stores/createFormStore';
  import { goto } from '$app/navigation';
  import { isAuthenticated, logout } from '$lib/stores/authStore';
  import { LogIn, LogOut } from 'lucide-svelte';

  // State variables
  export let sidebarExtended = false;
  export let sidebarWidth = '80px';
  export let notificationsOpen = false;

  let invites = writable([]);  // <-- Your trip invites
  let sidebarTransition = '';

  // Reactive sidebar
  $: sidebarWidth = sidebarExtended ? '300px' : '80px';

  $: unreadNotificationsCount = $invites.length;

  // Sidebar mouse enter/leave
  function handleMouseEnter() { sidebarExtended = true; }
  function handleMouseLeave() { sidebarExtended = false; }

  // Toggle notification panel
  function toggleNotifications() { notificationsOpen = !notificationsOpen; }

  // Fetch invites on mount
  onMount(async () => {
    try {
      const res = await fetch('/api/my-invites');
      if (res.ok) {
        invites.set(await res.json());
      } else {
        console.error('Failed to load invites');
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  });

  // Accept Invite
  async function acceptInvite(inviteId: number) {
    try {
      const res = await fetch('/api/invite-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, action: 'accept' })
      });
      if (res.ok) {
        invites.update(inv => inv.filter(i => i.id !== inviteId));
        goto('/totaltripspage');
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  }

  // Decline Invite
  async function declineInvite(inviteId: number) {
    try {
      const res = await fetch('/api/invite-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, action: 'decline' })
      });
      if (res.ok) {
        invites.update(inv => inv.filter(i => i.id !== inviteId));
      }
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  }

  async function handleAuthButton() {
    if ($isAuthenticated) {
      const result = await logout();
      if (result.success) goto('/');
    } else {
      goto('/loginpage');
    }
  }
</script>
<nav 
class="fixed left-0 top-0 h-full bg-[#3598db] text-white p-4 flex flex-col {sidebarTransition}"
style="width: {sidebarWidth};"
on:mouseenter={handleMouseEnter}
on:mouseleave={handleMouseLeave}
aria-label="Sidebar"
>
<div class="space-y-8 mt-40">

  <!-- Create Trip Link -->
  <a 
    href="#" 
    class="flex items-center p-1 hover:bg-blue-600 rounded-lg transition-colors"
    on:click|preventDefault={() => createFormOpen.set(true)}
  >
    <div class="bg-[#85e9eb] p-2 rounded-full">
      <svg ...></svg>  <!-- Your Plus Icon -->
    </div>
    {#if sidebarExtended}
      <div class="ml-4">
        <span class="text-lg">Create</span>
      </div>
    {/if}
  </a>

  <!-- Notifications (Envelope Icon) -->
  <a 
    href="#" 
    class="relative flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors"
    on:click|preventDefault={toggleNotifications}
  >
    <div class="relative">
      <Mail class="w-7 h-7 text-white group-hover:text-gray-200" />
      {#if unreadNotificationsCount > 0}
        <span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadNotificationsCount}
        </span>
      {/if}
    </div>
    {#if sidebarExtended}
      <div class="ml-4">
        <span class="text-lg">Notifications</span>
      </div>
    {/if}
  </a>

  <!-- Other sidebar links -->
  <a href="/dashboardpage" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors">
    <svg ...></svg>
    {#if sidebarExtended}
      <div class="ml-4"><span class="text-lg">Dashboard</span></div>
    {/if}
  </a>

</div>

<!-- Logout Link -->
<div class="mt-auto mb-8">
  <a href="#" class="flex items-center p-3 hover:bg-blue-600 rounded-lg transition-colors" on:click|preventDefault={handleAuthButton}>
    {#if $isAuthenticated}
      <LogOut class="h-6 w-6" />
      {#if sidebarExtended}<div class="ml-4"><span class="text-lg">Log Out</span></div>{/if}
    {:else}
      <LogIn class="h-6 w-6" />
      {#if sidebarExtended}<div class="ml-4"><span class="text-lg">Log In</span></div>{/if}
    {/if}
  </a>
</div>
</nav>
{#if notificationsOpen}
  <div 
    class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Trip Invitations</h2>
      <button on:click={() => notificationsOpen = false} class="text-gray-500 hover:text-gray-700">
        <svg ...></svg> <!-- X Close Icon -->
      </button>
    </div>

    {#if $invites.length === 0}
      <div class="text-center text-gray-500 py-6">
        No new invitations
      </div>
    {:else}
      <ul class="space-y-4">
        {#each $invites as invite (invite.id)}
          <li class="bg-gray-100 p-4 rounded-lg shadow space-y-2">
            <p class="text-gray-700">📩 You were invited to: <b>{invite.trip_title}</b></p>
            <div class="flex gap-2">
              <button 
                class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                on:click={() => acceptInvite(invite.id)}
              >
                Accept
              </button>
              <button 
                class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                on:click={() => declineInvite(invite.id)}
              >
                Decline
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}