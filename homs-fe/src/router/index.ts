import {createRouter, createWebHistory} from "vue-router";
import AdminDashBoard from "@/pages/admin/dashboard/AdminDashBoard.vue";
import AdminAccount from "@/pages/admin/account/AdminAccount.vue";
import BaseLayout from "@/components/common/BaseLayout.vue";
import AdminOrders from "@/pages/admin/order/Order.vue";
import Setting from "@/pages/common/Setting.vue";
import Claims from "@/pages/admin/order/Claim.vue";
import AdminProducts from "@/pages/admin/product/Products.vue";
import Categories from "@/pages/admin/product/Categories.vue";
import AdminSettlements from "@/pages/admin/settlement/settlements.vue";
import AdminNotices from "@/pages/admin/notice/Notices.vue";
import Clients from "@/pages/admin/clients/Clients.vue";
import Contracts from "@/pages/admin/clients/Contracts.vue";
import MenuSettings from "@/pages/admin/menu/MenuSettings.vue";
import Login from "@/pages/common/login/Login.vue";

// 유저 관련
import UserDashBoard from "@/pages/user/dashboard/UserDashBoard.vue";
import Accounts from "@/pages/user/account/Account.vue";
import Products from "@/pages/user/product/Products.vue";
import Orders from "@/pages/user/order/Order.vue";
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
      children: [
        {
          path: "",
          name: "AdminDashBoard",
          component: AdminDashBoard,
        },
        {
          path: "adminaccount",
          name: "AdminAccount",
          component: AdminAccount,
        },
        {
          path: "orders",
          name: "AdminOrders",
          component: AdminOrders,
        },
        {
          path: "claims",
          name: "AdminClaims",
          component: Claims,
        },
        {
          path: "menu-settings",
          name: "MenuSettings",
          component: MenuSettings,
        },
        {
          path: "clients",
          name: "Clients",
          component: Clients,
        },
        {
          path: "contracts",
          name: "Contracts",
          component: Contracts,
        },
        {
          path: "products",
          name: "AdminProducts",
          component: AdminProducts,
        },
        {
          path: "categories",
          name: "Categories",
          component: Categories,
        },
        {
          path: "settlements",
          name: "AdminSettlements",
          component: AdminSettlements,
        },
        {
          path: "notices",
          name: "AdminNotices",
          component: AdminNotices,
        },
        {
          path: "notices/form",
          name: "AdminNoticesFrom",
          component: AdminNoticesForm,
        },
        {
          path: "setting",
          name: "AdminSetting",
          component: Setting,
        },
      ],
    },
    {
      path: "/",
      name: "UserLayout",
      component: BaseLayout,
      children: [
        {
          path: "",
          name: "UserDashBoard",
          component: UserDashBoard,
        },
        {
          path: "accounts",
          name: "Accounts",
          component: Accounts,
        },
        {
          path: "products",
          name: "UserProducts",
          component: Products,
        },
        {
          path: "orders",
          name: "UserOrders",
          component: Orders,
        },
        {
          path: "delivery",
          name: "Delivery",
          component: Deliverys,
        },
        {
          path: "settlements",
          name: "UserSettlements",
          component: Settlements,
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

export default router;
