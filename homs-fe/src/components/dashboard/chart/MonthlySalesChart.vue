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
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const labels = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

const chartData = ref({
  labels,
  datasets: [
    {
      type: 'bar',
      label: '매출',
      backgroundColor: '#F16203',
      data: [], 
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

function calculateMonthlySales(data) {
  const monthlySales = Array(12).fill(0);
  data.forEach(item => {
    const date = new Date(item.order.orderDate);
    const month = date.getMonth();
    monthlySales[month] += item.quantity;
  });
  return monthlySales;
}

onMounted(async () => {
  try {
    const token = localStorage.getItem("accessToken")
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/orderitem/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    const orderItems = response.data.data;
    const monthlySales = calculateMonthlySales(orderItems);
    console.log("monthlySales", monthlySales)
    chartData.value = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: '매출',
          backgroundColor: '#F16203',
          data: monthlySales,
        },
      ],
    };
  } catch (error) {
    console.error('API 호출 에러:', error);
  }
});

</script>