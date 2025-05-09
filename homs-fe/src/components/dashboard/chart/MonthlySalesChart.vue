<template>
    <div class="flex-col w-full max-w-4xl p-8 bg-white border border-gray-300 rounded-3xl shadow-lg">
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                월별 매출 현황
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

import {Bar} from 'vue-chartjs';
import { ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, plugins, LineElement, PointElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// 차트 데이터는 여기에 저장 (DB에서 )
const chartData = ref({
    labels : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
        {
            type: 'bar',
            label: '매출',
            backgroundColor: '#F16203',
            data: [40, 20, 12, 30, 29, 18, 49, 28, 67, 50, 81, 72],
        },
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