<script lang="ts">
    import '../../app.css';
 </script>
 
 <div class="min-h-screen bg-gradient-to-r from-[#84eaeb] to-[#3598db] py-12 px-4">
    <div class="max-w-2xl mx-auto bg-white/90 rounded-lg p-8 shadow-lg">
        <h1 class="text-3xl font-bold text-[#3598db] mb-6 text-center">Contact Us</h1>
        
        <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-gray-700 mb-2">First Name</label>
                    <input type="text" class="w-full p-3 border rounded-lg" />
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Last Name</label>
                    <input type="text" class="w-full p-3 border rounded-lg" />
                </div>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Email</label>
                <input type="email" class="w-full p-3 border rounded-lg" />
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Message</label>
                <textarea rows="4" class="w-full p-3 border rounded-lg resize-none"></textarea>
            </div>
            
            <button type="submit" class="w-full bg-[#3598db] text-white py-3 rounded-lg hover:bg-[#3598db]/90">
                Send Message
            </button>
        </form>
    </div>
 </div>