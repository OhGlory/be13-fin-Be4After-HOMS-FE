<template>
    <button @click="toggleRole" class="px-4 py-2 bg-blue-500 text-white rounded mb-6">
      {{ isUser ? '사용자' : '관리자' }} 보기
    </button>
    <!-- 관리자 대시보드 -->
        <div v-if="isUser" class="flex flex-col">
            <div class="flex gap-10">
                <OrderedProducts></OrderedProducts>
                <MonthlySalesChart></MonthlySalesChart>
            </div>
            <div class="flex gap-10 mt-10">
                <TotalSalesChart></TotalSalesChart>
                <TransactionByPartnerChart></TransactionByPartnerChart>
            </div>
            <div class="flex mt-10">
                <DeliveryState></DeliveryState>
            </div>
            <div class="flex mt-10 gap-10">
                <ClaimStatue></ClaimStatue>
                <OilPriceTrends></OilPriceTrends>
            </div>
        </div>
    <!-- 사용자 대시보드 -->
    <div v-else class="flex flex-col">
        <div class="flex gap-5">
            <Order></Order>
            <SettlementManagement></SettlementManagement>
        </div>
        <div class="flex gap-5 mt-10">
            <UserDeliveryState></UserDeliveryState>
            <Notice></Notice>   
        </div>
        <div class="flex gap-5 mt-10">
            <ClaimStatue></ClaimStatue>
            <OilPriceTrends></OilPriceTrends>
        </div>
    </div>
</template>

<script setup>
// 관리자 관련 import
import OrderedProducts from '@/components/dashboard/admin/OrderedProducts.vue';
import MonthlySalesChart from '@/components/dashboard/chart/MonthlySalesChart.vue';
import TotalSalesChart from '@/components/dashboard/chart/TotalSalesChart.vue';
import TransactionByPartnerChart from '@/components/dashboard/chart/TransactionByPartnerChart.vue';
import DeliveryState from '@/components/dashboard/admin/DeliveryState.vue';
import ClaimStatue from '@/components/dashboard/admin/ClaimStatue.vue';
import OilPriceTrends from '@/components/dashboard/chart/OilPriceTrends.vue';

// 유저 관련 import
import Order from '@/components/dashboard/user/Order.vue';
import SettlementManagement from '@/components/dashboard/user/ SettlementManagement.vue';
import UserDeliveryState from '@/components/dashboard/user/UserDeliveryState.vue';
import Notice from '@/components/dashboard/user/notice.vue';


import { ref } from 'vue'

// 상태 관리
const isUser = ref(true)
function toggleRole() {
  isUser.value = !isUser.value
}



</script>

<style lang="scss" scoped>

</style>