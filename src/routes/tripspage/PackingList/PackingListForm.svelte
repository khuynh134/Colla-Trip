<script lang="ts">
    
    export let newItemName: string;
    export let newItemQuantity: number;  
    export let creatorName: string;

    import { createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    function handleSubmit() {
        dispatch('submit'); 
    }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Item Name -->
        <div class="md:col-span-2">
            <label for="itemName" class="sr-only">Item Name</label>
            <input
                type="text"
                id="itemName"
                bind:value={newItemName}
                placeholder="Item name"
                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
            >
        </div>
        <!-- Quantity -->
        <div>
            <label for="quantity" class="sr-only">Quantity</label>
            <input
                type="number"
                id="quantity"
                bind:value={newItemQuantity}
                min="1"
                max="99"
                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
        </div>

        <!-- Creator Name -->
        <div class="md:col-span-2">
            <label for="creatorName" class="sr-only">Your Name</label>
            <input
                type="text"
                id="creatorName"
                bind:value={creatorName}
                placeholder="Your name"
                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
            >
        </div>

        <!-- Submit Button -->
        <div class="flex items-end">
            <button
                type="submit"
                class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                Add Item
            </button>
        </div>
    </div>
</form>