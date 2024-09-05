<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="text-center">Login</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="email" label="Email" required></v-text-field>
                            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                            <v-btn type="submit" color="primary">Login</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-btn @click="see">guarda</v-btn>
    </v-container>

</template>


<script>
import {supabase} from '../plugins/supabase';

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login() {
            try {
          // Connect to Supabase server and authenticate user
          const { user, error } = await supabase.auth.signInWithPassword({
              email: this.email,
              password: this.password
          })

          if (error) {
              console.error(error)
              // Handle login error
          } else {
              // User logged in successfully
              localStorage.setItem('auth', 'true');
              this.$router.push('/user/tasks');
          }
            } catch (error) {
          console.error(error)
          // Handle login error
            }
        },
        async seeCurrentUser() {
            const localU = await supabase.auth.getSession();
            console.log(localU);
            const {error} = await supabase.auth.signOut();
            if(error){
                console.log(error);
            }else{
                console.log("logout effettuato");
                appStore.logout();
            }

        },
        async see(){
          const appStore = useAppStore()
          console.log(appStore.isAuthenticated)
        }
    }
}

</script>





<style scoped>
/* Add custom styles here */
</style>
