<template>
    <v-container>
        <v-layout v-resize="onResize" column style="padding-top:56px">
            <v-data-table-virtual :headers="headers" :items="items" height="400" item-value="id"
                :class="{ mobile: isMobile }">
                <template slot="items" slot-scope="props">
                    <tr v-if="isMobile">
                        <td>
                            <ul class="flex-content">
                                <li class="flex-item" data-label="id">{{ items.id }}</li>
                                <li class="flex-item" data-label="name">{{ items.name }}</li>
                                <li class="flex-item" data-label="price">{{ items.price }}</li>
                                <li class="flex-item" data-label="quantita">{{ items.quantita }}</li>
                                <li class="flex-item" data-label="richiedi">{{  items.richiedi }}</li>
                            </ul>
                        </td>
                    </tr>
                </template>
            </v-data-table-virtual>
        </v-layout>
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
            isMobile: false,
            headers: [
                {
                    title: 'Id',
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
        onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
            console.log(this.isMobile);
        },
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

            // Save the file
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                // For Android and iOS devices, use the FileSaver.js library to save the file
                const blob = doc.output('blob');
                const fileSaver = require('file-saver');
                fileSaver.saveAs(blob, fileName);
            } else {
                // For other devices, use the built-in save function of jsPDF
                doc.save(fileName);
            }
        },
    },
    mounted() {
        this.fetchData();
    },
};
</script>

<style>
.mobile {
    color: #333;
}

@media screen and (max-width: 768px) {
    .mobile table.v-table tr {
        max-width: 100%;
        position: relative;
        display: block;
    }

    .mobile table.v-table tr:nth-child(odd) {
        border-left: 6px solid deeppink;
    }

    .mobile table.v-table tr:nth-child(even) {
        border-left: 6px solid cyan;
    }

    .mobile table.v-table tr td {
        display: flex;
        width: 100%;
        border-bottom: 1px solid #f5f5f5;
        height: auto;
        padding: 10px;
    }

    .mobile table.v-table tr td ul li:before {
        content: attr(data-label);
        padding-right: 0.5em;
        text-align: left;
        display: block;
        color: #999;
    }

    .v-datatable__actions__select {
        width: 50%;
        margin: 0px;
        justify-content: flex-start;
    }

    .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
        background: transparent;
    }
}

.flex-content {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.flex-item {
    padding: 5px;
    width: 50%;
    height: 40px;
    font-weight: bold;
}
</style>