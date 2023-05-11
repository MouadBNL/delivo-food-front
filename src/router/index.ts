import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth/login',
            component: () => import("../pages/LoginPage.vue"),
            name: 'login'
        },
        {
            path: '/admin',
            component: () => import('../layouts/admin/TheAdminLayout.vue'),
            name: 'admin',
            children: [
                {
                    path: 'dashboard',
                    component: () => import('../pages/admin/DashboardPage.vue'),
                    name: "admin.dashboard"
                },
                {
                    path: 'test',
                    component: () => import('../pages/admin/DashboardPage.vue'),
                    name: "admin.test"
                }
            ]
        }
    ]
})


export default router