<script setup lang="ts">
import TheAuthLayoutSidebar from './AdminLayoutSidebar.vue'
import { NLayout, NLayoutHeader, NLayoutSider, NButton, NLayoutFooter, useMessage, useLoadingBar, NCard, NSpin } from "naive-ui"
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/use-auth-store';
import { onMounted } from 'vue';
const route = useRoute()
const router= useRouter()
const authStore = useAuthStore()
const handleLogout = () => {
    router.push({name: 'home'})
}

onMounted(async () => {

})
</script>


<template>
    <NLayout style="height: 100vh">
    <n-layout-header style="height: 64px;" bordered>
		<div class="flex justify-between items-center px-6 h-full">
			<div>
        <router-link :to="{name: 'admin.dashboard'}">
            <div class="flex items-center gap-4">
                <h2 class="text-xl font-black m-0 text-black no-underline">DelivoFood</h2>
            </div>
        </router-link>
			</div>
			<div class="flex items-center gap-5">
				<span class=" inline-block">
					{{ authStore.user.name }}
				</span>
				<NButton type="error" @click="handleLogout">
					Se déconnecter
				</NButton>
			</div>
		</div>
	</n-layout-header>
    <n-layout position="absolute" style="top: 64px; bottom: 64px;" has-sider>
      <n-layout-sider
        content-style="padding: 24px;"
        collapse-mode="transform"
        :collapsed-width="20"
        show-trigger="arrow-circle"
        :native-scrollbar="false"
        bordered
      >
        <TheAuthLayoutSidebar />
      </n-layout-sider>
      <n-layout class="bg-gray-100" style="background-color: rgb(243 244 246 / 0.5)" :native-scrollbar="false">
        <main class="container mx-auto p-6">
            <template v-if="authStore.isLoadingToken">
                <NCard>
                    <div class="flex items-center justify-center py-16">
                        <NSpin/>
                    </div>
                </NCard>
            </template>
            <template v-else>
                <router-view :key="route.fullPath"></router-view>
            </template>
        </main>

      </n-layout>
    </n-layout>
    <n-layout-footer
      position="absolute"
      style="height: 64px; padding: 24px;"
      bordered
    >
      Réalisé par Benali Mouad et Wassim Rifay
    </n-layout-footer>
  </NLayout>
</template>