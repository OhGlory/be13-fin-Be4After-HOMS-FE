<template>
    <header>
      <div class="flex justify-end items-center h-20 px-6 border-b-1 border-gray-200">
        <div class="flex gap-x-2 mr-5">
          <RouterLink to="Setting" class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-70">
            {{ t('setting') }}
          </RouterLink>
          <button @click="toggleDropdown" class="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-70">
            알림
            <span class="absolute flex size-3 ml-8 mb-8">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          </button>

          <!-- 알림 드롭 박스  -->
            <div v-if="isOpen" class="absolute z-10 mt-16 right-55 w-64 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg">
              <div class="py-2 px-4 text-sm text-gray-700">
                <div v-if="notifications.length === 0">
                  새로운 알림이 없습니다.
                </div>
                <ul v-else>
                  <li v-for="(notification, index) in notifications" :key="index" class="py-2 border-b border-gray-100 last:border-0">
                    {{ notification }}
                  </li>
                </ul>
              </div>
            </div>
        </div>
  
        <div class="flex items-center space-x-4">
          <span class="overflow-hidden rounded-full h-11 w-11">
            <img :src="logoImg" alt="logo" class="object-cover w-full h-full" />
          </span>
          <div>영광상사</div>
          <div class="cursor-pointer hover:underline" @click="Logout">Logout</div>
        </div>
      </div>
    </header>
  </template>
  
<script setup>
import logoImg from '@/assets/homsLogo.png'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';

const { t } = useI18n()
const LoginStatus = ref('Login')
const isOpen = ref(false)
const router = useRouter();

  
// 로그 아웃 기능 구현
function Logout(){
  router.push('/login');

}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// 추후에 DB에서 받을 예정
const notifications = ref([
  '새 주문이 도착했습니다.',
  '결제 대기 중인 주문이 있습니다.',
  '상품 문의가 등록되었습니다.',
])

</script>
  