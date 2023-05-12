<script lang="ts" setup>
import { NButton, NCard, NDataTable, NForm, NFormItem, NH1, NInput, NModal, NSelect, NUpload, UploadFileInfo, useDialog, useMessage } from 'naive-ui';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { h } from 'vue';
import http from '../../services/http';
import router from '../../router';
import useMapbox from '../../composables/use-mapbox'

const dialog = useDialog()
const msg = useMessage()
const data = ref([])
const isLoading = ref(true)

const mapbox = useMapbox('restau-map', [-6.922670418309508, 33.21445055890884], (coor) => {
    console.log(coor, {map: mapbox.map})
    editableModel.value.coordinates = coor.lng + " " + coor.lat;
})

interface ModelI {
    id: number,
    name: string,
    slug: string,
    banner: File | null,
    address: string,
    phone: string,
    coordinates: string,
    city_id: number | null
}

const isLoadingModalButton = ref(false)
const modalMode = ref<"update" | "create">("update")
const showModal = ref(false)
const editableModel = ref<ModelI>({
    id: 0,
    name: "",
    slug: "",
    banner: null,
    address: "",
    phone: "",
    coordinates: "0 0",
    city_id: null
})
const resetEditableModel = () => {
    editableModel.value.id = 0
    editableModel.value.name = ""
    editableModel.value.slug = ""
    editableModel.value.banner = null
    editableModel.value.address = ""
    editableModel.value.phone = ""
    editableModel.value.coordinates = ""
    editableModel.value.city_id = null
}


onMounted(async () => {
    await refreshData()
    await loadCities()
})

