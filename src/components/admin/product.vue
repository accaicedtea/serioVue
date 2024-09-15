<template>
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'name', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Prodotti</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Nuovo prodotto
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="editedItem.price" label="Prezzo"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="editedItem.max_quantity" label="Quanità massima"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
/**
 * Component for managing products in the admin panel.
 *
 * @name Task
 * @component
 *
 * @description
 * This component allows the user to add, edit, and delete products.
 *
 * @data
 * - `dialog` (Boolean): Flag indicating whether the dialog is open or not.
 * - `dialogDelete` (Boolean): Flag indicating whether the delete dialog is open or not.
 * - `headers` (Array): Array of objects representing the table headers.
 * - `desserts` (Array): Array of objects representing the products.
 * - `editedIndex` (Number): Index of the currently edited item.
 * - `editedItem` (Object): Object representing the currently edited item.
 * - `defaultItem` (Object): Object representing the default item.
 *
 * @computed
 * - `formTitle` (String): Title of the form based on the edited index.
 *
 * @watch
 * - `dialog` (Boolean): Watcher for the dialog flag.
 * - `dialogDelete` (Boolean): Watcher for the delete dialog flag.
 *
 * @created
 * - `initialize` (Function): Initializes the component by fetching the products from the server.
 *
 * @methods
 * - `initialize` (Function): Fetches the products from the server and assigns them to the desserts array.
 * - `editItem` (Function): Sets the edited index and item and opens the dialog for editing.
 * - `deleteItem` (Function): Sets the edited index and item and opens the delete dialog.
 * - `deleteItemConfirm` (Function): Deletes the item from the desserts array and closes the delete dialog.
 * - `close` (Function): Closes the dialog and resets the edited item and index.
 * - `closeDelete` (Function): Closes the delete dialog and resets the edited item and index.
 * - `save` (Function): Saves the edited item by updating the desserts array or adding a new item.
 *
 * @style
 * - Your component's CSS styles go here.
 */

import { supabase } from '@/plugins/supabase';

export default {
  name: 'Task',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Name',
        align: 'start',
        sortable: false,
        key: 'name',
      },
      { title: 'Prezzo', key: 'price' },
      { title: 'Quantità Max', key: 'max_quantity' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      categories: '',
      stato: 0,
    },
    defaultItem: {
      name: '',
      categories: '',
      stato: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.desserts;
      supabase
        .from('product')
        .select('name, price, max_quantity')
        .then(response => {
          this.desserts = response.data;
        });
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        if (this.editedItem.name && this.editedItem.category) {
          this.desserts.push(this.editedItem);
          supabase
            .from('product')
            .insert([{
              name: "ZZZZZZZZZZZZZZZZZZZZZZZZZ",
              category: 1,
              stat: false
            }
            ])
            .then(stauts => {
              console.log('New task created');
            })
            .catch(error => {
              console.error('Error creating task:', error);
            });
        }
      }
      this.close()
    },
  },
}
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>
