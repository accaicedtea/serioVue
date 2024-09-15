<template>
  <v-container>
    <router-link to="/login">
      <v-btn variant="outlined">Logidmn</v-btn>
    </router-link>
    <v-btn @click="createAndPrintFile">Print file</v-btn>
  </v-container>
  <v-btn v-for="buttonId in buttonIds" :key="buttonId" :id="buttonId" @click="incrementAndSave(buttonId)">{{ buttonId.value
    }}</v-btn>
</template>

<script>
import _ from 'lodash';


export default {
  data() {
    return {
      buttonIds: [
        { id: 'button1', value: 1 },
        { id: 'button2', value: 2 },
        { id: 'button3', value: 3 }
      ],
      value: 0,
      interval: null,
    };
  },
  methods: {
    incrementAndSave(item) {
      item.value++;
      // Clear the previous debounce function to prevent multiple updates
      if (this.debounceFunction) {
        clearTimeout(this.debounceFunction);
      }

      // Debounce the increment operation
      this.debounceFunction = _.debounce(() => {
        // Update the item quantity in your data source

        console.log('Updated item quantity:', item.id, ': ', item.value);
        // Send the updated data to Supabase
        // ...

        // Clear the debounce function after the update
        this.debounceFunction = null;
      }, 1000); // Adjust the debounce delay as needed

      this.debounceFunction();
    },
    async createAndPrintFile() {
      /**
        * Creates a file with the given name and content, and prints the file.
        * 
        * @async
        * @method createAndPrintFile
        * @returns {Promise<void>} A promise that resolves when the file is created and printed.
        * 
        * TODO: Implement the createAndPrintFile method.       
      */


    },

  },
};
</script>