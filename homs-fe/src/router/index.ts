import { createRouter, createWebHistory } from 'vue-router'
import AdminDashBoard from '@/pages/dashboard/AdminDashBoard.vue'
import AdminAccount from '@/pages/account/AdminAccount.vue'
import BaseLayout from '@/components/common/BaseLayout.vue'
import Orders from '@/pages/order/Order.vue'
import Setting from '@/pages/etc/Setting.vue'
import Claims from '@/pages/order/Claim.vue'
import Products from '@/pages/product/Products.vue'
import Categories from '@/pages/etc/Categories.vue'
import Settlements from '@/pages/settlement/settlements.vue'
import Notices from '@/pages/notice/Notices.vue'
import Clients from '@/pages/clients/Clients.vue'
import Contracts from '@/pages/clients/Contracts.vue'
import MenuSettings from '@/pages/account/MenuSettings.vue'
import Login from '@/pages/login/Login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: 'login'
    // },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      name: 'BaseLayout',
      component: BaseLayout,
      children: [
        {
          path: '/',
          name: 'adminDash',
          component: AdminDashBoard,
        },
        {
          path:'/AdminAccounts',
          name:'AdminAccounts',
          component: AdminAccount,
        },
        {
          path:'/orders',
          name: 'Orders',
          component: Orders,
        },
        {
          path:'/setting',
          name: 'Setting',
          component: Setting,
        },
        {
          path:'/claims',
          name: 'Claims',
          component: Claims,
        },
        {
          path:'/products',
          name: 'Products',
          component: Products,
        },
        {
          path:'/categories',
          name: 'Categories',
          component: Categories,
        },
        {
          path:'/settlements',
          name: 'Settlements',
          component: Settlements,
        },
        {
          path:'/notices',
          name: 'Notices',
          component: Notices,
        },
        {
          path:'/clients',
          name: 'Clients',
          component: Clients,
        },
        {
          path:'/contracts',
          name: 'Contracts',
          component: Contracts,
        },
        {
          path:'/menuSettings',
          name: 'MenuSettings',
          component: MenuSettings,
        },
      ]
    }
  ],
})

export default router
