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
            </v-data-table-virtual>
        </v-layout>
        <v-btn @click="generateReceipt" color="blue">Genera Scontrino</v-btn>
    </v-container>
</template>

<script>
/**
 * @data
 * - dialog: Boolean - Represents the visibility of a dialog.
 * - isMobile: Boolean - Indicates whether the current device is a mobile device or not.
 * - headers: Array - An array of objects representing the table headers.
 *   - title: String - The title of the header.
 *   - align: String - The alignment of the header.
 *   - key: String - The key used to access the corresponding data in the items array.
 *   - sortable: Boolean - Indicates whether the header is sortable or not.
 * - items: Array - An array of objects representing the table rows.
 *
 * @dependencies
 * - supabase: Object - The supabase object imported from '@/plugins/supabase'.
 * - jsPDF: Object - The jsPDF object imported from 'jspdf'.
 *
 * @methods
 * - onResize: A method that is called when the window is resized. It updates the isMobile property based on the window width.
 * - fetchData: A method that fetches data from the 'scontrinoo' table using the supabase object and updates the items array.
 * - generateReceipt: A method that generates a receipt using the jsPDF library. It creates a PDF document, adds text and tables to it, and saves the file.
 *
 * @mounted
 * - Calls the fetchData method to fetch data when the component is mounted.
 */

import { supabase } from '@/plugins/supabase';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
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
                const total = item.richiedi * item.price;
                grandTotal += total;
                doc.text(item.name, 10, y);
                doc.text(item.price.toString() + "U+0020€", 10 + columnWidths[0], y);
                doc.text(item.richiedi.toString(), 10 + columnWidths[0] + columnWidths[1], y);
                doc.text(total.toFixed(2) + "U+0020€", 10 + columnWidths[0] + columnWidths[1] + columnWidths[2], y);
                y += 10;
            });

            // Draw grand total
            doc.text(`Totale: ${grandTotal.toFixed(2)}U+0020€`, 130, y);
            const date = new Date();
            const fileName = `ordine-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-ordine.pdf`;

            // Save the file
            if (Capacitor.isNativePlatform()) {
                // For Android and iOS devices, use the Capacitor Filesystem plugin to save the file
                const pdfData =  // the data of the pdf
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

