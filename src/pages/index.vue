<template>
  <v-container>
    <router-link to="/login">
      <v-btn variant="outlined">Logimn</v-btn>
    </router-link>
    <v-btn @click="savePDF">Save PDF</v-btn>
  </v-container>
</template>

<script>
import { Capacitor } from '@capacitor/core';
import { jsPDF } from 'jspdf';
export default {
  data: () => ({
    currentTime: '',
  }),
  methods: {
    savePDF() {
      const doc = new jsPDF();
      doc.text('Hello world!', 10, 10);
      doc.save('sample.pdf');


      const file = new File([doc.output('blob')], 'sample.pdf', { type: 'application/pdf' });
      Capacitor.Filesystem.writeFile({
        path: 'sample.pdf',
        data: file.pdfBase64,
        directory: Capacitor.isAndroid ? Capacitor.FilesystemDirectory.External : Capacitor.FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8,
        recursive: true
      }).then((writeFileResult) => {
        console.log('File Written');
        Filesystem.getUri({
          directory: FilesystemDirectory.Data,
          path: fileName
        }).then((getUriResult) => {
          console.log(getUriResult);
          const path = getUriResult.uri;
          this.fileOpener.open(path, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(error => console.log('Error openening file', error));
        }, (error) => {
          console.log(error);
        });;
      });

    }
  },


  setup() {
    const currentTime = ref('');

    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      currentTime.value = time;
      return currentTime.value;
    };

    return {
      currentTime,
      getCurrentTime
    };
  }
}
</script>
