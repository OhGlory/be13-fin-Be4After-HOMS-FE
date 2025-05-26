<template>
    <!-- 사용자 대시보드 -->
    <div class="flex flex-col">
        <div class="flex gap-5">
            <Order></Order>
            <SettlementManagement></SettlementManagement>
        </div>
        <div class="flex gap-5 mt-10">
            <UserDeliveryState></UserDeliveryState>
            <ClaimStatue></ClaimStatue>
        </div>
        <div class="flex gap-5 mt-10">
            <Notice></Notice>  
            <OilPriceTrends></OilPriceTrends>
        </div>
    </div>
</template>

<script setup>
// 유저 관련 import
import ClaimStatue from '@/components/dashboard/admin/ClaimStatue.vue';
import OilPriceTrends from '@/components/dashboard/chart/OilPriceTrends.vue';
import Order from '@/components/dashboard/user/Order.vue';
import SettlementManagement from '@/components/dashboard/user/SettlementManagement.vue';
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