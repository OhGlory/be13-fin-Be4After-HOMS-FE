<template>
    <div class="flex-col w-full max-w-4xl p-8 bg-white border border-gray-300 rounded-3xl shadow-lg">   
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 ">
                국제 유가 동향
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
    labels : [
                '5/1', '5/2', '5/3', '5/4', '5/5', '5/6', '5/7', '5/8','5/9','5/10',
                '5/11', '5/12', '5/13', '5/14', '5/15', '5/16', '5/17', '5/18','5/19','5/20',
                '5/21', '5/22', '5/23', '5/24', '5/25', '5/26', '5/27', '5/28','5/29','5/30',
            ],
    datasets: [
        {
            type: 'bar',
            label: '매출',
            backgroundColor: '#F16203',
            data: [
                    40, 45, 50, 55, 60, 60, 65, 65, 70, 70, 
                    70, 65, 60 ,60, 55, 55, 50, 45, 40, 40, 
                    35, 55, 65, 70, 70, 80, 70, 60, 60, 50,
                    ],
        },
        {
            type: 'line',
            label: "작년 매출",
            borderColor: "#0000ff",
            backgroundColor: "#ffffff",
            data: [ 50, 55, 60, 65, 70, 70, 75, 75, 80, 80, 
                    80, 75, 70, 70, 65, 65, 60, 55, 50, 50, 
                    45, 65, 75, 80, 80, 90, 80, 70, 70, 60
                    ]
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