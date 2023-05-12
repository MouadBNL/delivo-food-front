<script setup lang="ts">
import { useMessage } from 'naive-ui';
import http from '../services/http';
import { useAuthStore } from '../stores/use-auth-store';


const authStore = useAuthStore()
const msg  = useMessage()

const createOrder = async () => {
    try {
        const res = await http.post('orders')
        if(!res.data.success) throw new Error()
        msg.success("Order created successfully")
    } catch (error) {
        msg.error("An error occured when placing your order.")
    } finally {
        authStore.getCart()
    }

}
</script>


<template>
    <div class="bg-white rounded-lg px-4 pt-8 pb-8 shadow-lg">
        <h2 class="text-2xl text-center font-bold mb-4">Votre commande</h2>
        <template v-if="authStore.isAuthenticated && !authStore.isCartEmpty">
            <div class="grid grid-cols-1 gap-y-2 mb-8">
                <div v-for="(item) in authStore.cart">
                    <div class="flex justify-between bg-gray-50 p-1 rounded">
                        <p class="font-bold">{{ item.quantity }}X</p>
                        <p class="">{{ item.name }}</p>
                        <span class="block w-24 flex-shrink-0 font-bold">{{item.price}} Dhs</span>
                    </div>
                </div>
            </div>
            <button class="bg-green-600 text-white px-4 py-2 rounded-full w-full text-lg font-bold mb-4" @click="createOrder">Checkout : {{ authStore.cartTotal }} Dhs</button>
            <button v-if="!authStore.isCartEmpty" class="bg-red-600 text-white px-4 py-2 rounded-full w-full text-lg font-bold" @click="authStore.emptyCart">Empty my cart</button>
        </template>
        <template v-else>
            <p class="w-2/3 mx-auto text-gray-700 font-light text-center">Vous n'avez ajouté aucun produit. Quand vous le ferez, vous les verrez ici !</p>
        </template>
    </div>
</template>