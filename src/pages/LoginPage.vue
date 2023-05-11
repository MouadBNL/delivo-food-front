<script lang="ts" setup>
import { NButton, NCard, NFormItem, NInput, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from '../services/http'
import {useAuthStore} from '../stores/use-auth-store'
import { useRoute, useRouter } from 'vue-router';

const msg = useMessage()

const email = ref("");
const password = ref("");
const isLoading  = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const login = async () => {
    try {
        isLoading.value = true
        await authStore.login(email.value, password.value)
        console.log("TOKEN: " + authStore.token)

        if(authStore.user && authStore.user.role == "admin"){
            router.push({name: "admin.dashboard"})
        }
    } catch (error) {
        msg.error("Login error, please verify your email and password")
    } finally{
        isLoading.value = false
    }
}

const test = async () => {
    try {
        await authStore.verifyToken()
        if(authStore.user){
            msg.success("You are authenticated: " + authStore.user.id)
        }
    } catch (err) {
        msg.error("You are not authenticated")
    }
}
</script>

<template>

    <main class="h-screen w-screen bg-gray-100 flex items-center justify-center">

        <div class="w-1/3">
            <NCard title="Login">
                <NFormItem label="Email">
                    <NInput v-model:value="email" placeholder="Email" />
                </NFormItem>
                <NFormItem label="Mot de passe">
                    <NInput v-model:value="password" type="password" placeholder="Mot de passe" />
                </NFormItem>
                <div class="flex justify-end gap-4">
                    <NButton @click="test">Test token</NButton>
                    <NButton type="primary" :loading="isLoading" @click="login">Login</NButton>
                </div>
            </NCard>
        </div>

    </main>
</template>