<template>

</template>

<script>
import { supabase } from '../plugins/supabase';

export default {
  name: 'TablePage',
  data() {
    return {
      tab: 0,
      category: [
        { id: 1, name: 'mag1' },
        { id: 2, name: 'mag2' },
        { id: 3, name: 'mag3' }
      ],
      fakeData: [
        { id: 1, name: 'Task 1', category: 'mag1', status: 0 },
        { id: 2, name: 'Task 2', category: 'mag2', status: 1 },
        { id: 3, name: 'Task 3', category: 'mag2', status: 0 },
        { id: 4, name: 'Task 4', category: 'mag2', status: 1 },
        { id: 5, name: 'Task 5', category: 'mag3', status: 0 },
      ],
    };
  },

  setup() {
    const task = ref([]);
    onMounted(async () => {

      // Check if the user is authenticated
      const user = supabase.auth.getUser();
      console.log(user);
      if (!user) {
        // Redirect to the login page
        router.push('/login');
        return;
      }

      const { data, error } = await supabase.from('task').select();
      if (error) {
        console.error(error);
      } else {
        task.value = data;
        console.log(data);
      }
    });

    const changeState = async (id) => {
      // Send the id to the server and change the state
      const { data, error } = await supabase.from('task').update({ status: !task.value.find(t => t.id === id).status }).eq('id', id);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    };

    return {
      task,
      changeState
    };
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
