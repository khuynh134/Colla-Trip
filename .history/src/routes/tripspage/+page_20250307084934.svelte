<script lang="ts">
    import { goto } from '$app/navigation';
    import { Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { Tabs, TabItem, Modal, Button, Input, Label, Select, RadioButton, RadioGroup } from 'flowbite-svelte'; 

    import { 
        Luggage,
        Calendar,
        Receipt,
        MapPin,
        BadgeDollarSign,
        Vote,
        User,
        Clock,
        Share2,
        PlusCircle,
        UserPlus,
        Mail,
        Search
    } from 'lucide-svelte';

    // State management for sidebar
    let sidebarExtended = false;
    let sidebarWidth = '80px';
    let createFormOpen = false;

    // Add Member Modal state
    let addMemberModalOpen = false;
    let inviteMethod = 'email';
    let emailInput = '';
    let usernameInput = '';
    let searchResults = [];
    let inviteMessage = '';

    // Function to handle member invitation
    async function inviteMember() {
        try {
            // Validate inputs
            if (inviteMethod === 'email' && !emailInput) {
                alert('Please enter an email address');
                return;
            }
            
            if (inviteMethod === 'username' && !usernameInput) {
                alert('Please enter a username');
                return;
            }
            
            // Mock API call - replace with your actual API endpoint
            const res = await fetch('/api/trip-invites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: inviteMethod,
                    recipient: inviteMethod === 'email' ? emailInput : usernameInput,
                    tripId: 'summer-in-japan', // This should be dynamic based on the current trip
                    message: inviteMessage
                })
            });
            
            if (res.ok) {
                // Reset form and close modal
                emailInput = '';
                usernameInput = '';
                inviteMessage = '';
                addMemberModalOpen = false;
                
                // Show success message
                alert('Invitation sent successfully!');
            } else {
                const errorData = await res.json();
                console.error('Error sending invitation:', errorData);
                alert('Failed to send invitation. Please try again.');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('An error occurred. Please try again.');
        }
    }

    // Mock function to search for users
    function searchUsers() {
        // In a real application, this would make an API call to search for users
        if (usernameInput.length > 2) {
            // Mock results
            searchResults = [
                { id: 1, username: 'traveler123', name: 'John Doe', avatar: '/images/avatar1.jpg' },
                { id: 2, username: 'wanderlust', name: 'Jane Smith', avatar: '/images/avatar2.jpg' },
                { id: 3, username: 'globetrotter', name: 'Mike Johnson', avatar: '/images/avatar3.jpg' }
            ].filter(user => user.username.includes(usernameInput) || user.name.toLowerCase().includes(usernameInput.toLowerCase()));
        } else {
            searchResults = [];
        }
    }

    // Function to select a user from search results
    function selectUser(user) {
        usernameInput = user.username;
        searchResults = [];
    }

    // Rest of your existing code...
    const packingItems = [
        { name: 'Passport', checked: true },
        { name: 'Clothes', checked: true },
        { name: 'Toiletries', checked: false },
        { name: 'Medications', checked: true },
        { name: 'Phone Charger', checked: false },
        { name: 'Camera', checked: false },
        { name: 'Travel Adapter', checked: false }
    ];

    // State for polling notifications
    let pollNotifications = 3;
    
    // Trip data
    const tripData = {
        title: "Summer in Japan",
        location: "Tokyo, Japan",
        dates: "Jun 15 - Jun 22, 2025",
        travelers: 4,
        budget: {
            spent: 2450,
            total: 3000,
            percentage: 81
        },
        highlights: [
            "Tokyo Disneyland",
            "Mount Fuji Day Trip",
            "Shibuya Crossing",
            "Tokyo Skytree"
        ]
    };
    
    // For the progress bar animation
    import { onMount } from 'svelte';
    let animateProgress = false;
    
    onMount(() => {
        // Trigger animation after component mounts
        setTimeout(() => {
            animateProgress = true;
        }, 300);
    });

    //Function to fetchResults() from the API 
    export let data: { results?: any[] } = {results: []};
    let results = data.results ?? []; //If no results, set to empty array 

    async function fetchResults() {
        const res = await fetch('api/voting-results');
        results = await res.json();
    }

    async function deletePolls() {
        try{
            const res = await fetch('/api/voting-results', {
                method: 'DELETE'
            });
            if(res.ok){
                const errorData = await res.json();
                console.error('Error deleting polls:', errorData);
                return;
            }
            //refresh the results after deletion 
            await fetchResults();
            console.log('Polls deleted successfully');
        } catch (error) {
            console.error('Error deleting polls:', error);
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-[#e0f7fa] to-[#b2ebf2]">
    <Sidebar 
        bind:sidebarExtended 
        bind:sidebarWidth 
        bind:createFormOpen
    />

    <div class="transition-all duration-500 ease-in-out" style="margin-left: {sidebarWidth};">
        
        <!-- Trip Header -->
        <div class="bg-white border-b shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
                <div class="flex flex-col">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-cyan-700">{tripData.title}</h1>
                            <div class="mt-3 flex flex-wrap items-center text-gray-600 gap-x-6 gap-y-2">
                                <div class="flex items-center">
                                    <MapPin class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.location}</span>
                                </div>
                                <div class="flex items-center">
                                    <Calendar class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.dates}</span>
                                </div>
                                <div class="flex items-center">
                                    <User class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>{tripData.travelers} travelers</span>
                                </div>
                                <div class="flex items-center">
                                    <Clock class="w-5 h-5 text-cyan-600 mr-2" />
                                    <span>7 days</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex space-x-3">
                            <!-- Add Member Button - NEW -->
                            <button 
                                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                                on:click={() => addMemberModalOpen = true}
                            >
                                <UserPlus class="w-4 h-4" />
                                Add Member
                            </button>
                            <button class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm">
                                <Vote class="w-4 h-4" />
                                Create Poll
                            </button>
                            <button class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm">
                                <Share2 class="w-4 h-4" />
                                Share Trip 
                            </button>
                        </div>
                    </div>

                    <!-- Rest of your existing code... -->
                    
                    <!-- Trip Tabs -->
                    <Tabs tabStyle="underline" class="mt-8 flex w-full justify-between">
                        <!-- Tab content remains the same... -->
                    </Tabs>
                </div>
            </div>
        </div>

        <!-- Widgets Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Widget content remains the same... -->
        </div>
    </div>
</div>

<!-- Add Member Modal - NEW -->
<Modal bind:open={addMemberModalOpen} size="md" autoclose={false} class="w-full">
    <div class="text-center">
        <UserPlus class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Invite a member to join "{tripData.title}"
        </h3>
        
        <!-- Invite Method Selection -->
        <div class="mb-4">
            <RadioGroup>
                <RadioButton bind:group={inviteMethod} value="email" class="px-2">
                    <div class="flex items-center">
                        <Mail class="w-4 h-4 mr-2" />
                        <span>Invite by Email</span>
                    </div>
                </RadioButton>
                <RadioButton bind:group={inviteMethod} value="username" class="px-2">
                    <div class="flex items-center">
                        <User class="w-4 h-4 mr-2" />
                        <span>Invite by Username</span>
                    </div>
                </RadioButton>
            </RadioGroup>
        </div>
        
        <!-- Email Input -->
        {#if inviteMethod === 'email'}
            <div class="mb-4">
                <Label for="email" class="mb-2">Email address</Label>
                <Input id="email" placeholder="Enter email address" bind:value={emailInput} type="email" required />
            </div>
        {/if}
        
        <!-- Username Input -->
        {#if inviteMethod === 'username'}
            <div class="mb-4">
                <Label for="username" class="mb-2">Username</Label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search class="w-4 h-4 text-gray-500" />
                    </div>
                    <Input 
                        id="username" 
                        placeholder="Search for user" 
                        bind:value={usernameInput} 
                        on:input={searchUsers}
                        class="pl-10"
                    />
                </div>
                
                <!-- User Search Results -->
                {#if searchResults.length > 0}
                    <div class="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-40 overflow-y-auto">
                        {#each searchResults as user}
                            <div 
                                class="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                on:click={() => selectUser(user)}
                            >
                                <div class="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold mr-2">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <div class="text-sm font-medium">{user.name}</div>
                                    <div class="text-xs text-gray-500">@{user.username}</div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
        
        <!-- Optional Message -->
        <div class="mb-4">
            <Label for="message" class="mb-2">Personal message (optional)</Label>
            <textarea
                id="message"
                rows="3"
                class="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Add a personal message to your invitation"
                bind:value={inviteMessage}
            ></textarea>
        </div>
        
        <div class="flex justify-center gap-4">
            <Button color="alternative" on:click={() => addMemberModalOpen = false}>
                Cancel
            </Button>
            <Button color="success" on:click={inviteMember}>
                Send Invitation
            </Button>
        </div>
    </div>
</Modal>