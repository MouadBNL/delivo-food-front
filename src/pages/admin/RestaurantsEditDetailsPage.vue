<script lang="ts" setup>
import { NButton, NCard, NForm, NFormItem, NH1, NH2, NInput, NInputNumber, NModal, NUpload, UploadFileInfo, useDialog, useMessage } from 'naive-ui';
import { useAuthStore } from '../../stores/use-auth-store';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import http from '../../services/http';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const authStore = useAuthStore()
const dialog = useDialog()
const route = useRoute()
const msg = useMessage()

interface RestaurantI {
    id: number,
    name: string,
    slug: string,
    banner: string,
    address: string,
    phone: string,
    coordinates: string,
    city:{
        id: number,

    },
}

interface MenuI {
    id: number,
    name: string,
	items: {
        id: number,
        name: string,
        description: string,
        price: number,
        estimated_time: number,
        image:string
    }[],
			
}

const isLoading = ref(true)
const restaurant = ref<RestaurantI>()
const menuItems = ref<MenuI[]>([])

const menuModalConfig = reactive({
    show: false,
    mode: "",
    title: "",
    item: {
        id: 0,
        name: ""
    },
    openCreate: () => {
        menuModalConfig.mode = "create"
        menuModalConfig.title = "Create a new Menu"
        menuModalConfig.item.name = ""
        menuModalConfig.show = true
    },
    openUpdate: (idx: number) => {
        menuModalConfig.mode = "update"
        menuModalConfig.title = "Update  menu"
        menuModalConfig.item.name = menuItems.value[idx].name
        menuModalConfig.item.id = menuItems.value[idx].id
        menuModalConfig.show = true
    },
    onUpdate: async () => {
        try {
            const res = await http.put("/admin/menus/" + menuModalConfig.item.id, {
                id: menuModalConfig.item.id,
                name: menuModalConfig.item.name
            })
            msg.success("Menu updated successfuly")
            await getRestaurantMenu()
            menuModalConfig.close()
        } catch (error) {
            msg.error("Error updating menu, try again")
        }
    },
    onCreate: async () => {
        try {
            const res = await http.post("/admin/menus", {
                RestaurantId: restaurant.value.id,
                name: menuModalConfig.item.name
            })
            if(! res.data.success ) throw new Error()
            msg.success("Menu added successfuly")
            await getRestaurantMenu()
            menuModalConfig.close()
        } catch (error) {
            msg.error("Error creating menu, try again")
        }
    },
    close: () => {
        menuModalConfig.mode = ""
        menuModalConfig.title = ""
        menuModalConfig.item = {
            id: 0,
            name: ""
        }
        menuModalConfig.show = false
    }
})
const deleteMenu = async (menuId: number) => {
    dialog.warning({
        title: "Deleting a menu",
        content: "Are you sure you want to delete this menu ? this will delete all its items in the process.",
        positiveText: "Yes",
        negativeText: "No",
        onPositiveClick: async() => {
            try {
                await http.delete("/admin/menus/" + menuId)
                msg.success("Menu deleted successfuly")
                await getRestaurantMenu()
            } catch (error) {
                msg.error("Error deleting menu, try again.")
            }
        }
    })
}

