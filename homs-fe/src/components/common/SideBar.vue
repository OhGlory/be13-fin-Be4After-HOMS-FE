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
        <li v-for="(item, index) in menuItems" :key="index">
          <button class="w-full text-start flex px-3 py-2 items-center cursor-pointer" @click="toggleMenu(index)">
            <img :src="getIconPath(item.icon)" alt="menu icon" class="w-6 h-6" />
            <span class="text-xl font-medium ml-5">{{ item.title }}</span>
            <font-awesome-icon :icon="['fas', item.open ? 'angle-up' : 'angle-down']" class="ml-auto w-5 h-5" />
          </button>
          <div class="overflow-hidden transition-all duration-500 ease-in-out"
            :style="item.open ? 'max-height: 500px; opacity: 1;' : 'max-height: 0; opacity: 0;'">
            <ul v-if="item.open" class="flex flex-col gap-2 mt-3 ml-10 transition-all duration-300">
              <li v-for="(child, childIndex) in item.children" :key="childIndex">
                <router-link :to="child.path" class="pl-4 font-bold block hover:underline">
                  {{ child.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>



<script setup lang="ts">
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { userStore } from '@/states/user'
import logo from '@/assets/homsLogo.png'
import { useAuthStore } from '@/states/auth'

// 메뉴 아이템 타입 정의
interface MenuChild {
  name: string
  path: string
  adminOnly?: boolean
}

interface MenuItem {
  title: string
  icon: number
  open: boolean
  children: MenuChild[]
}


  // 이건 나중에 로그인 정보 권한에 따라 판별할 수 있도록 변경
  // const userAuth = userStore()
  // const isAdmin = computed(() => userAuth.isAdmin)

  const authStore = useAuthStore();
  const role = computed(() => authStore.user?.role)
  const isAdmin = computed(() => role.value === 'ROLE_ADMIN')

  console.log("role++++", role)



const getPath = (basePath: string, adminOnly?: boolean): string => {
  if (isAdmin.value) {
    return `/admin${basePath}`
  } else {
    return basePath // 일반 유저는 그대로 사용
  }
}

const logoPath = computed(() => {
  return isAdmin.value ? '/admin' : '/';
});

// 메뉴 관련 메뉴DB에서 받올 예정
const menuItems = ref<MenuItem[]>([
  {
    title: '주문 관리',
    icon: 1,
    open: false,
    children: [
      { name: '주문 목록', path: '/orders' },                           // 관리자O, 사용자O
      { name: '클레임 목록', path: getPath('/claims'), adminOnly: true },          // 관리자O, 사용자 X
    ],
  },
  {
    title: '상품 관리',
    icon: 2,
    open: false,
    children: [
      { name: '상품 목록', path: '/products' },          // 관리자O, 사용자O  
      { name: '카테고리 관리', path: getPath('/categories'), adminOnly: true },     // 관리자O, 사용자 X
    ],
  },
  {
    title: '정산 관리',
    icon: 3,
    open: false,
    children: [{ name: '정산 현황', path: getPath('/settlements'), adminOnly: true }], // 관리자O, 사용자O
  },
  {
    title: '공지사항',
    icon: 4,
    open: false,
    children: [{ name: '공지 사항', path: '/notices' }],    // 관리자O, 사용자O
  },
  {
    title: '거래처 관리',
    icon: 5,
    open: false,
    children: [
      { name: '거래처 목록', path: getPath('/clients'), adminOnly: true },             // 관리자O, 사용자 X
      { name: '계약 관리', path: getPath('/contracts'), adminOnly: true },          // 관리자O, 사용자 X
    ],
  },
  {
    title: '계정 관리',
    icon: 6,
    open: false,
    children: [
      { name: '통합 계정 관리', path: getPath('/adminaccount'), adminOnly: true },     // 관리자O, 사용자 X
      { name: '메뉴 설정', path: getPath('/menu-settings'), adminOnly: true },       // 관리자O, 사용자 X
    ],
  }
])

const toggleMenu = (index: number): void => {
  menuItems.value[index].open = !menuItems.value[index].open
}

const getIconPath = (iconNumber: number): string => {
  return new URL(`../../assets/menu/menu-icon-${iconNumber}.svg`, import.meta.url).href
}
</script>
