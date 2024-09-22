<template>
    <v-row>
        <!-- -------------------------------------------------------------------- -->
        <!-- Total Earning -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="4">

            <ExpenseCard title="Total Earning" amount="1000" />

        </v-col>
        <!-- -------------------------------------------------------------------- -->
        <!-- Total Order -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="4">

        </v-col>
        <!-- -------------------------------------------------------------------- -->
        <!-- Total Income -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="4">

        </v-col>

        <!-- -------------------------------------------------------------------- -->
        <!-- Total Growth -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" lg="8">

        </v-col>

        <!-- -------------------------------------------------------------------- -->
        <!-- Popular Stocks -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" lg="4">
            <RecentOrdersCard />
        </v-col>
    </v-row>
</template>
<script>
import ExpenseCard from '@/components/admin/index/ExpenseCard.vue';
import RecentOrdersCard from '@/components/admin/index/RecentOrdersCard.vue';

export default {
    name: 'AdminDashboard',
    components: {
        ExpenseCard,
        RecentOrdersCard
    }
};
</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.cards {
    display: flex;
    gap: 20px;
}
</style>