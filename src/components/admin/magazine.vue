<template >
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'name', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Magazzino</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Nuova attività
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
                    <v-text-field v-model="editedItem.mq" label="Mq"></v-text-field>
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
 * Component for managing magazine items.
 *
 * @name Task
 * @component
 *
 * @description
 * This component allows users to manage magazine items. It provides functionality to add, edit, and delete items from the magazine.
 *
 * @data
 * - `dialog` (Boolean): Flag to control the visibility of the dialog.
 * - `dialogDelete` (Boolean): Flag to control the visibility of the delete dialog.
 * - `headers` (Array): An array of objects representing the table headers.
 * - `desserts` (Array): An array of magazine items.
 * - `editedIndex` (Number): The index of the currently edited item.
 * - `editedItem` (Object): The currently edited item.
 * - `defaultItem` (Object): The default item used for resetting the form.
 *
 * @computed
 * - `formTitle` (String): The title of the form based on the value of `editedIndex`.
 *
 * @watch
 * - `dialog` (Boolean): Watcher for the `dialog` property. Closes the dialog when `dialog` becomes `false`.
 * - `dialogDelete` (Boolean): Watcher for the `dialogDelete` property. Closes the delete dialog when `dialogDelete` becomes `false`.
 *
 * @created
 * - `initialize` (Method): Initializes the component by fetching magazine items from the database.
 *
 * @methods
 * - `initialize` (Method): Fetches magazine items from the database and assigns them to the `desserts` property.
 * - `editItem` (Method): Sets the `editedIndex` and `editedItem` properties to the selected item and opens the dialog.
 * - `deleteItem` (Method): Sets the `editedIndex` and `editedItem` properties to the selected item and opens the delete dialog.
 * - `deleteItemConfirm` (Method): Deletes the item at `editedIndex` from the `desserts` array and closes the delete dialog.
 * - `close` (Method): Closes the dialog and resets the `editedItem` and `editedIndex` properties.
 * - `closeDelete` (Method): Closes the delete dialog and resets the `editedItem` and `editedIndex` properties.
 * - `save` (Method): Saves the edited item to the database or updates the existing item if `editedIndex` is greater than -1. Closes the dialog after saving.
 */
import { supabase } from '@/plugins/supabase';
import { Preferences } from '@capacitor/preferences';
export default {
  name: 'Magazine',
  
  data: () => ({
    dialog: false,
    dialogDelete: false,
    
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'name',
      },
      { title: 'mq', key: 'mq' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      mq: '',
    },
    defaultItem: {
      name: '',
      mq: '',
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
      console.log("query");
      supabase.from('magazine').select('name, mq').then(response => {
        this.desserts = response.data;
      });
      Preferences.set({ key: 'selectedAdmin', value: 'magazine' });
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

    async save() {
      console.log("sto creando", this.editedItem);
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        if (this.editedItem.name && this.editedItem.mq) {
          this.desserts.push(this.editedItem);
          const { data, error } = await supabase
            .from('magazine')
            .insert([
              { name: this.editedItem.name, mq: this.editedItem.mq },
            ])
          if (error) {
            console.error('Error inserting new row:', error.message)
          } else {
            console.log('Row inserted:', data)
          }
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
