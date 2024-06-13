import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('./views/layout/index.vue'),
      redirect: '/dashboard', // 将dashboard设为首页home
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          // lazy loading
          component: () => import('./views/dashboard/index.vue')
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('./views/statistics/index.vue')
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('./views/order/index.vue')
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('./views/category/index.vue')
        },
        {
          path: 'category/add',
          name: 'category_add',
          component: () => import('./views/category/add.vue')
        },
        {
          path: 'category/update',
          name: 'category_update',
          component: () => import('./views/category/update.vue')
        },
        {
          path: 'dish',
          name: 'dish',
          component: () => import('./views/dish/index.vue')
        },
        {
          path: 'dish/add',
          name: 'dish_add',
          component: () => import('./views/dish/add.vue')
        },
        {
          path: 'setmeal',
          name: 'setmeal',
          component: () => import('./views/setmeal/index.vue')
        },
        {
          path: 'setmeal/add',
          name: 'setmeal_add',
          component: () => import('./views/setmeal/add.vue')
        },
        {
          path: 'employee',
          name: 'employee',
          component: () => import('./views/employee/index.vue')
        },
        {
          path: 'employee/add',
          name: 'employee_add',
          component: () => import('./views/employee/add.vue')
        },
        {
          path: 'employee/update',
          name: 'employee_update',
          component: () => import('./views/employee/update.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // lazy loading
      component: () => import('./views/login/index.vue')
    },
    {
      path: '/reg',
      name: 'reg',
      // lazy loading
      component: () => import('./views/reg/index.vue')
    }
  ]
})

export default router
