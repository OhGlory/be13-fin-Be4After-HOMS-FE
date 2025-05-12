<template>
    <div class="flex-col w-2/3 min-h-[402px] p-8 bg-white border border-gray-300 rounded-3xl shadow-lg">
        <div class="flex items-center justify-between">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                배송 현황
            </h5>
        </div>
        <div class="flex justify-center items-center min-h-full ">
            <div class="flex mx-auto space-x-6">
                <DeliveryStatusItem
                    :icon= "checklist"
                    label="주문 확인"
                    :count="0"
                    size = "user"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="box"
                    label="배송 준비"
                    :count="0"
                    size = "user"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="truck"
                    label="배송중"
                    :count="0"
                    size = "user"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="deliverycomplete"
                    label="배송 완료"
                    :count="0"
                    size = "user"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import DeliveryStatusItem from '../admin/DeliveryStatusItem.vue'

import checklist from '@/assets/delivery/checklist.svg'
import box from '@/assets/delivery/box.svg'
import deliverycomplete from '@/assets/delivery/deliverycomplete.svg'
import truck from '@/assets/delivery/truck.svg'
import arrow from '@/assets/delivery/arrow.svg'

</script>

<style lang="scss" scoped>

</style>