const refreshData = async () => {
    try {
        isLoading.value = true
        const res = await http.get('/admin/restaurants')
        console.log(res.data.data);
        data.value = res.data.data
    } catch (error) {
        msg.error("Error loading restaurants")
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
const deleteModel = async (id: number) => {
    try {
        await http.delete("/admin/restaurants/" + id)
        msg.success("restaurant with id " + id + " has been deleted")
        await refreshData()
    } catch (error) {
        msg.error("Error deleting restaurant, try again")
    }
}

const updateModel = async (id: number) => {
    try {
        isLoadingModalButton.value = true
        const formData = new FormData()
        formData.append("id", editableModel.value.id.toString())
        formData.append("name", editableModel.value.name.toString())
        formData.append("slug", editableModel.value.slug.toString())
        formData.append("banner", editableModel.value.banner)
        formData.append("address", editableModel.value.address.toString())
        formData.append("phone", editableModel.value.phone.toString())
        formData.append("coordinates", editableModel.value.coordinates.toString())
        formData.append("cityid", editableModel.value.city_id.toString())

        await http.put('/admin/restaurants/' + id, formData)
        msg.success("restaurant updated successfuly")
        await refreshData()
        showModal.value = false
    } catch (error) {
        msg.error("Error updating restaurant")
        console.error(error)
    } finally {
        isLoadingModalButton.value = false
    }
}

const createModel = async () => {
    isLoadingModalButton.value = true
    try {
        const formData = new FormData()
        formData.append("id", editableModel.value.id.toString())
        formData.append("name", editableModel.value.name.toString())
        formData.append("slug", editableModel.value.slug.toString())
        formData.append("banner", editableModel.value.banner)
        formData.append("address", editableModel.value.address.toString())
        formData.append("phone", editableModel.value.phone.toString())
        formData.append("coordinates", editableModel.value.coordinates.toString())
        formData.append("cityid", editableModel.value.city_id.toString())
        await http.post('/admin/restaurants', formData)
        msg.success("restaurant created successfuly")
        await refreshData()
        showModal.value = false
    } catch (error) {
        msg.error("Error creating restaurant")
        console.error(error)
    } finally {
        isLoadingModalButton.value = false
    }
}


const cols = [
    {
        title: "ID",
        key: "id"
    },
    {
        title: "Image",
        key: "banner",
        render(row, index) {
            return h(
                'img',
                {src: row.banner, class: 'h-16 w-16 rounded object-cover'},
            )
        }
    },
    {
        title: "Name",
        key: "name"
    },
    {
        title: "Address",
        key: "address"
    },
    {
        title: "Actions",
        key: "actions",
        render(row, index) {
            return h(
                "div",
                {
                    class: "flex gap-4",
                },
                [
                    h(
                        NButton,
                        {
                            type: "info",
                            onClick() {
                                editableModel.value.id = row.id
                                editableModel.value.name = row.name
                                editableModel.value.slug = row.slug
                                editableModel.value.address = row.address
                                editableModel.value.phone = row.phone
                                editableModel.value.coordinates = row.coordinates
                                editableModel.value.city_id = row.city.id
                                modalMode.value = 'update'
                                showModal.value = true
                                setTimeout(() => {
                                    mapbox.initMap()
                                    let coor = row.coordinates.split(' ').map(e => Number.parseFloat(e));
                                    console.log({coor, map: mapbox.map.value})
                                    mapbox.map.value.setCenter(coor)
                                }, 200)
                            },
                        },
                        {
                            default: () => "Edit",
                        }
                    ),
                    h(
                        NButton,
                        {
                            type: "error",
                            onClick() {
                                dialog.warning({
                                    title: "Deleting restaurant",
                                    content: "Are you sure you want to delete the following restaurant : " + row.name + " ?",
                                    onPositiveClick() {
                                        deleteModel(row.id)
                                    },
                                    positiveText: "Yes"
                                })
                            },
                        },
                        {
                            default: () => "Delete",
                        }
                    ),
                    h(
                        NButton,
                        {
                            onClick() {
                                router.push({name: 'admin.restaurants.details', params: {id: row.id}})
                            },
                        },
                        {
                            default: () => "Details",
                        }
                    ),
                ]
            );
        },
    }
]
const openCreate = () => {
    resetEditableModel()
    mapbox.initMap()
    
    showModal.value = true
    setTimeout(() => {
        mapbox.map.value.setCenter([-6.922670418309508, 33.21445055890884])
        modalMode.value = 'create'
    }, 200)
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

const uploadRef = ref()
const handleFileSelection = (data: { fileList: UploadFileInfo[] }) => {
    editableModel.value.banner = data.fileList[0].file
}
</script>

<template>
    <NModal v-model:show="showModal">
        <div class="w-1/3">
            <NCard>
                <NFormItem label="Name">
                    <NInput v-model:value="editableModel.name" />
                </NFormItem>
                <NFormItem label="Slug">
                    <NInput v-model:value="editableModel.slug" />
                </NFormItem>
                <NFormItem label="Phone">
                    <NInput v-model:value="editableModel.phone" />
                </NFormItem>
                <NFormItem label="Address">
                    <NInput v-model:value="editableModel.address" />
                </NFormItem>
                <NFormItem label="City">
                    <NSelect v-model:value="editableModel.city_id" :options="citiesOption" />
                </NFormItem>
                <NFormItem label="Coordinates">
                    <NInput :value="editableModel.coordinates" />
                </NFormItem>

                <div class="p-1 rounded bg-gray-50 mb-4">
                    <div id="restau-map" class="rounded overflow-hidden" style="height: 200px;"></div>
                </div>

                <NFormItem label="Image">
                    <n-upload
                        ref="uploadRef"
                        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                        :default-upload="false"
                        @change="handleFileSelection"
                    >
                        <n-button>Select File</n-button>
                    </n-upload>
                </NFormItem>
                <div class="flex items-center justify-end">
                    <template v-if="modalMode == 'update'">
                        <NButton @click="() => updateModel(editableModel.id)" :loading="isLoadingModalButton">Update
                        </NButton>
                    </template>
                    <template v-else>
                        <NButton type="primary" @click="createModel" :loading="isLoadingModalButton">Create</NButton>
                    </template>
                </div>
            </NCard>
        </div>
    </NModal>
    <div class="flex items-center justify-between">
        <NH1>Restaurants management</NH1>
        <NButton type="info" @click="openCreate">Add restaurant</NButton>
    </div>
    <NCard>
        <NDataTable :columns="cols" :data="data" :loading="isLoading" />
    </NCard>
</template>