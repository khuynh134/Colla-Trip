<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { onMount } from 'svelte';

    // Sidebar state
    let sidebarExtended = false;
    let sidebarWidth = '80px';
    let createFormOpen = false;

    // Calendar state
    let currentDate = new Date();
    let currentView = 'month'; // 'month', 'week', 'day', 'agenda'
    
    let events = [
        {
            id: 1,
            title: 'Paris Trip',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
            color: '#3598db',
            type: 'trip'
        },
        {
            id: 2,
            title: 'Tokyo Planning',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
            color: '#e67e22',
            type: 'planning'
        }
    ];

    // Utility functions
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    function generateCalendarDays(year, month) {
        let days = [];
        let prevMonthDays = getDaysInMonth(year, month - 1);
        let firstDay = getFirstDayOfMonth(year, month);

        // Previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
        }

        // Current month's days
        for (let i = 1; i <= getDaysInMonth(year, month); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Next month's days to fill grid (6 rows of 7)
        let totalDays = 42 - days.length;
        for (let i = 1; i <= totalDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    }

    function getEventsForDate(date) {
        return events.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            
            // Compare dates without time component
            const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const startToCheck = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
            const endToCheck = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
            
            return dateToCheck >= startToCheck && dateToCheck <= endToCheck;
        });
    }

    function formatMonth(date) {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    function changeMonth(offset) {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    }

    // Add an event function (placeholder for future implementation)
    function addEvent() {
        alert('Event creation coming soon!');
    }

    // Reactive updates
    $: calendarDays = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
    $: currentMonthLabel = formatMonth(currentDate);
</script>

<!-- Page Container -->
<div class="min-h-screen bg-gray-50">
    <Sidebar bind:sidebarExtended bind:sidebarWidth bind:createFormOpen />

    <!-- Main Content -->
    <div class="transition-all duration-500 ease-in-out" style="margin-left: {sidebarWidth};">
        <!-- Centered Calendar Container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Page Header -->
            <div class="mt-16 mb-8 flex flex-col sm:flex-row justify-between items-center">
                <div class="flex items-center mb-4 sm:mb-0">
                    <h1 class="text-2xl sm:text-3xl font-bold">Calendar</h1>
                    <button 
                        on:click={addEvent}
                        class="ml-4 px-3 py-1 bg-[#3598db] text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + Event
                    </button>
                </div>
                <div class="flex flex-wrap space-x-2 sm:space-x-4 justify-center">
                    <button 
                        on:click={() => currentDate = new Date()} 
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors mb-2 sm:mb-0"
                    >
                        Today
                    </button>
                    <div class="flex mb-2 sm:mb-0">
                        <button 
                            on:click={() => changeMonth(-1)} 
                            class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-lg transition-colors"
                        >
                            &lt;
                        </button>
                        <button 
                            on:click={() => changeMonth(1)} 
                            class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors"
                        >
                            &gt;
                        </button>
                    </div>
                    <div class="hidden sm:flex rounded-lg overflow-hidden">
                        {#each ['month', 'week', 'day', 'agenda'] as view}
                            <button 
                                class="{currentView === view ? 'bg-[#3598db] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2 transition-colors"
                                on:click={() => currentView = view}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Calendar and Legend Container -->
            <div class="flex flex-col lg:flex-row justify-center items-start gap-8 mb-8">
                
                <!-- Calendar -->
                <Card class="p-6 shadow-lg w-full lg:w-4/5 max-w-[900px]">
                    <div class="mb-4 text-xl font-semibold text-center">{currentMonthLabel}</div>

                    {#if currentView === 'month'}
                        <div class="grid grid-cols-7 gap-1 bg-gray-200">
                            {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                                <div class="p-3 text-center font-medium bg-white">{day}</div>
                            {/each}

                            {#each calendarDays as { date, isCurrentMonth }}
                                <div class="min-h-28 p-2 bg-white border border-gray-200 
                                    {!isCurrentMonth ? 'text-gray-400' : ''} 
                                    {date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}">
                                    <div class="text-right p-1">{date.getDate()}</div>
                                    <div class="mt-1">
                                        {#each getEventsForDate(date) as event}
                                            <div 
                                                class="text-xs mb-1 p-1 rounded truncate cursor-pointer hover:opacity-90" 
                                                style="background-color: {event.color}; color: white;"
                                                title={event.title}
                                            >
                                                {event.title}
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else if currentView === 'week'}
                        <div class="p-10 text-center text-gray-500">
                            Week view coming soon
                        </div>
                    {:else if currentView === 'day'}
                        <div class="p-10 text-center text-gray-500">
                            Day view coming soon
                        </div>
                    {:else}
                        <div class="p-10 text-center text-gray-500">
                            Agenda view coming soon
                        </div>
                    {/if}
                </Card>

                <!-- Event Legend -->
                <Card class="p-6 shadow-lg w-full lg:w-1/4">
                    <h3 class="text-lg font-semibold mb-4">Event Types</h3>
                    <div class="flex flex-col gap-4">
                        {#each [
                            { label: 'Trip', color: '#3598db' },
                            { label: 'Planning', color: '#e67e22' },
                            { label: 'Confirmed', color: '#27ae60' },
                            { label: 'Deadline', color: '#c0392b' }
                        ] as eventType}
                            <div class="flex items-center">
                                <div class="w-5 h-5 rounded mr-3" style="background-color: {eventType.color};"></div>
                                <span class="text-lg">{eventType.label}</span>
                            </div>
                        {/each}
                    </div>
                    
                    <!-- Upcoming Events Section -->
                    <h3 class="text-lg font-semibold mt-8 mb-4">Upcoming Events</h3>
                    <div class="space-y-3">
                        {#each events.filter(e => e.start >= new Date()).slice(0, 3) as event}
                            <div class="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <div class="font-medium">{event.title}</div>
                                <div class="text-sm text-gray-600">
                                    {event.start.toLocaleDateString()} 
                                    {event.start.toDateString() !== event.end.toDateString() ? 
                                        `- ${event.end.toLocaleDateString()}` : ''}
                                </div>
                                <div class="mt-1">
                                    <span 
                                        class="inline-block px-2 py-1 text-xs rounded-full text-white" 
                                        style="background-color: {event.color};"
                                    >
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </Card>
            </div>
        </div>
    </div>
</div>