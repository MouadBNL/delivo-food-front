<script lang="ts" setup>
import { NButton, NFormItem, NInput, NInputNumber, NSelect, useMessage } from 'naive-ui';
import Cart from '../components/Cart.vue';
import NavHeader from '../components/NavHeader.vue';
import { ref } from 'vue';
import http from '../services/http';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useAuthStore } from '../stores/use-auth-store';

const authStore = useAuthStore()
const msg = useMessage()

onMounted(async () => {
    await loadCities()
    await search()
})


const isSearchLoading = ref(false)

const items = ref<{
    id: number,
    "name": string,
    "description": string,
    "price": number,
    "estimated_time": number,
    "image": string,
    "menu": {
        "name": string,
        "restaurant": {
            "id": number,
            "name": string,
            "coordinates": string,
            "slug": string,
            "address": string,
            "image": string,
            "city": {
                "id": number,
                "name": string
            }
        }
    }
}[]>([])
const search = async () => {
    try {
        isSearchLoading.value = true;
        items.value = []
        const res = await http.get('/search', {
            params: searchQuery
        })
        items.value = res.data.items
    } catch (error) {
        
    } finally {
        isSearchLoading.value = false
    }
}
const citiesOption = ref<{lable:string, value:number}[]>([])
const loadCities = async () => {
    try {
        const res = await http.get('/admin/cities')
        citiesOption.value = res.data.data.map((city) => {
            return {
                label: city.name,
                value: city.id
            }
        })
    } catch (error) {
        msg.error("Error loading cities")
        console.error(error)
    }
}

const searchQuery = reactive({
    search: "",
    cityid: null,
    min_price: 0,
    max_price: 0,
    min_estimated_time: 0,
    max_estimated_time: 0,
    max_distance: 0
})
</script>

<template>
    <NavHeader/>

    <main class="bg-gray-50 min-h-screen py-16">


        <div class="bg-white p-4 rounded shadow container mx-auto mb-8">
            <div class="grid grid-cols-3 gap-x-4 mb-4">
                <NFormItem label="Search">
                    <NInput placeholder="Search" v-model:value="searchQuery.search"/>
                </NFormItem>
                <NFormItem label="City">
                    <NSelect placeholder="city" :options="citiesOption" v-model:value="searchQuery.cityid"/>
                </NFormItem>
                <NFormItem label="Min price">
                    <NInputNumber v-model:value="searchQuery.min_price" class="w-full"/>
                </NFormItem>
                <NFormItem label="Max price">
                    <NInputNumber v-model:value="searchQuery.max_price" class="w-full"/>
                </NFormItem>
                <NFormItem label="Min estimated time">
                    <NInputNumber v-model:value="searchQuery.min_estimated_time" class="w-full"/>
                </NFormItem>
                <NFormItem label="Max estimated time">
                    <NInputNumber v-model:value="searchQuery.max_estimated_time" class="w-full"/>
                </NFormItem>
                <!-- <NFormItem label="Max distance">
                    <NInputNumber v-model:value="searchQuery.max_distance" class="w-full"/>
                </NFormItem> -->
            </div>
            <div class="flex justify-end">
                <NButton class="w-full" type="info" @click="search">Search</NButton>
            </div>
        </div>
        <div class="container mx-auto flex">
            <div class="w-2/3 flex-shrink-0">
                <div class="bg-white p-4 rounded shadow">
                    
                    <div v-if="!isSearchLoading && items.length > 0" class="grid grid-cols-3 gap-x-4 gap-y-8">
                        <div v-for="item in items" :key="item.name">
                            <img :src="item.image" class="block aspect-video rounded-lg mb-4 object-cover shadow h-36" />
                            <div class="flex justify-between gap-2">
                                <div>
                                    <h4 class="text-lg">{{ item.name }}</h4>
                                    <h4 class="font-bold">{{ item.price }} Dhs | estimated time {{ item.estimated_time }} min</h4>
                                    <RouterLink :to="{name: 'restaurants.show', params: {slug: item.menu.restaurant.slug}}">
                                        <div class="p-1 flex hover:bg-gray-200 gap-2 items-center">
                                            <img :src="item.menu.restaurant.image" class="block aspect-square object-cover h-8 rounded flex-shrink-0" />
                                            <span class="text-lg font-bold">{{ item.menu.restaurant.name }}</span>
                                        </div>
                                    </RouterLink>
                                </div>
                                <div>
                                    <svg @click="() => authStore.addItemToCart(item.id)" class="h-6 w-6 cursor-pointer" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="isSearchLoading" class="">
                        <p>Loading...</p>
                    </div>
                    <div v-if="items.length == 0" class="">
                        <p>No results found</p>
                    </div>
                </div>
            </div>
            <div class="w-2/3 pl-8">
                <Cart/>
            </div>
        </div>

    </main>
</template>