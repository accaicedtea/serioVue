<template>
    <v-container>

        <v-data-table-virtual :headers="headers" :items="items" height="400" item-value="id" class="text-h5">

        </v-data-table-virtual>

        <v-btn @click="generateReceipt" color="blue">Genera Scontrino</v-btn>
    </v-container>
</template>
<script>
import { supabase } from '@/plugins/supabase';
import { jsPDF } from 'jspdf';
export default {
    data() {
        return {
            dialog: false,
            headers: [
                {
                    title: 'ID',
                    align: 'start',
                    key: 'id'
                },
                { title: 'Nome', key: 'name', sortable: true },
                { title: 'Prezzo', key: 'price', sortable: true },
                { title: 'qt. Massima', key: 'quantita', sortable: true },
                { title: 'qt. da ordinare', key: 'richiedi', sortable: false },
            ],
            items: [],
        };
    },
    methods: {
        async fetchData() {
            try {
                let { data: items, error } = await supabase
                    .from('scontrinoo')
                    .select('*');
                if (error) {
                    throw new Error(error.message);
                }
                this.items = items;
            } catch (error) {
                console.error('Errore nel recupero dei dati:', error);
            }
        },
        async generateReceipt() {
            const doc = new jsPDF();
            doc.setFontSize(10);
            doc.text('Scontrino', 10, 10);
            doc.text('Destinatario: [Inserisci il nome del destinatario]', 10, 20);
            doc.text('Numero ordine: [Inserisci il numero dell\'ordine]', 10, 30);
            doc.text('Contatti impresa: [Inserisci i contatti dell\'impresa]', 10, 40);
            let y = 50;

            // Table headers
            const headers = ['Nome', 'Prezzo/Unità', 'Totale'];
            const columnWidths = [60, 40, 40];

            // Draw table header
            headers.forEach((header, index) => {
                doc.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), y);
            });
            y += 10;

            // Draw table rows and calculate total
            let grandTotal = 0;
            this.items.forEach(item => {
                const total = item.richiedi * item.price;
                grandTotal += total;
                doc.text(item.name, 10, y);
                doc.text(item.price.toString(), 10 + columnWidths[0], y);
                doc.text(total.toString(), 10 + columnWidths[0] + columnWidths[1], y);
                y += 10;
            });

            // Draw grand total
            doc.text(`Totale: ${grandTotal.toFixed(2)} €`, 130, y);
            const date = new Date();
            const fileName = `ordine-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-ordine.pdf`;
            doc.save(fileName);

        },
    },
    mounted() {
        this.fetchData();
    },
};
</script>