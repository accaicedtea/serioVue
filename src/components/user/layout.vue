<template>
  <v-card>
    <v-toolbar color="primary" title="User Profile">
    </v-toolbar>

    <div class="d-flex flex-row">
      <v-tabs v-model="tab"  direction="vertical">
        <v-tab v-for="c in cosa" :key="c.id" :text="c.name" :value="c.name"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="c in cosa" :key="c.id" :value="c.name">
          <v-card flat>
            <v-card-text>
              {{ c.id }} - {{ c.name }} - {{ c.category }} - {{ c.action }}
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script>
import { supabase } from '../../plugins/supabase';

export default {
  nome: 'TablePage',
  data: () => ({
    tab: 0,
  }),
  setup() {
    const cosa = ref([]);
    const categorie = ref([]);
    const categorieError = ref(null);

    onMounted(async () => {
      // Controlla se l'utente è autenticato
      const user = supabase.auth.getUser();
      console.log(user);
      if (!user) {
        // Reindirizza alla pagina di login
        router.push('/login');
        return;
      }

      const { data, error } = await supabase.from('product').select();

      if (error) {
        console.error(error);
      } else {
        cosa.value = data;
        console.log(data);
      }
      const { data: categorieData, error: categorieErrorData } = await supabase
        .from('task')
        .select('category');

      if (categorieErrorData) {
        console.error(categorieErrorData);
      } else {
        categorie.value = categorieData;
        console.log(categorieData);
      }
    });

    const changeState = async (id) => {
      // Invia l'id al server e cambia lo stato
      const { data, error } = await supabase
        .from('product')
        .update({ action: !cosa.value.find(c => c.id === id).action })
        .eq('id', id);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    };

    return {
      cosa,
      changeState,
    };
  },
};
</script>



