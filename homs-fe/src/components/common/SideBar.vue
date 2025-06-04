<template>
  <aside
    class="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-1 border-r border-gray-200 lg:w-[290px] -translate-x-full lg:translate-x-0">
    
    <!-- 로고 영역 -->
    <div class="py-8 flex justify-start">
      <router-link :to="logoPath" class="flex">
        <img :src="logo" width="50px" height="30px" alt="" />
        <span class="text-[20px] font-bold ml-2">HOMS</span>
      </router-link>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="mb-6">
      <h2 class="text-gray-400">MENU</h2>
      <ul class="flex flex-col gap-4 mt-5">
        <li v-for="item in menuItems" :key="item.menuId">
          <!-- 부모 메뉴 버튼 -->
          <button
            class="w-full text-start flex px-3 py-2 items-center cursor-pointer" @click="toggleMenu(item.menuId)">
            <img :src="getIconPath(item.icon)" alt="menu icon" class="w-6 h-6" />
            <span class="text-xl font-medium ml-5">{{ item.menuName }}</span>
            <font-awesome-icon :icon="['fas', item.open ? 'angle-up' : 'angle-down']" class="ml-auto w-5 h-5" />
          </button>

          <!-- 자식 메뉴 -->
          <div class="overflow-hidden transition-all duration-500 ease-in-out"
            :style="item.open ? 'max-height: 500px; opacity: 1;' : 'max-height: 0; opacity: 0;'">
            <ul v-if="item.open" class="flex flex-col gap-2 mt-3 ml-10 transition-all duration-300">
              <li v-for="child in item.children" :key="child.menuId">
                <router-link :to="child.path" class="pl-4 font-bold block hover:underline">
                  {{ child.menuName }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import logo from '@/assets/homsLogo.png'
import { useAuthStore } from '@/states/auth'
import apiClient from "@/api";

const authStore = useAuthStore()
const logoPath = computed(() => (authStore.isAdmin ? '/admin' : '/'))

const menuItems = ref([])
const deptId = ref(null);

// 메뉴 아이콘 경로
const getIconPath = (iconNumber) => {
  return new URL(`../../assets/menu/menu-icon-${iconNumber}.svg`, import.meta.url).href
}

// 메뉴 열고 닫기
const toggleMenu = (menuId) => {
  const menu = menuItems.value.find((m) => m.menuId === menuId)
  if (menu) menu.open = !menu.open
}

// 이름에 특정 키워드가 포함되어 있으면 getPath 태워야함
function adminOnly(name) {
  const adminKeywords = ['카테고리 관리', '정산 현황', '거래처 목록', '계약 관리', '통합 계정 관리'
                          , '통합 계정 관리', '메뉴 설정', '배송 현황', '배송지 관리']
  return adminKeywords.some((kw) => name === kw)
}

// 경로 계산
const getPath = (basePath) => {
  return authStore.isAdmin ? `/admin${basePath}` : basePath
}

// API 호출 (companyId 용 한번만 태움 댐)
const fetchData_deptId = async () => {
  try {
    const res = await apiClient.get(`/admin/user/${authStore.user.userId}`);

    if (res.status === 200) {
      deptId.value = res.data.data.deptId;
      console.log(res.data.data)
    }
  } catch (e) {
    console.error(e);
  }
};

// API 호출
const fetchData = async () => {
  try {

    console.log("fetchData")
    console.log(deptId.value)

    const res = await apiClient.get(`/menu/${deptId.value}`);
    if (res.status === 200) {
      const rawMenus = res.data.data;

      menuItems.value = rawMenus.map(menu => ({
        menuId: menu.menuId,
        menuName: menu.menuName,
        icon: menu.image,
        open: false,
        children: (menu.children || []).map((child) => {
          const isAdminOnly = adminOnly(child.menuName);
          return {
            ...child,
            path: isAdminOnly ? getPath(child.path) : child.path,
          };
        }),
      }));
    }
  } catch (e) {
    console.error(e);
  }

  console.log(menuItems.value)
};

onMounted(async () => {
  await fetchData_deptId();
  await fetchData();
})
</script>