const itemModalConfig = reactive({
    show: false,
    mode: "",
    title: "",
    item: {
        id: 0,
        name: "",
        description: "",
        price: 0,
        estimatedtime: 0,
        image: null as File,
        menuid: 0,
    },
    openCreate: (menuIdx: number) => {
        itemModalConfig.mode = "create"
        itemModalConfig.title = "Create a new Menu Item"
        itemModalConfig.item.name = ""
        itemModalConfig.item.menuid = menuItems.value[menuIdx].id
        itemModalConfig.show = true
    },
    openUpdate: (menuIdx: number, itemIdx: number) => {
        itemModalConfig.mode = "update"
        itemModalConfig.title = "Update an item"
        itemModalConfig.item.menuid = menuItems.value[menuIdx].id
        itemModalConfig.item.id = menuItems.value[menuIdx].items[itemIdx].id
        itemModalConfig.item.name = menuItems.value[menuIdx].items[itemIdx].name
        itemModalConfig.item.description = menuItems.value[menuIdx].items[itemIdx].description
        itemModalConfig.item.price = menuItems.value[menuIdx].items[itemIdx].price
        itemModalConfig.item.estimatedtime = menuItems.value[menuIdx].items[itemIdx].estimated_time
        // itemModalConfig.item.image = menuItems.value[menuIdx].items[itemIdx].image
        itemModalConfig.show = true
    },
    onUpdate: async () => {
        try {
            const formData = new FormData()
            formData.append("menuid", itemModalConfig.item.menuid.toString())
            formData.append("id", itemModalConfig.item.id.toString())
            formData.append("name", itemModalConfig.item.name.toString())
            formData.append("description", itemModalConfig.item.description.toString())
            formData.append("price", itemModalConfig.item.price.toString())
            formData.append("estimatedtime", itemModalConfig.item.estimatedtime.toString())
            if(itemModalConfig.item.image) {
                formData.append("image", itemModalConfig.item.image)
            }
            const res = await http.put("/admin/menu-items/" + itemModalConfig.item.id, formData)
            msg.success("Menu item updated successfuly")
            await getRestaurantMenu()
            itemModalConfig.close()
        } catch (error) {
            msg.error("Error updating menu, try again")
        }
    },
    onCreate: async () => {
        try {
            const formData = new FormData()
            formData.append("menuid", itemModalConfig.item.menuid.toString())
            formData.append("name", itemModalConfig.item.name.toString())
            formData.append("description", itemModalConfig.item.description.toString())
            formData.append("price", itemModalConfig.item.price.toString())
            formData.append("estimatedtime", itemModalConfig.item.estimatedtime.toString())
            formData.append("image", itemModalConfig.item.image)
            const res = await http.post("/admin/menu-items", formData)
            if(! res.data.success ) throw new Error()
            msg.success("Menu item added successfuly")
            await getRestaurantMenu()
            itemModalConfig.close()
        } catch (error) {
            msg.error("Error creating menu, try again")
        }
    },
    close: () => {
        itemModalConfig.mode = ""
        itemModalConfig.title = ""
        itemModalConfig.item = {
            id: 0,
            name: "",
            description: "",
            price: 0,
            estimatedtime: 0,
            image: null,
            menuid: 0
        }
        itemModalConfig.show = false
    },
    selectedFile: (data: { fileList: UploadFileInfo[] }) => {
        itemModalConfig.item.image = data.fileList[0].file
    }
})

const deleteMenuItem = async (menuItemId: number) => {
    dialog.warning({
        title: "Deleting a menu item",
        content: "Are you sure you want to delete this Item?",
        positiveText: "Yes",
        negativeText: "No",
        onPositiveClick: async() => {
            try {
                await http.delete("/admin/menu-items/" + menuItemId)
                msg.success("Menu deleted successfuly")
                await getRestaurantMenu()
            } catch (error) {
                msg.error("Error deleting menu item, try again.")
            }
        }
    })
}


const getRestaurant = async () => {
    try {
        const res = await http.get(`/admin/restaurants/${route.params.id}`)
        if(! res.data.success) throw new Error()
        restaurant.value = res.data.data
    } catch (err) {
        msg.error("Error loading restaurant")
        console.error(err)
    }
}
const getRestaurantMenu = async () => {
    try {
        const res = await http.get(`/admin/restaurants/${route.params.id}/menus`)
        if(! res.data.success) throw new Error()
        menuItems.value = res.data.data

    } catch (error) {
        msg.error("Error loading menus")
        console.error(error);
    }
}
onMounted(async () => {
    await getRestaurant()
    await getRestaurantMenu()
    isLoading.value = false
})
</script>

