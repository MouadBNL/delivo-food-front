<script setup lang="ts">
import { NButton, NDialogProvider, NMessageProvider } from "naive-ui";
import { onMounted } from "vue";
import { useAuthStore } from "./stores/use-auth-store";
const authStore = useAuthStore()


onMounted(async () => {
  authStore.verifyToken()
})
</script>

<template>
  <NMessageProvider>
    <NDialogProvider>
      <RouterView></RouterView>
    </NDialogProvider>
  </NMessageProvider>
</template>