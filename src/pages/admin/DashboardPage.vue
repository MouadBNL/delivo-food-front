<script lang="ts" setup>
import { NCard, NH1 } from 'naive-ui';
import { useAuthStore } from '../../stores/use-auth-store';

const authStore = useAuthStore()

</script>

<template>
    <NH1>Dashboard</NH1>
    <NCard>
        <p class="text-center text-lg">Welcome {{ authStore.user.name }}</p>
    </NCard>
</template>