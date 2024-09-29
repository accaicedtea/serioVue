<template>
    <v-data-table-virtual :headers="headers" :items="items" height="400" item-value="id" class="elevation-1">
        <template v-slot:item.actions="{ item }">
            <v-row justify="center">
                <v-col cols="6" class=" justify-center">
                    <v-btn :size="isMobile ? 'small' : 'default'" @click="decrementQuantity(item)" color="red">
                        <v-icon color="white">mdi-minus</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="6" class="justify-center">
                    <v-btn :size="isMobile ? 'small' : 'default'" @click="incrementQuantity(item)" color="green">
                        <v-icon color="white">mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
        <template v-slot:item.richiedi="{ item }">
            {{ item.richiedi ?? 0 }}
        </template>
    </v-data-table-virtual>

    <v-btn @click="generateReceipt" color="lime-lighten-2" class="mt-1">Genera ordine</v-btn>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="getSBColor()">
        {{ text }}
        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar = false">
                Chiudi
            </v-btn>
        </template>
    </v-snackbar>

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
            snackbar: false,
            timeout: 2000,
            dialog: false,
            isMobile: false,
            text: '',
            headers: [
                { title: 'Nome', key: 'name', sortable: true, width: '30%' },
                { title: 'qt. da ordinare', key: 'richiedi', sortable: false, width: '20%' },
                { title: 'Azioni', key: 'actions', sortable: false, width: '50%' },
            ],
            items: [],
        };
    },
    methods: {
        getSBColor() {
            return this.text.includes('Errore') ? 'red' : 'green';
        },
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
        generatePDF() {
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
            const pdfOutput = doc.output('datauristring');
        },
        async generateReceipt() {
            // Generate PDF
            // save order to database
            try {
                const orderedItems = this.items.filter(item => item.richiedi > 0);
                const totalAmount = orderedItems.reduce((sum, item) => sum + (item.price * item.richiedi), 0);
                const itemIds = orderedItems.map(item => item.id);
                const quantities = orderedItems.map(item => item.richiedi);

                const { data, error } = await supabase
                    .from('order')
                    .insert([
                        {
                            total: totalAmount,
                            item_ordered: itemIds,
                            qt_ordered: quantities,
                            ordered_at: new Date(),
                        }
                    ]);

                if (error) {
                    console.error('Errore: nel salvataggio dell\'ordine sono quaa:', error);

                    this.text = 'Errore: nel salvataggio dell\'ordine (NON SI POSSONO FARE PIÙ ORDINI IN UN GIORNO)';

                    this.snackbar = true;
                } else {

                    this.text = 'Ordine salvato con successo';

                    this.snackbar = true;
                }
            } catch (error) {
                console.error('Errore nel salvataggio dell\'ordine: sono quiii', error);
                this.text = 'Errore: nel salvataggio dell\'ordine';
                this.snackbar = true;
            }
        },
    },
    mounted() {
        this.fetchData();
        window.addEventListener('resize', this.onResize);
        this.onResize(); // Initial check
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
};
</script>
