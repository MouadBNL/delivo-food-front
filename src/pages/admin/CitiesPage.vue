<script lang="ts" setup>
import { NButton, NCard, NDataTable, NForm, NFormItem, NH1, NInput, NModal, NSelect, useMessage } from 'naive-ui';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { h } from 'vue';
import http from '../../services/http';

const msg = useMessage()
const data = ref([])
const isLoading  = ref(true)

interface ModelI {
    id: number,
    name: string
}

const isLoadingModalButton = ref(false)
const modalMode = ref<"update"|"create">("update")
const showModal = ref(false)
const editableModel = ref<ModelI>({
    id: 0,
    name: ""
})
const resetEditableModel = () => {
    editableModel.value.id = 0
    editableModel.value.name = ""
}


onMounted(async () => {
    await refreshData()
})

const refreshData = async () => {
    try {
        isLoading.value = true
        const res = await http.get('/admin/cities')
        console.log(res.data.data);
        data.value = res.data.data
    } catch (error) {
        msg.error("Error loading cities")
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
const deleteModel = async (id:number) => {
    try {
        await http.delete("/admin/cities/" + id)
        msg.success("City with id " + id + " has been deleted")
        await refreshData()
    } catch (error) {
        msg.error("Error deleting city, try again")
    }
}

const updateModel = async (id:number) => {
    try {
        isLoadingModalButton.value= true
        await http.put('/admin/cities/' + id, {
            id: editableModel.value.id,
            name: editableModel.value.name,
        })
        msg.success("City updated successfuly")
        await refreshData()
        showModal.value = false
    } catch (error) {
        msg.error("Error updating city")
        console.error(error)
    } finally {
        isLoadingModalButton.value =false
    }
}

const createModel = async () => {
    isLoadingModalButton.value = true
    try {
        await http.post('/admin/cities', {
            id: editableModel.value.id,
            name: editableModel.value.name,
        })
        msg.success("City created successfuly")
        await refreshData()
        showModal.value = false
    } catch (error) {
        msg.error("Error creating city")
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
        title: "Name",
        key: "name"
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
                                modalMode.value = 'update'
                                showModal.value =true
							},
						},
						{
							default: () => "Modifier",
						}
					),
					h(
						NButton,
						{
							type: "error",
							onClick() {
                                deleteModel(row.id)
							},
						},
						{
							default: () => "Delete",
						}
					)
				]
			);
		},
    }
]
const openCreate = () => {
    resetEditableModel()
    modalMode.value = 'create'
    showModal.value = true
}
</script>

<template>
    <NModal v-model:show="showModal">
        <div class="w-1/3">
            <NCard :title="modalMode == 'update' ? 'edit city id:' + editableModel.id : 'Create a new User'">
                <NFormItem label="Name">
                    <NInput v-model:value="editableModel.name" />
                </NFormItem>
                <div class="flex items-center justify-end">
                    <template v-if="modalMode == 'update'">
                        <NButton @click="() => updateModel(editableModel.id)" :loading="isLoadingModalButton">Update</NButton>
                    </template>
                    <template v-else>
                        <NButton type="primary" @click="createModel" :loading="isLoadingModalButton">Create</NButton>
                    </template>
                </div>
            </NCard>
        </div>
    </NModal>
    <div class="flex items-center justify-between">
        <NH1>Cities management</NH1>
        <NButton type="info" @click="openCreate">Add city</NButton>
    </div>
    <NCard>
        <NDataTable :columns="cols" :data="data" :loading="isLoading"/>
    </NCard>
</template>