<template>
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


import { ref } from 'vue'

// 상태 관리
const isUser = ref(true)
function toggleRole() {
  isUser.value = !isUser.value
}

</script>

<style lang="scss" scoped>

</style>