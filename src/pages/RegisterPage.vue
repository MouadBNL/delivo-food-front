<script lang="ts" setup>
import { NButton, NCard, NFormItem, NInput, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from '../services/http'
import {useAuthStore} from '../stores/use-auth-store'
import { useRoute, useRouter } from 'vue-router';
import { reactive } from 'vue';

const msg = useMessage()

const user = reactive({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    phone: ""
})
const isLoading  = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const register = async () => {
    try {
        isLoading.value = true
        await http.post('/auth/register', user)
        msg.success("Account created succesfuly")
        router.push({name: 'login'})
    } catch (error) {
        msg.error("Could not create your account")
    } finally{
        isLoading.value = false
    }
}
</script>

<template>

    <main class="h-screen w-screen bg-gray-100 flex items-center justify-center">

        <div class="w-1/3">
            <NCard title="Create your account">
                <NFormItem label="name">
                    <NInput v-model:value="user.name" placeholder="name" />
                </NFormItem>
                <NFormItem label="email">
                    <NInput v-model:value="user.email" placeholder="email" />
                </NFormItem>
                <NFormItem label="password">
                    <NInput v-model:value="user.password" placeholder="password" type="password" />
                </NFormItem>
                <NFormItem label="Password Confirmation">
                    <NInput v-model:value="user.passwordConfirmation" placeholder="password"  type="password" />
                </NFormItem>
                <NFormItem label="phone">
                    <NInput v-model:value="user.phone" placeholder="phone" />
                </NFormItem>
                <div class="flex justify-end gap-4">
                    <NButton type="primary" :loading="isLoading" @click="register">Register</NButton>
                </div>
            </NCard>
        </div>

    </main>
</template>