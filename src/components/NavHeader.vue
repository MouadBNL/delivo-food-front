<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/use-auth-store';

const authStore = useAuthStore()
const router = useRouter()
const logout = () => {
    authStore.logout()
    router.push({name: 'index'})
}
</script>

<template>
    <header class="bg-green-600 shadow">
        <div class="container mx-auto py-4 flex items-center justify-between">
            <RouterLink :to="{name: 'index'}">
                <h1 class="text-2xl font-bold text-white">DelivoFood</h1>
            </RouterLink>
            

            <RouterLink :to="{name: 'search'}">
                <button class="rounded-full px-8 py-3 font-medium text-white hover:bg-white hover:text-black transition border-white border">Search</button>
            </RouterLink>

            <div v-if="! authStore.isAuthenticated" class="flex gap-4">
                <RouterLink :to="{name: 'register'}">
                    <button class="rounded-full px-8 py-3 font-medium text-white hover:bg-white hover:text-black transition border-white border">Create an account</button>
                </RouterLink>
                <RouterLink :to="{name: 'login'}">
                    <button class="bg-white rounded-full px-8 py-3 font-medium hover:bg-green-700 hover:text-white transition  border-white border">Login to your account</button>
                </RouterLink>
            </div>
            <div v-else class="flex gap-4 items-center">
                <div class="text-lg text-white">
                    Welcome, {{ authStore.user.name }}
                </div>
                <button @click="logout" class="px-4 py-1 rounded hover:bg-green-700 text-white underline font-bold text-lg">Logout</button>
                <RouterLink :to="{name: 'orders'}">
                    <span class="block px-4 py-1 rounded hover:bg-green-700 text-white underline font-bold text-lg">My orders</span>
                </RouterLink>
            </div>
        </div>
    </header>
</template>