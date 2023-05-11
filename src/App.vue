<script setup lang="ts">
import { NButton, NMessageProvider } from "naive-ui";
import { onMounted } from "vue";
import { useAuthStore } from "./stores/use-auth-store";
const authStore = useAuthStore()


onMounted(async () => {
  authStore.verifyToken()
})
</script>

<template>
  <NMessageProvider>
    <RouterView></RouterView>
  </NMessageProvider>
</template>