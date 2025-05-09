<template>
    <div class="flex flex-col">
      <div class="flex w-40 h-40 bg-gray-300 rounded-full">
        <div class="flex w-full items-center justify-center">
          <img :src="icon" :alt="label" class="w-20 h-20" />
        </div>
      </div>
      <div class="flex flex-col items-center mt-5 gap-5">
        <span class="text-xl">{{ label }}</span>
        <span class="text-xl font-bold">{{ count }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    icon: String,
    label: String,
    count: {
      type: Number,
      default: 0
    }
  })
  </script>
  
  <style scoped>
  </style>
  