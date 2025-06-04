<template>
    <div class="flex-col w-full min-h-[402px] p-8 bg-white border border-gray-300 rounded-3xl shadow-lg">
        <div class="flex items-center justify-between">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                배송 현황
            </h5>
        </div>
        <div class="flex justify-center items-center  min-h-full ">
            <div class="flex mx-auto space-x-6">
                <DeliveryStatusItem
                    :icon= "checklist"
                    label="납품 확인"
                    :count="0"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="box"
                    label="배송 준비"
                    :count="props.counts.BEFORE"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="truck"
                    label="배송중"
                    :count="props.counts.SHIPPING"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="deliverycomplete"
                    label="납품 완료"
                    :count="props.counts.COMPLETED"
                />
                <img :src=arrow alt="화살표" class=" h-16 my-auto">
                <DeliveryStatusItem
                    :icon="collect"
                    label="회수"
                    :count="props.counts.COLLECT"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import DeliveryStatusItem from './DeliveryStatusItem.vue';

import checklist from '@/assets/delivery/checklist.svg'
import box from '@/assets/delivery/box.svg'
import collect from '@/assets/delivery/collect.svg'
import deliverycomplete from '@/assets/delivery/deliverycomplete.svg'
import truck from '@/assets/delivery/truck.svg'
import arrow from '@/assets/delivery/arrow.svg'


const props = defineProps({
  counts: {
    type: Object,
    default: () => ({
      BEFORE: 0,
      SHIPPING: 0,
      COMPLETED: 0,
      COLLECT: 0
    })
  }
});

</script>

<style lang="scss" scoped>

</style>