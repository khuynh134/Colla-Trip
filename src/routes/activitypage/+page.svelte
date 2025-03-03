<script lang="ts">
    import { Card , Button, GradientButton } from 'flowbite-svelte';
	import { stringify } from 'postcss';

    let userInputActivityName = $state(''); //User input for activity name
    let userInputActivityDescript = $state(''); //User input for activity description 
    type Activity = {
        name: string;
        description: string;
        votes: number;
    };

    let activities = $state<Activity[]>([]); //Array to store activities 

    //Function to create a new activity 
    function createActivity() {
        if (userInputActivityName && userInputActivityDescript) {
            activities = [...activities, {name: userInputActivityName, description: userInputActivityDescript, votes: 0}];

        }
        userInputActivityName = '';
        userInputActivityDescript = ''; 
        console.log('Activity Name: ', userInputActivityName);
        console.log('Activity Description: ', userInputActivityDescript); 
    }

    //function to delete an activity 
    function deleteActivity() {
        console.log('Activity Deleted');
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
    function voteActivity() {
        console.log('Activity Voted');
    }

    //Function to view the results of voting on an activity 
    function viewResults() {
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
</script>

<div class="min-h-screen bg-gradient-to-tr from-sky-200 via-cyan-400 to-sky-500/80">
    <div class="container mx-auto p-3 m-5">
    <!-- Activity Title -->
     <h1 class="text-2xl sm:text-3xl font-bold text-center">Activites Polling</h1>


     <!-- Activity Creation Form  -->
      <div class="flex justify-center p-3.5"></div>
        <Card horizontal size='lg' class= "w-full max-w-lg bg-slate-100">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-pink">Activity Name: </h5>
          <input 
                type="text" 
                class="border border-gray-300 dark:border-gray-700 focus:ring focus:ring-primary-200 rounded-md w-full p-2 mb-4" 
                oninput={handleActivityName} 
                placeholder="Enter Activity Name" 
                bind:value={userInputActivityName}
                />
          <p class="text-gray-700 dark:text-gray-400 mb-2 font-bold">Activity Description: </p>
          <input 
                type="text" 
                class="border border-gray-300 dark:border-gray-700 focus:ring focus:ring-primary-200 rounded-md w-full p-2 mb-4"
                oninput={handleActivityDescript} 
                placeholder="Enter Activity Description" 
                bind:value={userInputActivityDescript}
                />
           <!-- Create New Activity Button -->
         <GradientButton class="rounded-xl whitespace-nowrap border border-sky-400 bg-sky-400 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all 
            hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
            Create New Activity
         </GradientButton>
        </Card>
      
     

    </div>
</div>