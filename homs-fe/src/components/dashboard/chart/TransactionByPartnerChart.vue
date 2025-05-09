<template>
    <div class="flex-col w-full max-w-4xl p-8 bg-white border border-gray-300 rounded-3xl shadow-lg">   
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                거래처별 거래 현황
            </h5>
        </div>
        <Bar
            :options="chartOptions"
            :data="chartData"
            :width="700"
            :height="300"
            class="mx-auto"
        />
    </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement ,CategoryScale, LinearScale, plugins, LineElement, PointElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,PointElement, LineElement)

const chartData = ref({
    labels : ['무구상사', '영광상사', '대다상사', '라니상사', '경상사', '범석상사', 'SJ상사'],
    datasets: [
        {
            type: 'bar',
            label: '매출',
            backgroundColor: '#F16203',
            data: [40, 20, 12, 30, 29, 18, 49],
        },
        {
            type: 'line',
            label: "작년 매출",
            borderColor: "#0000ff",
            backgroundColor: "#ffffff",
            data: [50, 30, 22, 40, 39, 28, 59]
        }
    ],
});

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'none',
        },
        title: {
            display: false,
            text: '월별 매출',
        },
    },
};

</script>

<style lang="scss" scoped>

</style>