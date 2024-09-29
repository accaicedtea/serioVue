<template>
    <v-card class="mx-auto" max-width="500">
        <v-card-title>
            Last Orders
        </v-card-title>

        <v-divider></v-divider>

        <v-virtual-scroll :items="lastThreeOrders" height="320" item-height="48">
            <template v-slot:default="{ item }">
                <v-list-item
                    :subtitle="`RICHIESTA: ${item.requestDate ? item.requestDate : 'N/A'}\n ARRIVO: ${item.arrivalDate ? item.arrivalDate : 'N/A'}`"
                    :title="`Total: ${item.total}`">
                    <template v-slot:prepend>
                        <v-icon class="bg-primary">mdi-package-variant-closed</v-icon>
                    </template>

                    <template v-slot:append>
                        <v-btn icon="mdi-eye" color="teal-accent-1" size="small" variant="tonal"
                            @click="openDialog(item)"></v-btn>
                    </template>
                </v-list-item>
            </template>
        </v-virtual-scroll>
    </v-card>

    <v-dialog v-model="dialogVisible" max-width="340">
        <v-card>
            <v-card-title>
                Order Details
            </v-card-title>
            <v-card-text v-if="selectedOrderDetails.length">
                <p><strong>Totale Speso:</strong> {{ selectedOrderDetails.total }}€</p>
                <p><strong>Data Ordine:</strong> {{ selectedOrderDetails.requestDate }}</p>
                <p><strong>Data Arrivo:</strong> {{ selectedOrderDetails.arrivalDate ? selectedOrderDetails.arrivalDate : 'N/A' }}</p>
                <v-row>
                    <v-col><strong>Prodotto</strong></v-col>
                    <v-col><strong>Quantità</strong></v-col>
                </v-row>
                <v-virtual-scroll :items="selectedOrderDetails" height="300" class="bg-teal-lighten-5">
                    <template v-slot:default="{ item }">
                        <v-list-item>
                            <v-list-item-content>
                                <v-row>
                                    <v-col>
                                        <v-list-item-title>{{ item.prodotto }}</v-list-item-title>
                                    </v-col>
                                    <v-col>
                                        <v-list-item-subtitle>{{ item.quantità }}</v-list-item-subtitle>
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-virtual-scroll>
            </v-card-text>
            <v-card-text v-else>
                <p>No order selected.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn text @click="dialogVisible = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { supabase } from '@/plugins/supabase';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
export default {
    name: 'LastOrderCard',
    data: () => ({
        orders: [],
        dialogVisible: false,
        selectedOrderDetails: [],
    }),

    methods: {
        async fetchData() {
            try {
                let { data: items, error } = await supabase
                    .from('orders')
                    .select('*');
                if (error) {
                    throw new Error(error.message);
                }
                this.orders = items.map(item => ({
                    id: item.id,
                    total: item.total,
                    requestDate: new Date(item.ordered_at).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }),
                    arrivalDate: item.arrived_at ? new Date(item.arrived_at).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }) : null
                }));
            } catch (error) {
                console.error('Errore nel recupero dei dati:', error);
            }
        },
        openDialog(item) {

            supabase
                .from('order_product_view')
                .select('prodotto, quantità')
                .eq('order_id', item.id)
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Errore nel recupero dei dati dell\'ordine:', error);
                    } else {
                        Haptics.impact({ style: ImpactStyle.Light });
                        console.log('Dettagli dell\'ordine:', data);
                        this.selectedOrderDetails = data; // Store the fetched data in a variable
                        this.selectedOrderDetails.total = item.total;
                        this.selectedOrderDetails.requestDate = item.requestDate;
                        this.selectedOrderDetails.arrivalDate = item.arrivalDate;

                        console.log('Dati memorizzati:', this.selectedOrderDetails); // Log the stored data
                    }
                });
            this.selectedOrderDetails.total = item.total;
            this.selectedOrderDetails.requestDate = item.requestDate;
            this.selectedOrderDetails.arrivalDate = item.arrivalDate;

            this.dialogVisible = true;
        },

    },

    computed: {
        lastThreeOrders() {
            return this.orders.slice(-3).reverse();
        },
    },
    mounted() {
        this.fetchData();
    },
};
</script>

<style scoped>
.card {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    background-color: #f9f9f9;
}
</style>
