<template>
  <div class="flex flex-col max-w-1/2 m-auto rounded-xl border-1 py-5 border-gray-400 shadow">
    <div class="flex w-2/3 m-auto mb-3" v-for="(item, index) in fields" :key="index">
      <div class="flex border-gray-400 border w-1/2 p-2 font-bold bg-gray-200">
        {{ item.label }}
      </div>
      <div class="flex border-gray-400 border w-1/2 p-2 font-bold">
        <input
          type="text"
          v-model="item.value"
          :readonly="!isEditable"
          :class="[
            'w-full outline-none',
            isEditable ? 'bg-[#fdf6e3] border border-gray-400' : 'bg-transparent'
          ]"
        />
      </div>
    </div>

    <!-- 계약 기간 필드 (필요 시만 표시) -->
    <div
      v-if="contractPeriod"
      class="flex w-2/3 m-auto mb-3"
    >
      <div class="flex border-gray-400 border w-1/2 p-2 font-bold bg-gray-200">
        계약 기간
      </div>
      <div class="flex border-gray-400 border w-1/2 p-2 font-bold">
        <input
          type="text"
          v-model="contractPeriodModel"
          :readonly="!isEditable"
          :class="[
            'w-full outline-none',
            isEditable ? 'bg-[#fdf6e3] border border-gray-400' : 'bg-transparent'
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  fields: {
    type: Object,
    required: true
  },
  isEditable: {
    type: Boolean,
    default: false
  },
  contractPeriod: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:contractPeriod']);

const contractPeriodModel = ref(props.contractPeriod);

watch(contractPeriodModel, (val) => {
  emit('update:contractPeriod', val);
});
</script>

<style scoped>
input[readonly] {
  background-color: transparent;
  cursor: default;
}
</style>