<template>
    <v-card class="expense-card">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>{{ description }}</v-card-text>
        <v-card-subtitle class="amount" style="font-size: 24px;">{{ amount | currency }}</v-card-subtitle>
    </v-card>
</template>
<script>
export default {
    name: 'ExpenseCard',
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
    filters: {
        currency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        }
    }
}
</script>

<style scoped>
.expense-card {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 16px 0;
}

.expense-card h3 {
    margin: 0 0 8px;
}

.expense-card .amount {
    font-weight: bold;
    color: #2ecc71;
}
</style>