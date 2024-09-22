<template>
  <v-data-table hide-default-footer :headers="headers" :items="desserts" :sort-by="[{ key: 'name', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Task</v-toolbar-title>
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
                    <v-text-field v-model="editedItem.category" label="Categoria"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="editedItem.stat" label="fatto?"></v-checkbox>

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
 * @name Task
 * @description A Vue component for managing tasks.
 * 
 * @data
 *  - dialog: Boolean - Flag to control the visibility of the dialog.
 *  - dialogDelete: Boolean - Flag to control the visibility of the delete dialog.
 *  - headers: Array - An array of objects representing the table headers.
 *  - desserts: Array - An array of objects representing the tasks.
 *  - editedIndex: Number - The index of the currently edited task.
 *  - editedItem: Object - The currently edited task object.
 *  - defaultItem: Object - The default task object.
 * 
 * @computed
 *  - formTitle(): String - Returns the title of the form based on the editedIndex.
 * 
 * @watch
 *  - dialog(val: Boolean) - Watcher for the dialog property. Closes the dialog when it becomes false.
 *  - dialogDelete(val: Boolean) - Watcher for the dialogDelete property. Closes the delete dialog when it becomes false.
 * 
 * @methods
 *  - initialize(): void - Initializes the component by fetching tasks from the server.
 *  - editItem(item: Object): void - Sets the editedIndex and editedItem properties to the selected task and opens the dialog.
 *  - deleteItem(item: Object): void - Sets the editedIndex and editedItem properties to the selected task and opens the delete dialog.
 *  - deleteItemConfirm(): void - Deletes the selected task from the desserts array and closes the delete dialog.
 *  - close(): void - Closes the dialog and resets the editedItem and editedIndex properties.
 *  - closeDelete(): void - Closes the delete dialog and resets the editedItem and editedIndex properties.
 *  - save(): void - Saves the edited task by updating the desserts array and making an API call to create a new task if it's a new item.
 */

import { supabase } from '@/plugins/supabase';
import { Preferences } from '@capacitor/preferences';
export default {
  name: 'Task',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'name',
      },
      { title: 'Categoria', key: 'category' },
      { title: 'Stato', key: 'stat' },
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
        .from('task')
        .select('name, category, stat')
        .then(response => {
          this.desserts = response.data;
        });
      Preferences.set({ key: 'selectedAdmin', value: 'task' });
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
            .from('task')
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
