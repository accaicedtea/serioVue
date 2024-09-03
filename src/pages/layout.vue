<template>
  <v-card>
    <v-toolbar color="primary" title="User Profile">
    </v-toolbar>

    <div class="d-flex flex-row" >
      <v-tabs v-model="tab"  bg-color="purple-darken-4" direction="vertical">
        <v-tab v-for="t in task" :key="t.id" :text="t.name" :value="t.name"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="t in task" :key="t.id" :value="t.name">
          <v-card flat>
            <v-card-text>
              {{ t.id }} - {{ t.name }}
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

      </v-tabs-window>
    </div>
  </v-card>
</template>

<script>
import { supabase } from '../plugins/supabase';

export default {
  name: 'TablePage',
  data: () => ({
      tab: null,
    }),
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
