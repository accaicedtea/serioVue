<template>
    <v-app>
        <v-navigation-drawer v-model="menuVisible" app>
            <v-list>
                <v-list-item link>
                    <v-list-item-content>Home</v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-content>Profile</v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-content>Settings</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="toggleMenu"></v-app-bar-nav-icon>
            <v-toolbar-title>User Layout</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>

        <v-footer app>
            <v-bottom-navigation>
                <v-btn href="#">Home</v-btn>
                <v-btn href="#">Search</v-btn>
                <v-btn href="#">Notifications</v-btn>
                <v-btn href="#">Messages</v-btn>
            </v-bottom-navigation>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            menuVisible: false
        };
    },
    methods: {
        toggleMenu() {
            this.menuVisible = !this.menuVisible;
        }
    }
};
</script>

<style scoped>
.v-main {
    padding: 1rem;
}
</style>
