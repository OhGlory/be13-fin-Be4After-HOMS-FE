<template>
    <div class="w-full max-w-1/2 p-4 bg-white border border-gray-300 rounded-3xl shadow-lg sm:p-8">
      <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900">주문 건</h5>
        <a href="#" class="text-sm font-medium hover:underline">+</a>
      </div>
  
      <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200">
          <!-- 헤더 -->
          <li class="py-3 sm:py-4">
              <div class="flex w-full justify-around">
                <p class="w-1/5 text-base font-bold text-gray-900 text-center truncate">주문 번호</p>
                <p class="w-1/5 text-base font-bold text-gray-900 text-center truncate">제품</p>
                <p class="w-1/5 text-base font-bold text-gray-900 text-center truncate">수량</p>
                <p class="w-1/5 text-base font-bold text-gray-900 text-center truncate">주문 일자</p>
                <p class="w-1/5 text-base font-bold text-gray-900 text-center truncate">상태</p>
              </div>
          </li>
  
          <!-- 데이터 목록 -->
          <li v-for="(order, index) in orderList" :key="index" class="py-3 sm:py-4">
              <div class="flex items-center w-full justify-between">
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ order.orderId }}</p>
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ order.product }}</p>
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ order.quantity.toLocaleString() }}</p>
                <p class="w-1/5 text-base font-bold text-center text-gray-900 truncate">{{ order.date }}</p>
                <p class="w-1/5 text-base font-bold text-center truncate"
                   :class="getColor(order.status)">
                
                    {{ order.status }}
                </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const orderList = ref([
    {
      orderId: 'H-04-23',
      product: 'PO',
      quantity: 100000,
      date: '2025-04-24',
      status: '승인',
    },
    {
      orderId: 'H-02-11',
      product: 'LDPE',
      quantity: 3000000,
      date: '2025-04-24',
      status: '미승인',
    },
    {
      orderId: 'H-01-10',
      product: 'PO',
      quantity: 12000000,
      date: '2025-04-24',
      status: '승인보류',
    },
    {
      orderId: 'H-01-03',
      product: 'PCCP',
      quantity: 8000000,
      date: '2025-04-24',
      status: '승인취소',
    },
  ])

  const getColor = (status) =>{
    switch(status) {
        case "승인":
            return "text-green-700"
        case "미승인":
            return "text-blue-600"
        case "승인보류":
            return "text-yellow-400"
        case "승인취소":
            return "text-red-600"
        default:
            return "text-gray-900"
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  