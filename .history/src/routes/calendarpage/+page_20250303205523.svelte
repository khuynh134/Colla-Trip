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
        return events.filter(event => date >= event.start && date <= event.end);
    }

    function formatMonth(date) {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    function changeMonth(offset) {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
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
        <div class="px-4 sm:px-8">

            <!-- Page Header -->
            <div class="mt-12 mb-8 flex justify-between items-center">
                <h1 class="text-2xl sm:text-3xl font-bold">Calendar</h1>
                <div class="flex space-x-4">
                    <button on:click={() => currentDate = new Date()} class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
                        Today
                    </button>
                    <div class="flex">
                        <button on:click={() => changeMonth(-1)} class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-lg transition-colors">
                            &lt;
                        </button>
                        <button on:click={() => changeMonth(1)} class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors">
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
<div class="flex justify-center items-start gap-x-12 max-w-7xl mx-auto w-full px-4">
    
    <!-- Calendar -->
    <Card class="p-6 shadow-lg w-20 min-w-[900px]">
        <div class="mb-4 text-xl font-semibold text-center">{currentMonthLabel}</div>

        {#if currentView === 'month'}
            <div class="grid grid-cols-7 gap-1 bg-gray-200">
                {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                    <div class="p-3 text-center font-medium bg-white">{day}</div>
                {/each}

                {#each calendarDays as { date, isCurrentMonth }}
                    <div class="min-h-28 p-2 bg-white border border-gray-300 text-center
                        {!isCurrentMonth ? 'text-gray-400' : ''} 
                        {date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}">
                        <div class="text-right p-1">{date.getDate()}</div>
                        <div class="mt-1">
                            {#each getEventsForDate(date) as event}
                                <div class="text-xs mb-1 p-1 rounded truncate" style="background-color: {event.color}; color: white;">
                                    {event.title}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="p-10 text-center text-gray-500">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} view coming soon
            </div>
        {/if}
    </Card>

    <!-- Event Legend -->
    <Card class="p-6 shadow-lg w-1/3 min-w-[300px]">
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
    </Card>

</div>
        </div>
    </div>
</div>