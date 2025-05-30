<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { onMount } from 'svelte';
    import { getAuth } from 'firebase/auth';

    // Sidebar state
    let sidebarExtended = false;
    let sidebarWidth = '80px';
    // 🚨 REMOVE createFormOpen — not needed here
    // let createFormOpen = false;

    // Calendar state
    let currentDate = new Date();
    let currentView: 'month' | 'week' | 'day' | 'agenda' = 'month'; // ✅ specify possible values

    // Event type
    type CalendarEvent = {
        id: number;
        title: string;
        start: Date;
        end: Date;
        color: string;
        type: string;
        description: string;
    };

    let events: CalendarEvent[] = [];

    onMount(async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('User not logged in.');

            const token = await user.getIdToken();

            const res = await fetch('/api/schedule', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                 cache: 'no-store'
            });

            if (!res.ok) throw new Error('Failed to fetch events.');

            const data = await res.json();

            events = data.map((activity: any): CalendarEvent => ({
                id: activity.id,
                title: activity.title,
                start: new Date(`${activity.date}T00:00:00`),
                end: new Date(`${activity.date}T00:00:00`),
                color: '#27ae60',
                type: 'activity',
                description: activity.description
            }));

        } catch (err) {
            console.error('Error loading events:', err);
        }
    });
    function safeUTCDate(dateStr: string) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    // Utility functions
    function getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(year: number, month: number): number {
        return new Date(year, month, 1).getDay();
    }

    function generateCalendarDays(year: number, month: number): { date: Date; isCurrentMonth: boolean }[] {
        let days: { date: Date; isCurrentMonth: boolean }[] = [];
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

        // Next month's days
        let totalDays = 42 - days.length;
        for (let i = 1; i <= totalDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    }
    // function getEventsForDate(date: Date): CalendarEvent[] {
    //     return events.filter(event => {
    //         const eventStart = new Date(event.start);
    //         const eventEnd = new Date(event.end);

    //         const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    //         const startToCheck = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
    //         const endToCheck = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());

    //         return dateToCheck >= startToCheck && dateToCheck <= endToCheck;
    //     });
    // }
    function getEventsForDate(date: Date): CalendarEvent[] {
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return events.filter(event => {
            const eventStart = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
            const eventEnd = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate());

            return checkDate >= eventStart && checkDate <= eventEnd;
        });
    }

    function formatMonth(date: Date): string {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    function changeMonth(offset: number): void {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    }

    function addEvent(): void {
        alert('Event creation coming soon!');
    }

    // Google Calendar Export
    function formatDateForGCal(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}T000000`;
    }

    function generateGCalUrl(event: CalendarEvent): string {
        const startDate = formatDateForGCal(event.start);
        let endDate = formatDateForGCal(event.end);

        if (event.start.toDateString() === event.end.toDateString()) {
            const nextDay = new Date(event.end);
            nextDay.setDate(nextDay.getDate() + 1);
            endDate = formatDateForGCal(nextDay);
        }

        const baseUrl = 'https://calendar.google.com/calendar/render';
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            dates: `${startDate}/${endDate}`,
            details: event.description || '',
            sf: 'true',
            output: 'xml'
        });

        return `${baseUrl}?${params.toString()}`;
    }

    function exportEventToGCal(event: CalendarEvent): void {
        const url = generateGCalUrl(event);
        window.open(url, '_blank');
    }

    function exportAllToGCal(): void {
        if (events.length === 0) {
            alert('No events to export!');
            return;
        }

        events.forEach(event => {
            setTimeout(() => {
                const url = generateGCalUrl(event);
                window.open(url, '_blank');
            }, 300);
        });
    }

    // Reactive declarations
    $: calendarDays = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
    $: currentMonthLabel = formatMonth(currentDate);
</script>

<!-- Page Container -->
<div class="min-h-screen bg-gray-50">
    <Sidebar bind:sidebarExtended bind:sidebarWidth />

    <!-- Main Content -->
    <div class="transition-all duration-500 ease-in-out" style="margin-left: {sidebarWidth};">
        <!-- Centered Calendar Container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Page Header -->
            <div class="mt-12 mb-8 flex flex-col sm:flex-row justify-between items-center">
                <div class="flex items-center mb-4 mt-2 sm:mb-0">
                    <h1 class="text-2xl sm:text-3xl font-bold">Calendar</h1>
                    <div class="ml-4 flex space-x-2">
                        <button 
                            onclick={addEvent}
                            class="px-3 py-1 bg-[#3598db] text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            + Event
                        </button>
                        <button 
                            onclick={exportAllToGCal}
                            class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Export to Google
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap space-x-2 sm:space-x-4 justify-center">
                    <button 
                        onclick={() => currentDate = new Date()} 
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors mb-2 sm:mb-0"
                    >
                        Today
                    </button>
                    <div class="flex mb-2 sm:mb-0">
                        <button 
                            onclick={() => changeMonth(-1)} 
                            class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-lg transition-colors"
                        >
                            &lt;
                        </button>
                        <button 
                            onclick={() => changeMonth(1)} 
                            class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors"
                        >
                            &gt;
                        </button>
                    </div>
                    <div class="hidden sm:flex rounded-lg overflow-hidden">
                        {#each ['month', 'week', 'day', 'agenda'] as view}
                            <button 
                                class="{currentView === view ? 'bg-[#3598db] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2 transition-colors"
                                onclick={() => currentView = view as 'month' | 'week' | 'day' | 'agenda'}
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
                                                class="text-xs mb-1 p-1 rounded truncate cursor-pointer hover:opacity-90 flex justify-between" 
                                                style="background-color: {event.color}; color: white;"
                                                title={event.title}
                                            >
                                                <span>{event.title}</span>
                                                <button 
                                                    type="button"
                                                    class="ml-1 opacity-70 hover:opacity-100"
                                                    onclick={(e) => { e.stopPropagation(); exportEventToGCal(event); }}
                                                    title="Export to Google Calendar"
                                                    aria-label="Export to Google Calendar"
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                </button>
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
                                <div class="flex justify-between items-start">
                                    <div class="font-medium">{event.title}</div>
                                    <button 
                                        type="button"
                                        class="text-green-600 hover:text-green-800"
                                        onclick={() => exportEventToGCal(event)}
                                        title="Export to Google Calendar"
                                        aria-label="Export to Google Calendar"
                                    >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </button>
                                </div>
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