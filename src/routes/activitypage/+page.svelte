<script lang="ts">
    import { Card , Button, GradientButton } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    import { Datepicker } from 'flowbite-svelte'; 

    // Sidebar state
    let sidebarExtended = $state(false);
    let sidebarWidth = $state('80px');
    let createFormOpen = $state(false);

	

    //use $props() to declare props
    const { data, form } = $props<{
        data: { activities: Activity[]; error?: string };
        form?: { success?: boolean };
    }>();

    //destructure data
    const { activities: serverActivities, error } = data; 

    //local state to store user input 
    let userInputActivityName = $state(''); //User input for activity name
    let userInputActivityDescript = $state(''); //User input for activity description 

    let userSelectedActivityDate = $state<Date | null>(new Date()); //User input for activity date 
    
    let userHighlightedActivity = $state(''); //User assigned activity as highlight 

    //define the Activity type 
    type Activity = {
        id: number;
        name: string;
        activity_date: string | Date; 
        description: string;
        votes: number;
        location?: string;
        highlighted?: boolean; // Indicates if the activity is highlighted
        updated_at?: string | Date; // Timestamp of the last update
    };

    
    let activities = $state<Activity[]>([]); //Array to store activities 

    
    onMount(async () => {
        try{
            const response = await fetch('/api/activities'); 
            const serverActivities = await response.json(); 
            activities = serverActivities; 
        } catch (error) {
            console.error('Failed to load activities: ', error);
        }
        
    });
    
    //Convert DATE to YYYY-MM-DD format for PostgreSQL
    function formatDateForDB(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    //Date formatting function to display
   // function formatDisplayDate(dateString: string | Date): string {
  //      const date = new Date(dateString);
  //      return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;// Return the formatted date as a string
//    }

    //function to format date for display
    function formatDisplayDate (dateString : string | Date | null) {
        if (!dateString) {
            return 'No date selected';
        }

        try {
            const date = typeof dateString === 'string' ?
            new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`) : new Date(dateString); // Add time for Neon dates
            return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        } catch {
            return 'Invalid date';
        }

    }

    //Function to create a new activity 
    async function createActivity() {
        if(!userSelectedActivityDate){
            alert('Please select a date for the activity'); 
            return;
        }
        
        try{
            const newActivity = {
                name: userInputActivityName,
                description: userInputActivityDescript,
                activity_date: formatDateForDB(userSelectedActivityDate), //format date for PostgreSQL
                
            };

            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newActivity),
            });

            if(!response.ok) {
                throw new Error('Failed to create activity');
            }

            const createdActivity = await response.json(); 
            activities = [...activities, createdActivity]; //update local state with new activity

            //Reset user input fields
            userInputActivityName = '';
            userInputActivityDescript = '';
            userSelectedActivityDate = null; //reset date picker
            console.log('Activity Created');
        } catch (error) {
            console.error('Create activity error: ', error);
            alert('Failed to create activity');
               
        }
    }

    //function to delete an activity 
    async function deleteActivity(activityId: number) {
        try{
            //send DELETE request to the server
            const response = await fetch(`/api/activities`,{
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: activityId}),
            });

            if (response.ok) {
                //update local state by filtering out deleted activity
                activities =activities.filter(a => a.id !== activityId);
                voteResults = voteResults.filter(a => a.id !== activityId); //remove deleted activity from voteResults

                //clear voteResults if no activities are listed
                if(activities.length === 0){
                    voteResults = []; 
                }
                console.log('Activity Deleted');
            } else {
                const errorData = await response.json(); 
                console.error('Error deleting activity on server: ', errorData); 
            }
        } catch (error) {
            console.error('Error deleting activity: ', error);
        }
        
    }

    //function to edit an activity 
    function editActivity() {
        console.log('Activity Edited');
    }

    //function to highlight an activity 
    async function toggleHighlight(activityId: number, currentStatus: boolean) {
        try{
            //send a PUT request to the server 
            const response = await fetch('/api/highlights', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: activityId, highlight: !currentStatus}),
            });
            if(!response.ok) {
                throw new Error('Failed to update highlight status');
            }
            //Update local state 
            activities = activities.map(a => 
                a.id === activityId ? {...a, highlighted: !currentStatus} : a
            ); 
        } catch (error) {
            console.error('Error toggling highlight status: ', error);
        }
        
    }

    //Function to vote on an activity 
    async function voteActivity(activityId: number) {
        try {
            const response = await fetch(`/api/activities`,{
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: activityId, vote: 1})
            });

            if( response.ok) {
                const updated = await response.json();
                activities = activities.map(a => a.id === updated.id ? updated : a);
                voteResults = [...voteResults]; 
            } 

            console.log('Voted on Activity');
        } catch (error) {
            console.error('Error voting on activity: ', error);
            //Display error message to the user
            alert('Vote failed: ${error.message}');
        }
    }

    //Local state to store vote results
    let voteResults = $state<Activity[]>([]);

    //Function to view the results of voting on an activity 
    function viewResults(event: MouseEvent) {
        voteResults = activities.sort((a, b) => b.votes - a.votes);
        console.log('Activity Results');
    }

    //clear polling results
    async function clearResults(event: MouseEvent) {
        const res = await fetch('/api/activities', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });

        if(res.ok){
            voteResults = [];
            console.log('Polling Results Cleared');
            alert('Polling Results Cleared');
        } else {
            console.error('Error clearing polling results');
        }
        
    }

    const handleCreateActivity = async (event: Event) => {
        event.preventDefault(); 

        //Call createAcitivity function 
        await createActivity(); 

    }
</script>

<div class="flex min-h-screen bg-gradient-to-tr from-sky-200 via-cyan-400 to-sky-500/80">
    <div class="container mx-auto p-3 m-5">
    <!-- Sidebar -->
    <Sidebar bind:sidebarExtended bind:sidebarWidth bind:createFormOpen />

    <!-- Activity Title -->
     <h1 class="text-2xl sm:text-3xl font-bold text-center">Activities Polling</h1>


     <!-- Activity Creation Form  -->
      <div class="flex justify-center p-3.5">
        <Card horizontal size='lg' class= "w-full max-w-lg bg-slate-100/55">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-pink">Activity Name: </h5>
          <form method="POST" action="?/create" use:enhance>
                <input 
                    type="text"
                    name="activityName"
                    class="border border-gray-300 dark:border-gray-700 focus:ring focus:ring-primary-200 rounded-md w-full p-2 mb-4"
                    placeholder="Enter Activity Name"
                    bind:value={userInputActivityName}
                    required
                />
                <!-- Date Picker -->
                <Datepicker 
                    bind:value={userSelectedActivityDate}
                    dateFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
                     />
                 <p class="mt-4">Selected date: {userSelectedActivityDate ? formatDisplayDate(userSelectedActivityDate) : 'None'}</p>
                
                <p class="text-gray-700 dark:text-gray-400 mb-2 font-bold">Activity Description: </p>
                <textarea
                    name="activityDescription"
                    class="border border-gray-300 dark:border-gray-700 focus:ring focus:ring-primary-200 rounded-md w-full p-2 mb-4"
                    placeholder= "Enter Activity Description"
                    bind:value={userInputActivityDescript}
                    required 
                ></textarea>
                <!-- Create New Activity Button-->
                 <GradientButton type="submit" on:click={handleCreateActivity} class="rounded-xl whitespace-nowrap border border-sky-400 bg-sky-400 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all
                    hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                    Create New Activity
                </GradientButton>
        </form>
       </Card>
     </div>

     <!-- Display error message if any -->
      {#if error}
        <p class="text-red-500 text-center">{error}</p>
       {/if}

        <!-- Display Created Activities -->
         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each activities as activity}
                <Card horizontal size='lg' class="bg-slate-100/55 shadow-md rounded-lg p-4">
                    <div class= "flex flex-col basis-small">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-pink">Activity's Name: {activity.name}</h5>
                         
                        <div>
                            <p>Activity Date: {formatDisplayDate(activity.activity_date)}</p>
                        </div>
                       
                        <p class="text-gray-700 dark:text-gray-400 mb-2">Activity's Details: {activity.description}</p>
                        <div class="flex flex-wrap justify-between items-center">
                            <Button on:click={() => deleteActivity(activity.id)} class="bg-sky-400 text-white hover:border-sky-700 hover:bg-sky-700">Delete</Button>
                            <Button on:click={() => voteActivity(activity.id)} class="bg-sky-400 text-white hover:border-sky-700 hover:bg-sky-700 ">Vote</Button>
                        </div>
 
                    </div>
                    
                </Card>
            {/each}
        </div>
      
        <!-- Display Polling Results -->
        <div class="flex justify-center p-3.5 m-5 px-8 gap-4">
            <GradientButton on:click={(event) => clearResults(event)} class="rounded-xl whitespace-nowrap border border-sky-400 bg-sky-400 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all
                hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                Clear Polling Results
            </GradientButton>
            <GradientButton on:click={(event) => viewResults(event)} class="rounded-xl whitespace-nowrap border border-sky-400 bg-sky-400 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all
                hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                View Polling Results
            </GradientButton>
        </div>

        <!-- Display Vote Results -->
         <div class="mt-8">
            <h2 class="text-2xl font-bold text-center mb-4"> Vote Results</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each voteResults as activity}
                    <Card horizontal size='lg' class="bg-slate-100/55 shadow-md rounded-lg p-4">
                        <div class="flex flex-col basis-small">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-pink">{activity.name}</h5>
                            <p class="text-gray-700 dark:text-gray-400 mb-2">{activity.description}</p>
                            <p class="text-gray-700 dark:text-gray-400 mb-2">Votes: {activity.votes} (Last updated: {activity.updated_at ? new Date(activity.updated_at).toLocaleTimeString() : 'N/A'})</p>
                        </div>
                    </Card>
                {/each}
            </div>
         </div>


    </div>
</div>