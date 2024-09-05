<template>
  <div class="d-flex flex-row">
    <v-tabs v-model="tab" direction="vertical">
      <v-tab v-for="c in category" :key="c.name" :text="c.name"></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="c in fakeData" :key="c.name" :value="c.name">
        <v-table  loading-text="Loading... Please wait"
        loading>
          <thead>
            <tr>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                Nome
              </th>
              <th class="text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td><input type="checkbox" v-model="c.status"></td>
            </tr>
          </tbody>
        </v-table>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
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
