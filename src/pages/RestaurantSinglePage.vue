<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import http from '../services/http';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';
import Cart from '../components/Cart.vue'
import { useAuthStore } from '../stores/use-auth-store';
import NavHeader from '../components/NavHeader.vue';

const route = useRoute()
const msg = useMessage()
const authStore = useAuthStore()

interface RestaurantI {
    name: string,
    slug: string,
    address: string,
    city: {
        id: number,
        name: string
    },
    coordinates: string,
    phone: string,
    banner: string,
    menus: {
        name: string,
        items: {
            id: number,
            name: string,
            description: string,
            price: number,
            estimated_time: number,
            image: string
        }[],
    }[]
}

const restaurant = ref<RestaurantI>()

onMounted(async () => {
    try {
        const res = await http.get('/restaurant/' + route.params.slug)
        restaurant.value = res.data
        console.log(res.data)
    } catch (error) {
        msg.error("Error fetching restaurant")
        console.error(error)
    }
})
</script>

<template>
    <NavHeader />
    <main class="bg-gray-50 pb-16">
        <section v-if="restaurant">
            <img :src="restaurant.banner" class="block w-full h-96 object-cover"/>
            <div class="container mx-auto flex -translate-y-16">
                <div class="w-4/6">
                    <div class="bg-white rounded-lg p-8 shadow-lg mb-8">
                        <h1 class="text-5xl font-bold mb-4">{{ restaurant.name }}</h1>
                        <div class="flex items-center gap-8">
                            <p>City: {{ restaurant.city.name }}</p>
                            <p>Address: {{ restaurant.address }}</p>
                            <p>Phone: {{ restaurant.phone }}</p>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg p-8 shadow-lg">
                        <h2 class="text-5xl font-bold mb-4">Menus</h2>
                        <div class="grid grid-cols-1 gap-y-8">
                            <div v-for="(menu) in restaurant.menus" :key="menu.name">
                                <h3 class="text-2xl font-bold mb-4">{{ menu.name }}</h3>
                                <div class="grid grid-cols-5 gap-4">
                                    <div v-for="item in menu.items" :key="item.id">
                                        <img :src="item.image" class="block aspect-square rounded-lg mb-4 object-cover shadow" />
                                        <div class="flex justify-between gap-2">
                                            <div>
                                                <h4 class="text-lg">{{ item.name }}</h4>
                                                <h4 class="font-bold">{{ item.price }} Dhs</h4>
                                            </div>
                                            <div>
                                                <svg @click="() => authStore.addItemToCart(item.id)" class="h-6 w-6 cursor-pointer" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-2/6 pl-8">
                    <Cart/>
                </div>
            </div>
        </section>
        <section v-else>
            <div class="container mx-auto py-16">
                <p>Loading...</p>
            </div>
        </section>
    </main>
</template>