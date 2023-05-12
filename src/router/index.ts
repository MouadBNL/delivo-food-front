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
                    path: 'users',
                    component: () => import('../pages/admin//UsersPage.vue'),
                    name: "admin.users"
                },
                {
                    path: 'cities',
                    component: () => import('../pages/admin//CitiesPage.vue'),
                    name: "admin.cities"
                },
                {
                    path: 'restaurants',
                    component: () => import('../pages/admin/RestaurantsPage.vue'),
                    name: "admin.restaurants"
                },
                {
                    path: 'restaurants/:id',
                    component: () => import('../pages/admin/RestaurantsEditDetailsPage.vue'),
                    name: 'admin.restaurants.details'
                }
            ]
        }
    ]
})


export default router