<template>
    <NModal v-model:show="menuModalConfig.show" @after-leave="menuModalConfig.close">
        <div class="w-1/3">
            <NCard :title="menuModalConfig.title">
                <NFormItem label="Name"> 
                    <NInput placeholder="name" v-model:value="menuModalConfig.item.name" />
                </NFormItem>
                <div class="flex justify-end">
                    <NButton v-if="menuModalConfig.mode == 'create'" @click="menuModalConfig.onCreate" type="info">Create</NButton>
                    <NButton v-if="menuModalConfig.mode == 'update'" @click="menuModalConfig.onUpdate" type="primary">Update</NButton>
                </div>
            </NCard>
        </div>
    </NModal>

    
    <NModal v-model:show="itemModalConfig.show" @after-leave="itemModalConfig.close">
        <div class="w-1/3">
            <NCard :title="itemModalConfig.title">
                <NFormItem label="Name"> 
                    <NInput placeholder="name" v-model:value="itemModalConfig.item.name" />
                </NFormItem>
                <NFormItem label="Description"> 
                    <NInput placeholder="description" type="textarea" v-model:value="itemModalConfig.item.description" />
                </NFormItem>
                <NFormItem label="Price"> 
                    <NInputNumber class="w-full" placeholder="Price" v-model:value="itemModalConfig.item.price" />
                </NFormItem>
                <NFormItem label="Estimated time"> 
                    <NInputNumber class="w-full" placeholder="estimated time" v-model:value="itemModalConfig.item.estimatedtime" />
                </NFormItem>
                <NFormItem label="Image"> 
                    <NUpload
                        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                        :default-upload="false"
                        @change="itemModalConfig.selectedFile"
                    >
                        <n-button>Select File</n-button>
                    </NUpload>
                </NFormItem>
                <div class="flex justify-end">
                    <NButton v-if="itemModalConfig.mode == 'create'" @click="itemModalConfig.onCreate" type="info">Create</NButton>
                    <NButton v-if="itemModalConfig.mode == 'update'" @click="itemModalConfig.onUpdate" type="primary">Update</NButton>
                </div>
            </NCard>
        </div>
    </NModal>


    <template v-if="isLoading">
        loading...
    </template>
    <template v-else>
        <div class="w-full mb-8 h-36 rounded-2xl shadow-lg bg-black relative flex items-center p-16">
            <img :src="restaurant.banner" class="block w-full  h-36 rounded-3xl object-cover opacity-50 absolute inset-0"/>
            <h1 class="text-white text-3xl font-medium z-50">Restaurant: {{ restaurant.name }}</h1>
        </div>
        <NCard title="Menus">
            <div class="grid grid-cols-1 gap-y-16">
                <div v-for="(menu, mIdx) in menuItems" :key="menu.id">
                    <div class="flex justify-between  gap-4">
                        <NH2>#{{ menu.id }} : {{ menu.name }}</NH2>
                        <div class="flex gap-4">
                            <NButton type="primary" @click="() => menuModalConfig.openUpdate(mIdx)">Edit</NButton>
                            <NButton type="error" @click="() => deleteMenu(menu.id)">Delete</NButton>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="(item,iIdx) in menu.items" :key="item.id" class="p-4 rounded shadow border-gray-300 bg-gray-50 relative">
                            <div class="flex gap-4">
                                <img :src="item.image"  class="block object-cover flex-grow-0 flex-shrink-0 h-16 w-16 rounded shadow"/>
                                <div>
                                    <h4 class="text-lg">{{ item.name }}</h4>
                                    <p>Price: {{ item.price }}Dhs</p>
                                    <p>Estimated time: {{ item.estimated_time }}min</p>
                                </div>
                            </div>
                            <div class="absolute top-0 right-0 p-4 flex items-center gap-4">
                                <NButton size="tiny" type="primary" @click="() => itemModalConfig.openUpdate(mIdx, iIdx)">Edit</NButton>
                                <NButton size="tiny" type="error" @click="() => deleteMenuItem(item.id)">Delete</NButton>
                            </div>
                        </div>
                        
                        <div @click="() => itemModalConfig.openCreate(mIdx)" class="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 cursor-pointer">
                            <p class="text-xl font-bold text-center text-gray-500">Add a new Item</p>
                        </div>
                    </div>
                </div>

                <div @click="menuModalConfig.openCreate" class="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 cursor-pointer">
                    <p class="text-xl font-bold text-center text-gray-500">Add a new Menu</p>
                </div>
            </div>
        </NCard>
    </template>
</template>