<template>
    <div class="w-full max-w-md p-4 bg-white border border-gray-300 rounded-3xl shadow-lg sm:p-8">
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                총 주문 현황
            </h5>
        </div>
        <div>
            <Pie 
            :options="chartOptions" 
            :data="chartData" 
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
ChartJS.register(ArcElement, Tooltip, Legend)

const chartData = ref({
    labels: ['LDP   E', 'LDPE-950', 'EVA-1125', 'AngularJs'],
    datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
}

</script>

<style lang="scss" scoped>

</style>