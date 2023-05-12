import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import("../pages/IndexPage.vue"),
            name: 'index'
        },
        {
            path: '/search',
            component: () => import("../pages/SearchPage.vue"),
            name: 'search'
        },
        {
            path: '/orders',
            component: () => import("../pages/MyOrdersPage.vue"),
            name: 'orders'
        },
        {
            path: '/restaurants/:slug',
            component: () => import("../pages/RestaurantSinglePage.vue"),
            name: 'restaurants.show'
        },
        {
            path: '/auth/login',
            component: () => import("../pages/LoginPage.vue"),
            name: 'login'
        },
        {
            path: '/auth/register',
            component: () => import("../pages/RegisterPage.vue"),
            name: 'register'
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
        },
        {
            path: '/deliverer',
            component: () => import('../layouts/deliverer/TheDelivererLayout.vue'),
            children: [
                {
                    path: 'dashboard',
                    component: () => import('../pages/deliverer/DashboardPage.vue'),
                    name: 'deliverer.dashboard'
                }
            ]
        }
    ]
})


export default router