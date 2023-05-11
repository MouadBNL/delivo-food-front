import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth/login',
            component: () => import("../pages/LoginPage.vue"),
            name: 'login'
        }
    ]
})


export default router