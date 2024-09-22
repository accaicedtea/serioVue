<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="text-center">Login</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="email" label="Email" :rules="emailRules" required></v-text-field>
                            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                            <v-btn type="submit" color="primary">Login</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <!-- 

            This code snippet represents a Vue component template that includes a Vuetify button (v-btn).
            <v-btn @click="logout">logout</v-btn>
            The button has a click event listener attached to it, which triggers the 'logout' method when clicked.
        -->

    </v-container>

</template>


<script>
/**
 * @data
 * email: string - The email entered by the user.
 * password: string - The password entered by the user.
 *
 * @methods
 * login: async function - Authenticates the user with Supabase server using the provided email and password. If successful, redirects the user to the '/tasks' page. Otherwise, handles the login error.
 * logout: async function - Signs out the user from Supabase server. If successful, logs a message indicating successful logout. Otherwise, handles the logout error.
 *
 * @dependencies
 * supabase: object - The Supabase plugin used for authentication.
 */
import { supabase } from '../plugins/supabase';
import { Preferences } from '@capacitor/preferences';

export default {
    data() {
        return {
            email: '',
            password: '',
            emailRules: [
                value => {
                    if (value) return true

                    return 'E-mail is requred.'
                },
                value => {
                    if (/.+@.+\..+/.test(value)) return true

                    return 'E-mail must be valid.'
                },
            ],
            passwordRules: [
                value => {
                    if (value) return true
                    return 'Password is required.'
                },
                value => {
                    if (/^(?=.*[A-Z])(?=.*\W).{8,}$/.test(value)) return true

                    return 'Password must be valid.'
                }
            ]
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
                    console.log("Login successful");

                    // Save user data and session
                    const { data: { user } } = await supabase.auth.getUser();
                    const userData = JSON.stringify(user);

                    await Preferences.set({ key: 'user', value: userData });
                    await Preferences.set({ key: 'currentPage', value: '/login' });

                    // Retrieve and print user data, session, and current page
                    const userRet = await Preferences.get({ key: 'user' });
                    const currentPageRet = await Preferences.get({ key: 'currentPage' });

                    const savedUser = JSON.parse(userRet.value);
                    const savedCurrentPage = currentPageRet.value;
                    // reload the page
                    location.reload();
                    
                    //console.log('User:', savedUser);
                    // console.log('User:', savedUser.id);
                    // console.log('Role:', role);
                    // console.log('Current page:', savedCurrentPage);

                    // Redirect to tasks page
                    //this.$router.push('/tasks');
                }
            } catch (error) {
                console.error(error)
                // Handle login error
            }
        },
        async logout() {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error(error);
                    // Handle logout error
                } else {
                    console.log("Logout successful");
                    // Clear preferences
                    await Preferences.clear();
                    // Perform any additional actions after logout
                }
            } catch (error) {
                console.error(error);
                // Handle logout error
            }
        }
    }
}

</script>





<style scoped>
/* Add custom styles here */
</style>
