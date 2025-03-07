<script lang="ts">
    import { Card , Button, GradientButton } from 'flowbite-svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

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
    
    //define the Activity type 
    type Activity = {
        id: number;
        name: string;
        description: string;
        votes: number;
        location?: string;
    };

    //local state for activities (synced with localStorage) 
    let activities = $state<Activity[]>([]); //Array to store activities 

    //Load activities from localStorage
    onMount(async () => {
        const response = await fetch('/api/activities');
        const serverActivities = await response.json(); 

        //if database is empty, clear localStorage 
        if(serverActivities.length === 0) {
            localStorage.removeItem('activities');
            activities = []; 

            //log the cleared localStorage
            console.log('Cleared localStorage:', localStorage.getItem('activities'));
        } else {
            //sync local state with server data 
            const storedActivities = localStorage.getItem('activities');
            if(storedActivities) {
                activities = JSON.parse(storedActivities);
            } else {
                activities = serverActivities;
                //sync localStorage with server data
                syncLocalStorage();

                //log the synced localStorage
                console.log('Synced localStorage:', localStorage.getItem('activities'));
            }
        }
    });
        

    //sync activities with localStorage 
    function syncLocalStorage() {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    //Function to create a new activity 
    async function createActivity() {
        //Check if user input is not empty, then add activity to the activities array 
        if (userInputActivityName && userInputActivityDescript) {
            const newActivity: Activity = {
                id: Date.now(),
                name: userInputActivityName,
                description: userInputActivityDescript,
                votes: 0
            };
            //update local state 
            activities = [...activities, newActivity];
            syncLocalStorage(); //sync with localStorage 

            //Reset user input fields
            userInputActivityName = '';
            userInputActivityDescript = ''; 

            //Send a POST request to the server, fetching all activities 
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(newActivity),
            });

            if(!response.ok) {
                console.log('Error creating activity on server');
            }
        }
      
        console.log('Activity Name: ', userInputActivityName);
        console.log('Activity Description: ', userInputActivityDescript); 
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
                activities =activities.filter((activity) => activity.id !== activityId);

                //sync localStorage
                syncLocalStorage(); 

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

    //function to view an activity 
    function viewActivity() {
        console.log('Activity Viewed');
    }

    //Function to vote on an activity 
    async function voteActivity(activityId: number) {
        //update local state 
        activities = activities.map((activity => {
            if (activity.id === activityId){
                return {...activity, votes: activity.votes + 1};
            }
            return activity;
        }))
        syncLocalStorage(); //sync with localStorage 

        //send a PUT request to the server, fetch all activities sorted by votes
        const response = await fetch(`/api/activities`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: activityId, vote: 1})
        });
        if(!response.ok) {
            console.error('Error voting on activity on server');
        }

        console.log('Activity Voted');
    }

    //Local state to store vote results
    let voteResults = $state<Activity[]>([]);

    //Function to view the results of voting on an activity 
    function viewResults(event: MouseEvent) {
        voteResults = activities.sort((a, b) => b.votes - a.votes);
        console.log('Activity Results');
    }

    //Function to handle user input for activity's name 
    function handleActivityName(event: Event) {
        if (event.target) {
            userInputActivityName = (event.target as HTMLInputElement).value;
        }

    }

    function handleActivityDescript(event: Event){
        if(event.target) {
            userInputActivityDescript = (event.target as HTMLInputElement).value; 
        }
    }

    const handleCreateActivity = async (event: Event) => {
        event.preventDefault(); 

        //Call createAcitivity function 
        await createActivity(); 

    }
</script>

<div class="min-h-screen bg-gradient-to-tr from-sky-200 via-cyan-400 to-sky-500/80">
    <div class="container mx-auto p-3 m-5">
    <!-- Sidebar -->
    <Sidebar bind:sidebarExtended bind:sidebarWidth bind:createFormOpen />

    <!-- Activity Title -->
     <h1 class="text-2xl sm:text-3xl font-bold text-center">Activites Polling</h1>


     <!-- Activity Creation Form  -->
      <div class="flex justify-center p-3.5">
        <Card horizontal size='lg' class= "w-full max-w-lg bg-slate-100">
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
                <Card horizontal size='lg' class="bg-slate-100 shadow-md rounded-lg p-4">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-pink">{activity.name}</h5>
                    <p class="text-gray-700 dark:text-gray-400 mb-2">{activity.description}</p>
                    <div class="flex flex-wrap justify-between items-center gap-2">
                        <Button on:click={editActivity} class="bg-sky-400 text-white">Edit</Button>
                        <Button on:click={() => deleteActivity(activity.id)} class="bg-sky-400 text-white">Delete</Button>
                        <Button on:click={() => voteActivity(activity.id)} class="bg-sky-400 text-white">Vote</Button>
                    </div>
                </Card>
            {/each}
        </div>
      
        <!-- Display Polling Results -->
        <div class="flex justify-center p-3.5">
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
                    <Card horizontal size='lg' class="bg-slate-100 shadow-md rounded-lg p-4">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-pink">{activity.name}</h5>
                        <p class="text-gray-700 dark:text-gray-400 mb-2">{activity.description}</p>
                        <p class="text-gray-700 dark:text-gray-400 mb-2">Votes: {activity.votes}</p>
                    </Card>
                {/each}
            </div>
         </div>


    </div>
</div>