<template>
  <v-card class="mx-auto text-center" color="green" max-width="600" dark>
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline :model-value="value" color="rgba(255, 255, 255, .7)" height="100" padding="24"
          stroke-linecap="round" smooth>
          <template v-slot:label="item">
            ${{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">
        Riepilogo spese
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn variant="text" block>
        NO WAY
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { supabase } from '@/plugins/supabase';
export default {
  data: () => ({
    value: [],

  }),
  methods:
  {
    async getExpense() {
      const { data, error } = await supabase
        .from('orders')
        .select('total')
        .order('ordered_at', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        this.value = data.map(order => order.total);
      }
    }
  },
  created() {
    this.getExpense();
  }
}
</script>