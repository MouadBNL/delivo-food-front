<script lang="ts" setup>
import { NButton, NCard, NDataTable, NForm, NFormItem, NH1, NInput, NModal, NSelect, useMessage } from 'naive-ui';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { h } from 'vue';
import http from '../../services/http';

const msg = useMessage()
const data = ref([])
const isLoading  = ref(true)

const showEditModel = ref(false)
const editableUser = ref({
    id: 0,
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
})

const modalMode = ref<"update"|"create">("update")

const isLoadingUpdateUser = ref(false)


onMounted(async () => {
    await refreshUsers()
})

const refreshUsers = async () => {
    try {
        isLoading.value = true
        const res = await http.get('/admin/users')
        console.log(res.data.data);
        data.value = res.data.data
    } catch (error) {
        msg.error("Error loading users")
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
const deleteUser = async (id:number) => {
    try {
        await http.delete("/admin/users/" + id)
        msg.success("user with id " + id + " has been deleted")
        await refreshUsers()
    } catch (error) {
        msg.error("Error deleting user, try again")
    }
}

const updateUser = async (id:number) => {
    try {
        isLoadingUpdateUser.value= true
        await http.put('/admin/users/' + id, {
            id: editableUser.value.id,
            name: editableUser.value.name,
            email: editableUser.value.email,
            role: editableUser.value.role,
            phone: editableUser.value.phone,
            password: editableUser.value.password,
        })
        msg.success("User updated successfuly")
        await refreshUsers()
        showEditModel.value = false
    } catch (error) {
        msg.error("Error updating user")
        console.error(error)
    } finally {
        isLoadingUpdateUser.value =false
    }
}

const createUser = async () => {
    isLoadingUpdateUser.value = true
    try {
        await http.post('/admin/users', {
            id: editableUser.value.id,
            name: editableUser.value.name,
            email: editableUser.value.email,
            role: editableUser.value.role,
            phone: editableUser.value.phone,
            password: editableUser.value.password,
        })
        msg.success("User created successfuly")
        await refreshUsers()
        showEditModel.value = false
    } catch (error) {
        msg.error("Error creating user")
        console.error(error)
    } finally {
        isLoadingUpdateUser.value = false
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
        title: "Email",
        key: "email"
    },
    {
        title: "Role",
        key: "role",
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
                                editableUser.value.id = row.id
                                editableUser.value.name = row.name
                                editableUser.value.email = row.email
                                editableUser.value.phone = row.phone
                                editableUser.value.role = row.role
                                modalMode.value = "update"
                                showEditModel.value =true
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
                                deleteUser(row.id)
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

const rolesOption = [
    {
        label: "Admin",
        value: "admin"
    },
    {
        label: "Delivrer",
        value: "delivrer"
    },
    {
        label: "User",
        value: "user"
    },
]

const openCreate = () => {
    editableUser.value.id = 0
    editableUser.value.name = ""
    editableUser.value.email = ""
    editableUser.value.password = ""
    editableUser.value.role = ""
    editableUser.value.phone = ""
    modalMode.value = 'create'
    showEditModel.value = true
}
</script>

<template>
    <NModal v-model:show="showEditModel">
        <div class="w-1/3">
            <NCard :title="modalMode == 'update' ? 'edit user id:' + editableUser.id : 'Create a new User'">
                <NFormItem label="Name">
                    <NInput v-model:value="editableUser.name" />
                </NFormItem>
                <NFormItem label="Email">
                    <NInput v-model:value="editableUser.email" />
                </NFormItem>
                <NFormItem label="Role">
                    <NSelect v-model:value="editableUser.role" :options="rolesOption" />
                </NFormItem>
                    <NFormItem label="Password (leave empty if you dont want to update)">
                        <NInput v-model:value="editableUser.password" />
                    </NFormItem>
                <NFormItem label="Phone">
                    <NInput v-model:value="editableUser.phone" />
                </NFormItem>
                <div class="flex items-center justify-end">
                    <template v-if="modalMode == 'update'">
                        <NButton @click="() => updateUser(editableUser.id)" :loading="isLoadingUpdateUser">Update</NButton>
                    </template>
                    <template v-else>
                        <NButton type="primary" @click="createUser" :loading="isLoadingUpdateUser">Create</NButton>
                    </template>
                </div>
            </NCard>
        </div>
    </NModal>
    <div class="flex items-center justify-between">
        <NH1>Users management</NH1>
        <NButton type="info" @click="openCreate">Add user</NButton>
    </div>
    <NCard>
        <NDataTable :columns="cols" :data="data" :loading="isLoading"/>
    </NCard>
</template>