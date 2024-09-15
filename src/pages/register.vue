<template>
    <v-container>
        <v-card>
            <v-card-title>Registration</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="register">
                    <v-text-field v-model="email" label="Email"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                    <v-btn type="submit" color="primary">Register</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
/**
 * @data
 * email: string - The email entered by the user.
 * password: string - The password entered by the user.
 *
 * @methods
 * register: async function - Registers a new user by connecting to the Supabase server and authenticating the user with the provided email and password. If successful, it logs the user object and performs any necessary actions or redirects to another page. If an error occurs, it logs the error object.
 *
 * @dependencies
 * supabase: object - The Supabase plugin used for authentication.
 */
import { supabase } from '../plugins/supabase';
export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async register() {
            try {
                // Connect to Supabase server and authenticate user
                const { user, error } = await supabase.auth.signUp({
                    email: this.email,
                    password: this.password
                });

                if (error) {
                    console.error(error)
                    // Handle login error
                } else {
                    // User logged in successfully
                    console.log(user)
                    // Redirect to another page or perform other actions
                }
            } catch (error) {
                console.error(error)
                // Handle login error
            }
        }
    }
};
</script>