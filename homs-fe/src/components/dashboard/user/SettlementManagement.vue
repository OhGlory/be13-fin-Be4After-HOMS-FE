<template>
    <div class="w-full max-w-1/2 p-4 bg-white border border-gray-300 rounded-3xl shadow-lg sm:p-8">
      <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900">정산 관리</h5>
        <a href="#" class="text-sm font-medium hover:underline">+</a>
      </div>
  
      <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200">
          <!-- 헤더 -->
          <li class="py-3 sm:py-4">
              <div class="flex w-full justify-around">
                <p class="w-1/4 text-base font-bold text-gray-900 text-center truncate">주문 번호</p>
                <p class="w-1/4 text-base font-bold text-gray-900 text-center truncate">주문 일자</p>
                <p class="w-1/4 text-base font-bold text-gray-900 text-center truncate">정산 일자</p>
                <p class="w-1/4 text-base font-bold text-gray-900 text-center truncate">정산 여부</p>
              </div>
          </li>
  
          <!-- 데이터 목록 -->
          <li v-for="(settlements, index) in settlementsList" :key="index" class="py-3 sm:py-4">
              <div class="flex items-center w-full justify-between">
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ settlements.orderId }}</p>
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ settlements.orderDate }}</p>
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ settlements.settlementDate }}</p>
                <p class="w-1/5 text-base font-bold text-center truncate"
                   :class="getColor(settlements.status)">
                    {{ settlements.status }}
                </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const settlementsList = ref([
    {
      orderId: 'H-04-23',
      orderDate: '2025-04-24',
      settlementDate: '2025-04-25',
      status: '정산',
    },
    {
      orderId: 'H-02-11',
      orderDate: '2025-04-24',
      settlementDate: '-',
      status: '미정산',
    },
    {
      orderId: 'H-01-10',
      orderDate: '2025-04-24',
      settlementDate: '-',
      status: '정산 대기',
    },
    {
      orderId: 'H-01-03',
      orderDate: '2025-04-24',
      settlementDate: '-',
      status: '미정산',
    },
  ])

  const getColor = (status) =>{
    switch(status) {
        case "정산":
            return "text-green-700"
        case "미정산":
            return "text-red-600"
        case "정산 대기":
            return "text-yellow-400"
        default:
            return "text-gray-900"
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  