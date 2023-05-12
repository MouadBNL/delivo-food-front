<script lang="ts" setup>
import { NButton, NCard, NH1, NH2, NTag, useMessage } from 'naive-ui';
import { useAuthStore } from '../../stores/use-auth-store';
import http from '../../services/http';
import { onMounted } from 'vue';
import { ref } from 'vue';

interface OrderI {
    "id": number,
    "status": string
    "client": {
        "name": string,
        "phone": string
    },
    "items": {
        "id": number,
        "name": string,
        "quantity": number,
        "price": number,
        "restaurant": {
            "id": number,
            "name": string,
            "address": string,
            "coordinate": string
        }
    }[]
}


const authStore = useAuthStore()
const msg = useMessage()
const openOrders = ref<OrderI[]>([])
const myOpenOrders = ref<OrderI[]>([])
const myClosedOrders = ref<OrderI[]>([])
onMounted(async () => {
    await refreshData()
})

const refreshData = async () => {
    await getOpenOrders()
    await getMyOpenOrders()
    await getMyClosedOrders()
}
const getOpenOrders = async () => {
    const res = await http.get('/deliverer/orders/open')
    console.log(res.data.data)
    openOrders.value = res.data.data
}
const getMyOpenOrders = async () => {
    const res = await http.get('/deliverer/orders/open/my')
    myOpenOrders.value = res.data.data
}

const getMyClosedOrders = async () => {
    const res = await http.get('/deliverer/orders/closed')
    myClosedOrders.value = res.data.data
}

const getAssignedToOrder = async (id: number) => {
    try {
        const res = await http.put(`/deliverer/orders/${id}/assign`)
        msg.success("You have been successfully assigned to an order.")
    } catch (error) {
        msg.success("Error getting you assign to this order, try again")
        console.error(error)
    }
    await refreshData()
}

const changeOrderStatus = async (id: number, status: 'picked_up' | 'delivered') => {
    try {
        const res = await http.put(`/deliverer/orders/${id}/status/${status}`)
        await getMyOpenOrders()
        msg.success("Status have been updated to " + status)
    } catch (error) {
        msg.error("Error updating status")
    }
    await refreshData()
}
</script>

<template>
    <NH1>Deliverer Dashboard</NH1>
    <NCard class="mb-16">
        <NH2>My open deliveries</NH2>
        <div>
            <div v-if="myOpenOrders.length == 0">
                <p>You have no deliveries</p>
            </div>
            <div v-else class="grid grid-cols-4 gap-4">
                <div v-for="order in myOpenOrders" :key="order.id" class="bg-gray-50 p-2 rounded flex flex-col">
                    <h3 class="text-lg font-bold">For: {{ order.client.name }}</h3>
                    <h4 class="text-gray-600">{{ !!(order.client.phone) ? order.client.phone :"No phone provided" }}</h4>
                    <h4 class="font-bold mb-2">Order items</h4>
                    <div v-for="item in order.items" class="p-1 border-t border-gray-200 text-gray-700">
                        <p>{{ item.quantity }}x {{ item.name }}</p>
                        <span class="block">{{ item.price }} Dhs</span>
                        <span class="block">From {{ item.restaurant.name }}</span>
                        <span class="block"><span class="font-bold">Address:</span> {{ item.restaurant.address }}</span>
                    </div>
                    <div v-if="order.status == 'picking_up'" class="flex gap-4 pt-4 mt-auto">
                        <NButton type="success" @click="() => changeOrderStatus(order.id, 'picked_up')">Mark as picked up</NButton>
                    </div>
                    <div v-if="order.status == 'picked_up'" class="flex gap-4 pt-4 mt-auto">
                        <NButton type="success" @click="() => changeOrderStatus(order.id, 'delivered')">Mark as delivered</NButton>
                    </div>
                </div>
            </div>
        </div>
    </NCard>


    <NCard class="mb-16">
        <NH2>Open deliveries</NH2>
        <div>
            <div v-if="openOrders.length == 0">
                <p>No open deleveries</p>
            </div>
            <div v-else class="grid grid-cols-4 gap-4">
                <div v-for="order in openOrders" :key="order.id" class="bg-gray-50 p-2 rounded flex flex-col">
                    <h3 class="text-lg font-bold">For: {{ order.client.name }}</h3>
                    <h4 class="text-gray-600">{{ !!(order.client.phone) ? order.client.phone :"No phone provided" }}</h4>
                    <h4 class="font-bold mb-2">Order items</h4>
                    <div v-for="item in order.items" class="p-1 border-t border-gray-200 text-gray-700">
                        <p>{{ item.quantity }}x {{ item.name }}</p>
                        <span class="block">{{ item.price }} Dhs</span>
                        <span class="block">From {{ item.restaurant.name }}</span>
                        <span class="block"><span class="font-bold">Address:</span> {{ item.restaurant.address }}</span>
                    </div>
                    <div class="flex gap-4 pt-4 mt-auto">
                        <NButton type="success" @click="() => getAssignedToOrder(order.id)">Pick up this order</NButton>
                    </div>
                </div>
            </div>
        </div>
    </NCard>


    <NCard>
        <NH2>My Delivered orders</NH2>
        <div>
            <div v-if="myClosedOrders.length == 0">
                <p>You have not delivered any orders yet</p>
            </div>
            <div v-else class="grid grid-cols-4 gap-4">
                <div v-for="order in myClosedOrders" :key="order.id" class="bg-gray-50 p-2 rounded flex flex-col">
                    <h3 class="text-lg font-bold">For: {{ order.client.name }}</h3>
                    <h4 class="text-gray-600">{{ !!(order.client.phone) ? order.client.phone :"No phone provided" }}</h4>
                    <h4 class="font-bold mb-2">Order items</h4>
                    <div v-for="item in order.items" class="p-1 border-t border-gray-200 text-gray-700">
                        <p>{{ item.quantity }}x {{ item.name }}</p>
                        <span class="block">{{ item.price }} Dhs</span>
                        <span class="block">From {{ item.restaurant.name }}</span>
                        <span class="block"><span class="font-bold">Address:</span> {{ item.restaurant.address }}</span>
                    </div>
                    <div class="flex gap-4 pt-4 mt-auto">
                        <NTag type="success">Delivered</NTag>
                    </div>
                </div>
            </div>
        </div>
    </NCard>
</template>