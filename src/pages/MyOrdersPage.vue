<script lang="ts" setup>
import { NH1, NTag, useMessage } from 'naive-ui';
import NavHeader from '../components/NavHeader.vue';
import http from '../services/http';
import { ref } from 'vue';
import { onMounted } from 'vue';

const msg = useMessage()
const orders = ref<{
    id : number,
    deliverer_name? : string,
    deliveryPrice : string,
    status : string,
    status_properties:{
        label: string,
        type: "default" | "warning" | "info" | "success"
    }
    items : {
        id : number,
        name : string,
        quantity : number,
        price : number,
        image: string
    }[]
}[]>([])
const getOrders = async () => {
    try {
        const res = await http.get('/orders/my-orders')
        orders.value = res.data.map(e => {
            e.status_properties = {
                label: formatStatus(e.status).label,
                type: formatStatus(e.status).type
            }
            return e;
        })
    } catch (error) {
        msg.error("Error loading orders")
    }
}

onMounted(async () => {
    await getOrders()
})

const formatStatus = (status: string) => {
    if(status == "ordered"){
        return {
            label: "Your order have been placed",
            type: "default"
        }
    }
    if(status == "picking_up"){
        return {
            label: "Your deliverer is picking up your order",
            type: "warning"
        }
    }
    if(status == "picked_up"){
        return {
            label: "Your deliverer have picked up your order",
            type: "info"
        }
    }
    if(status == "delivered"){
        return {
            label: "You order have been delivered",
            type: "success"
        }
    }
}
</script>

<template>
    <NavHeader/>
    <main class="bg-gray-50 py-16 min-h-screen">
        <section class="container mx-auto bg-white rounded-lg shadow p-8">
            <NH1>My Orders</NH1>
            <div v-if="orders.length == 0">
                <p>No orders yet</p>
            </div>
            <div class="grid grid-cols-1 gap-y-8">
                <div v-for="order in orders" :key="order.id" class="p-2 bg-gray-50 rounded shadow">
                    <div class="flex items-center gap-4 mb-4">
                        <span>Order id: #{{ order.id }}</span>
                        <NTag :type="order.status_properties.type"><span class="font-bold">Status:</span> {{ order.status_properties.label }}</NTag>
                        <span>{{ order.items.reduce((total, e) => (total + e.price * e.quantity), 0) }} Dhs</span>
                        <span><span class="font-bold">Deliverer:</span> {{ order.deliverer_name ?? "Unknown" }}</span>
                    </div>
                    <div class="grid grid-cols-4 gap-4">
                        <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4 shadow p-2 rounded">
                            <img :src="item.image" class="h-16 w-16 block object-cover rounded shadow"/>
                            <div>
                                <p class="text-lg font-medium">{{ item.name }}</p>
                                <p>{{ item.quantity }}x {{ item.price }} Dhs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

</template>