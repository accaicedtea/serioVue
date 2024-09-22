<template>
    <div class="recent-orders-card">
        <v-card>
            <v-card-title>
                Recent Orders
            </v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item v-for="order in recentOrders" :key="order.id">
                        <v-list-item-content>
                            <v-list-item-title>{{ order.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ order.date }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn text @click="viewOrder(order.id)">View</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'RecentOrdersCard',
    data() {
        return {
            recentOrders: [
                { id: 1, name: 'Order 1', date: '2023-10-01' },
                { id: 2, name: 'Order 2', date: '2023-10-02' },
                { id: 3, name: 'Order 3', date: '2023-10-03' },
                { id: 4, name: 'Order 4', date: '2023-10-04' },
                { id: 5, name: 'Order 5', date: '2023-10-05' },
            ],
        };
    },
    methods: {
        viewOrder(orderId) {
            // Logica per visualizzare l'ordine
            console.log('Viewing order:', orderId);
        },
    },
};
</script>

<style scoped>
.recent-orders-card {
    max-width: 400px;
    margin: 20px auto;
}
</style>