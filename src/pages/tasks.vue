<template>
  <div>
    <v-table height="300px" fixed-header>
      <thead>
        <tr>
          <th class="text-left">
            Id
          </th>
          <th class="text-left">
            Nome
          </th>
          <th class="text-left">
            Azione
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in task" :key="t.id">
          <td>{{ t.id }}</td>
          <td>{{ t.name }}</td>
            <td>
            <v-checkbox @click="changeState(t.id)" :model-value="t.status"></v-checkbox>
            </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { supabase } from '../plugins/supabase';

export default {
  name: 'TablePage',
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
      changeState,
    };
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
