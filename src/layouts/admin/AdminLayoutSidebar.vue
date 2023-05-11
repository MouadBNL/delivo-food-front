<template>
    <div>
        <n-menu
            :options="getMenu(menuOptions)"
        />
    </div>
</template>

<script setup lang="ts">
import { NMenu } from 'naive-ui'
import { h, resolveComponent } from 'vue';
const menuOptions = [
    {
        label: () => h(
            resolveComponent('router-link') as any,
            {
                to: {
                    name: 'admin.dashboard'
                }
            },
            { default: () => 'Dashboard'}
        ),
        key: 'dashboard'
    },
    {
        label: () => h(
            resolveComponent('router-link') as any,
            {
                to: {
                    name: 'admin.users'
                }
            },
            { default: () => 'Users'}
        ),
        key: 'users'
    },
    {
        label: () => h(
            resolveComponent('router-link') as any,
            {
                to: {
                    name: 'admin.cities'
                }
            },
            { default: () => 'Cities'}
        ),
        key: 'cities'
    },
]
const getMenu = (menu: any[]) => {
    return menu.filter((item) => {
        return true
    })
} 
</script>