<script lang="ts" setup>
import { NButton, NCard, NFormItem, NInput } from 'naive-ui';
import { ref } from 'vue';

const email = ref("");
const password = ref("");
</script>

<template>

    <main class="h-screen w-screen bg-gray-100 flex items-center justify-center">

        <div class="w-1/3">
            <NCard title="Login">
                <NFormItem>
                    <NInput v-model:value="email" placeholder="email" />
                </NFormItem>
                <NFormItem>
                    <NInput v-model:value="password" type="password" placeholder="Mot de passe" />
                </NFormItem>
                <div class="flex justify-end">
                    <NButton type="primary">Login</NButton>
                </div>
            </NCard>
        </div>

    </main>
</template>