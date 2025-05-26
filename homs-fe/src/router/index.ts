import {createRouter, createWebHistory, type RouteRecordRaw} from "vue-router";
import {userStore} from "@/states/user"; // 유저 스토어
import {storeToRefs} from "pinia";

import AdminDashBoard from "@/pages/admin/dashboard/AdminDashBoard.vue";
import AdminAccount from "@/pages/admin/account/AdminAccount.vue";
import BaseLayout from "@/components/common/BaseLayout.vue";
import Setting from "@/pages/common/Setting.vue";
import Claims from "@/pages/admin/order/Claim.vue";
import ProductForm from "@/pages/admin/product/ProductForm.vue";
import Categories from "@/pages/admin/product/Categories.vue";
import Clients from "@/pages/admin/clients/Clients.vue";
import Contracts from "@/pages/admin/clients/Contracts.vue";
import MenuSettings from "@/pages/admin/menu/MenuSettings.vue";
import Login from "@/pages/common/login/Login.vue";
import AdminSettlements from "@/pages/admin/settlement/Settlements.vue";

// 유저 관련
import UserDashBoard from "@/pages/user/dashboard/UserDashBoard.vue";
import Accounts from "@/pages/user/account/Account.vue";
import Products from "@/pages/user/product/Products.vue";
import Orders from "@/pages/user/order/Order.vue";
import OrderItemList from "@/pages/user/order/OrderItemList.vue";
import Deliverys from "@/pages/user/delivery/Delivery.vue";
import Settlements from "@/pages/user/settlement/Settlements.vue";
import Notices from "@/pages/user/notice/Notices.vue";
import NoticesDetail from "@/pages/user/notice/NoticesDetail.vue";
import AdminNoticesForm from "@/pages/admin/notice/NoticesForm.vue";

// 에러 관련
import PageNotFound from "@/pages/common/PageNotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: 'login'
    // },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/admin",
      name: "AdminLayout",
      component: BaseLayout,
      // meta: { requiresAuth: true, role: 'admin' },       // 대시보드 진입을 위한 주석
      children: [
        {
          path: "",
          name: "AdminDashBoard",
          component: AdminDashBoard,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "adminaccount",
          name: "AdminAccount",
          component: AdminAccount,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "settlements",
          name: "AdminSettlement",
          component: AdminSettlements,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "claims",
          name: "AdminClaims",
          component: Claims,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "menu-settings",
          name: "MenuSettings",
          component: MenuSettings,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "clients",
          name: "Clients",
          component: Clients,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "contracts",
          name: "Contracts",
          component: Contracts,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "categories",
          name: "Categories",
          component: Categories,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "notices/form",
          name: "AdminNoticesFrom",
          component: AdminNoticesForm,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "products/form",
          name: "ProductForm",
          component: ProductForm,
          meta: {requiresAuth: true, role: "admin"},
        },
        {
          path: "setting",
          name: "AdminSetting",
          component: Setting,
          meta: {requiresAuth: true, role: "admin"},
        },
      ],
    },
    {
      path: "/",
      name: "UserLayout",
      component: BaseLayout,
      // meta: { requiresAuth: true, role: 'user' },
      children: [
        {
          path: "",
          name: "UserDashBoard",
          component: UserDashBoard,
          // meta: { requiresAuth: true, role: 'user' },        // 대시보드 진입을 위한 주석
        },
        {
          path: "accounts",
          name: "Accounts",
          component: Accounts,
          meta: {requiresAuth: true, role: "user"},
        },
        {
          path: "products",
          name: "UserProducts",
          component: Products,
          // meta: {requiresAuth: true, role: "user"},
        },
        {
          path: "orders",
          name: "UserOrders",
          component: Orders,
          meta: {requiresAuth: true, role: "user"},
        },
        {
          path: "orders/list",
          name: "OrderItemList",
          component: OrderItemList,
          meta: {requiresAuth: true, role: "user"},
        },
        {
          path: "delivery",
          name: "Delivery",
          component: Deliverys,
          meta: {requiresAuth: true, role: "user"},
        },
        {
          path: "settlements",
          name: "UserSettlements",
          component: Settlements,
          meta: {requiresAuth: true, role: "user"},
        },
        {
          path: "notices",
          name: "UserNotices",
          component: Notices,
        },
        {
          path: "notices/:id",
          name: "UserNoticesDetail",
          component: NoticesDetail,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)",
      redirect: "/404",
    },
    {
      path: "/404",
      component: PageNotFound,
    },
  ],
});

// 로그인 상태 관리 (권한)
router.beforeEach((to, from, next) => {
  const userAuth = userStore();
  const {role} = storeToRefs(userAuth);

  const requiresAuth = to.meta.requiresAuth;
  const allowedRole = to.meta.role as "admin" | "user" | undefined;

  // 인증
  // if (requiresAuth) {
  //   if (!role.value) {
  //     // 인증 정보 없음
  //     return next({ path: '/login' })
  //   }

  //   if (allowedRole && role.value !== allowedRole) {
  //     // 권한 없음
  //     return next({ path: '/login' })
  //   }
  // }

  // 나중에 권한에 따라 페이지 리다이렉트 하는 코드임
  // if (to.path === '/') {
  //   if (role.value === 'admin') {
  //     return next({ path: '/admin' })
  //   } else if (role.value === 'user') {
  //     return next({ path: '/' })
  //   }
  // }
  return next();
});

export default router;
