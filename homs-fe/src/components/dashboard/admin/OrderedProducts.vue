<template>
    <div class="w-full max-w-md p-4 bg-white border border-gray-300 rounded-3xl shadow-lg sm:p-8">
        <!-- 카드 헤더 -->
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                상위 주문 상품
            </h5>
            <a href="#" class="text-sm font-medium hover:underline ">
                +
            </a>
        </div>
        <!-- 카드 내용 부분 -->
        <div class="flow-root">
            <ul role="list" class="divide-y divide-gray-200">
                <li v-for="(item, index) in productList" :key="index" class="py-3 sm:py-4">
                    <div class="flex items-center">
                        <div class="flex w-2/3 ms-4 justify-between">
                            <p class="flex text-sm font-medium text-gray-900 truncate">
                                {{ item.name }}
                            </p>
                        </div>
                        <div class="flex w-1/3 items-center font-semibold text-gray-900">
                        {{ item.price.toLocaleString() }}원
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        
   </div>

</template>

<script setup>
import { ref } from 'vue'
// 나중에 DB에서 받아서 할 예정
const productList = ref([
  { name: 'LDPE-303', price: 5230000 },
  { name: 'LDPE-950', price: 3230000 },
  { name: 'EVA-303', price: 2230000 },
  { name: 'LLDPE-3120', price: 1930000 },
  { name: 'HDPE', price: 920000 },
])

</script>

<style lang="scss" scoped>

</style>