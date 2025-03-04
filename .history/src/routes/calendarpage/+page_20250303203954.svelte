<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { onMount } from 'svelte';
  
    // State management for sidebar
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
  
    // Calendar utility functions
    function getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }
  
    function getFirstDayOfMonth(year, month) {
      return new Date(year, month, 1).getDay();
    }
  
    function getPreviousMonthDays(year, month) {
      const firstDay = getFirstDayOfMonth(year, month);
      const daysInPrevMonth = getDaysInMonth(year, month - 1);
      const days = [];
      
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, daysInPrevMonth - i),
          isCurrentMonth: false
        });
      }
      
      return days;
    }
  
    function getCurrentMonthDays(year, month) {
      const daysInMonth = getDaysInMonth(year, month);
      const days = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          date: new Date(year, month, i),
          isCurrentMonth: true
        });
      }
      
      return days;
    }
  
    function getNextMonthDays(year, month, currentDays) {
      const totalDaysNeeded = 42; // 6 rows of 7 days
      const daysNeeded = totalDaysNeeded - currentDays.length;
      const days = [];
      
      for (let i = 1; i <= daysNeeded; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false
        });
      }
      
      return days;
    }
  
    function getCalendarDays() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const prevMonthDays = getPreviousMonthDays(year, month);
      const currentMonthDays = getCurrentMonthDays(year, month);
      const allDaysSoFar = [...prevMonthDays, ...currentMonthDays];
      const nextMonthDays = getNextMonthDays(year, month, allDaysSoFar);
      
      return [...allDaysSoFar, ...nextMonthDays];
    }
  
    function getEventsForDate(date) {
      return events.filter(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        
        return date >= eventStart && date <= eventEnd;
      });
    }
  
    function formatMonth(date) {
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  
    function previousMonth() {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    }
  
    function nextMonth() {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }
  
    function today() {
      currentDate = new Date();
    }
  
    function setView(view) {
      currentView = view;
    }
  
    // Reactive statement to update calendar when date changes
    $: calendarDays = getCalendarDays();
    $: currentMonthLabel = formatMonth(currentDate);
  </script>
  
  <div class="min-h-screen bg-gray-50">
    <Sidebar 
      bind:sidebarExtended 
      bind:sidebarWidth 
      bind:createFormOpen
    />
  
    <!-- Main Content -->
    <div
      class="transition-all duration-500 ease-in-out"
      style="margin-left: {sidebarWidth};"
    >
      <div class="px-4 sm:px-8">
        <!-- Page Header with Navigation -->
        <div class="mt-12 mb-8 flex justify-between items-center">
          <h1 class="text-2xl sm:text-3xl font-bold">Calendar</h1>
          <div class="flex space-x-4">
            <button on:click={today} class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
              Today
            </button>
            <div class="flex">
              <button on:click={previousMonth} class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-lg transition-colors">
                &lt;
              </button>
              <button on:click={nextMonth} class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors">
                &gt;
              </button>
            </div>
            <div class="hidden sm:flex rounded-lg overflow-hidden">
              <button 
                class="{currentView === 'month' ? 'bg-[#3598db] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2 transition-colors"
                on:click={() => setView('month')}
              >
                Month
              </button>
              <button 
                class="{currentView === 'week' ? 'bg-[#3598db] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2 transition-colors"
                on:click={() => setView('week')}
              >
                Week
              </button>
              <button 
                class="{currentView === 'day' ? 'bg-[#3598db] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2 transition-colors"
                on:click={() => setView('day')}
              >
                Day
              </button>
              <button 
                class="{currentView === 'agenda' ? 'bg-[#3598db] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2 transition-colors"
                on:click={() => setView('agenda')}
              >
                Agenda
              </button>
            </div>
          </div>
        </div>
  
        <!-- Month Label -->
        <div class="mb-60 text-xl font-semibold">{currentMonthLabel}</div>
  
        <!-- Calendar Card -->
        <Card class="p-4 sm:p-6 shadow-lg mb-8">
          <!-- Month View -->
          {#if currentView === 'month'}
            <div class="grid grid-cols-7 gap-px bg-gray-200">
              <!-- Day headers -->
              {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                <div class="p-2 text-center font-medium bg-white">{day}</div>
              {/each}
              
              <!-- Calendar days -->
              {#each calendarDays as { date, isCurrentMonth }}
                <div 
                  class="min-h-24 p-1 bg-white border-t border-gray-200 
                        {!isCurrentMonth ? 'text-gray-400' : ''} 
                        {date.getDate() === new Date().getDate() && 
                         date.getMonth() === new Date().getMonth() && 
                         date.getFullYear() === new Date().getFullYear() ? 'bg-blue-50' : ''}"
                >
                  <div class="text-right p-1">{date.getDate()}</div>
                  
                  <!-- Events for this day -->
                  <div class="mt-1">
                    {#each getEventsForDate(date) as event}
                      <div 
                        class="text-xs mb-1 p-1 rounded truncate" 
                        style="background-color: {event.color}; color: white;"
                      >
                        {event.title}
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {:else if currentView === 'week'}
            <!-- Week View (placeholder) -->
            <div class="p-10 text-center text-gray-500">
              Week view coming soon
            </div>
          {:else if currentView === 'day'}
            <!-- Day View (placeholder) -->
            <div class="p-10 text-center text-gray-500">
              Day view coming soon
            </div>
          {:else}
            <!-- Agenda View (placeholder) -->
            <div class="p-10 text-center text-gray-500">
              Agenda view coming soon
            </div>
          {/if}
        </Card>
  
        <!-- Event Color Legend -->
        <Card class="p-4 sm:p-6 shadow-lg mb-8">
          <h3 class="text-lg font-semibold mb-4">Event Types</h3>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-2" style="background-color: #3598db;"></div>
              <span>Trip</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-2" style="background-color: #e67e22;"></div>
              <span>Planning</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-2" style="background-color: #27ae60;"></div>
              <span>Confirmed</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-2" style="background-color: #c0392b;"></div>
              <span>Deadline</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>