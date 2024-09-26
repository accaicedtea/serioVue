<template>
    <v-container>
        <v-layout v-resize="onResize" column>
            <v-data-table-virtual :headers="headers" :items="items" height="400" item-value="id" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                    <v-btn icon small @click="decrementQuantity(item)" color="red">
                        <v-icon color="white">mdi-minus</v-icon>
                    </v-btn>
                    <v-btn icon small @click="incrementQuantity(item)" color="green">
                        <v-icon color="white">mdi-plus</v-icon>
                    </v-btn>
                </template>
                <template v-slot:item.price="{ item }">
                    {{ item.price ?? 0 }}
                </template>
                <template v-slot:item.quantita="{ item }">
                    {{ item.quantita ?? 0 }}
                </template>
                <template v-slot:item.richiedi="{ item }">
                    {{ item.richiedi ?? 0 }}
                </template>
            </v-data-table-virtual>
        </v-layout>
        <v-btn @click="generateReceipt" color="blue">Genera Scontrino</v-btn>
    </v-container>
</template>

<script>
import { supabase } from '@/plugins/supabase';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
                { title: 'Azioni', key: 'actions', sortable: false },
            ],
            items: [],
        };
    },
    methods: {
        onResize() {
            this.isMobile = window.innerWidth < 769;
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
                this.items = items.map(item => ({
                    ...item,
                    price: item.price ?? 0,
                    quantita: item.quantita ?? 0,
                    richiedi: item.richiedi ?? 0,
                })).sort((a, b) => b.richiedi - a.richiedi); // Sort by 'richiedi' in descending order
            } catch (error) {
                console.error('Errore nel recupero dei dati:', error);
            }
        },
        incrementQuantity(item) {
            Haptics.impact({ style: ImpactStyle.Light });
            item.richiedi++;
        },
        decrementQuantity(item) {
            if (item.richiedi > 0) {
                Haptics.impact({ style: ImpactStyle.Light });
                item.richiedi--;
            }
        },
        async generateReceipt() {
            const doc = new jsPDF();
            doc.setFontSize(10);
            doc.text('Scontrino', 10, 10);
            doc.text('Numero ordine: [Inserisci il numero dell\'ordine]', 10, 20);
            doc.text('Destinatario: [Inserisci il nome del destinatario]', 10, 30);
            doc.text('Contatti impresa: [Inserisci i contatti dell\'impresa]', 10, 40);
            let y = 70;

            // Table headers
            const headers = ['Nome', 'Prezzo/Unità', 'Quantità', 'Totale'];
            const columnWidths = [40, 40, 40, 40];

            // Draw table header
            headers.forEach((header, index) => {
                doc.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), y);
            });
            y += 10;

            // Draw table rows and calculate total
            let grandTotal = 0;
            this.items.forEach(item => {
                if (item.richiedi > 0) {
                    const total = item.richiedi * item.price;
                    grandTotal += total;
                    doc.text(item.name, 10, y);
                    doc.text((item.price ?? 0).toString() + "€", 10 + columnWidths[0], y);
                    doc.text((item.richiedi ?? 0).toString(), 10 + columnWidths[0] + columnWidths[1], y);
                    doc.text(total.toFixed(2) + "€", 10 + columnWidths[0] + columnWidths[1] + columnWidths[2], y);
                    y += 10;
                }
            });
            // Draw a line
            doc.line(10, y, 200, y);
            y += 10;
            // Draw grand total
            doc.text(`Totale: ${grandTotal.toFixed(2)}€`, 118, y);
            const date = new Date();
            const fileName = `ordine-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-ordine.pdf`;

            // Save the file
            if (Capacitor.isNativePlatform()) {
                // For Android and iOS devices, use the Capacitor Filesystem plugin to save the file
                Filesystem.writeFile({
                    path: "test.pdf",
                    data: doc.output(),
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                }).then(() => {
                    console.log('File saved successfully');
                }).catch((error) => {
                    console.error('Error saving file:', error);
                });
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
