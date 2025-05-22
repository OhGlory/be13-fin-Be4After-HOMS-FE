<template>
    <div v-if="visible" class="fixed inset-0 z-120 flex items-center justify-center">
      <div class="absolute inset-0 bg-gray-900 opacity-60"></div>
  
      <!-- 모달 내용 -->
      <div class="relative bg-white shadow-lg w-full max-w-2/3 z-10 pb-10">
        <div class="flex justify-end bg-slate-700 text-xl font-semibold mb-4 p-2">
          <img :src="xmark" alt="엑스마크" class="w-5 h-5 cursor-pointer" @click="$emit('confirm')">
        </div>
        <p class="m-6 text-gray-700 text-2xl font-extrabold">
                세금 명세서 발급
        </p>

        <p class=" mx-10 text-gray-700 text-md font-extrabold">
                공급자 정보
        </p>
        <div class="grid grid-cols-3 mx-10">
            <!-- 상호명 -->
            <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-300 font-semibold self-center">파트너사명</label>
            <div class="col-span-2 p-2 border border-gray-300   ">
                <input v-model="invoiceForm.companyName" type="text" class=" flex w-1/3 border border-gray-300 text-md ">
            </div>

            <!-- 사업자 등록번호 -->
            <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-300 font-semibold self-center">사업자 등록번호</label>
            <div class="col-span-2 p-2 border border-gray-300">
                <input v-model="invoiceForm.companyNumber" type="text" placeholder="000-00-00000" class="flex w-1/3 border border-gray-300 text-md">
            </div>

            <!-- 대표자명 -->
            <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-300 font-semibold self-center">대표자명</label>
            <div class="col-span-2 p-2 border border-gray-300">
                <input v-model="invoiceForm.ceoName" type="text" class="flex w-1/3 border border-gray-300 text-md">
            </div>

            <!-- 사업장 주소 -->
            <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-300 font-semibold self-center">사업장 주소</label>
            <div class="col-span-2 p-2 border border-gray-300">
                <input v-model="invoiceForm.companyAdress" type="text" class="flex w-1/3 border border-gray-300 text-md">
            </div>

            <!-- 업태 -->
            <!-- <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-300 font-semibold self-center">업종</label>
            <div class="col-span-2 p-2 border border-gray-300">
                <input v-model="invoiceForm.typeOfBusiness" type="text" class="flex w-1/3 border border-gray-300 text-md">
            </div> -->

            <!-- 종류 -->
            <!-- <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-300 font-semibold self-center">종류</label>
            <div class="col-span-2 p-2 border border-gray-300">
                <input v-model="invoiceForm.industry" type="text" class="flex w-1/3 border border-gray-300 text-md">
            </div> -->
        </div>

        <p class="mt-8 mx-10 text-gray-700 text-md font-extrabold">
                주문 정보
        </p>
        <DynamicTable :columns="orderColumns" :items="orderList" class="px-5">
            <template #cell-id="{ item }">
                <strong>{{ item.id }}</strong>
            </template>
        </DynamicTable>

        <div class="flex justify-end">
            <button @click="onIssued" class="mt-5 mr-9 px-6 py-3 w-1/6 bg-orange-600 text-white font-bold  hover:bg-orange-700 transition">
                    발급
            </button>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import xmark from '@/assets/xmark.svg';
import DynamicTable from '../DynamicTable.vue';
import { ref, reactive, watch } from 'vue';
import apiClient from '@/api';


const props = defineProps({
    visible: Boolean,
    orderId: Number
})
const emit = defineEmits(['confirm'])

function onClose() {
    showModal.value = false;
}

function onIssued() {
    // 여기서 발급 처리하자
    // 추후 작업은 작성한 데이터 기반으로 문서 만들고 DB에 저장해서
    // user쪽에서 발급된 세금 명세서 보일 수 있도록
    alert("발급 되었습니다");
    emit('confirm');
}

const invoiceForm = reactive({
    companyName:'',
    companyNumber: '',
    ceoName:'',
    companyAdress:'',
})

const orderColumns = ref([
  { label: '월', key: 'month' },
  { label: '일', key: 'day' },
  { label: '품목', key: 'product' },
  { label: '수량', key: 'quantity' },
//   { label: '단가', key: 'unitPrice' },
//   { label: '공급가액', key: 'supplyPrice' },
//   { label: '세액', key: 'taxPrice' },
//   { label: '상태', key: 'orderStatus' },
]);

const orderList = ref([
    { month: 1, day: '23', product: 'LDEP', quantity: '100', unitPrice: '12,000', supplyPrice: '120,000', taxPrice:'12,000', orderStatus: '-'},
    { month: 1, day: '23', product: 'LLDP-C', quantity: '10', unitPrice: '2,000', supplyPrice: '20,000', taxPrice:'2,000', orderStatus: '-'},
    { month: 1, day: '23', product: 'C-PPLP', quantity: '50', unitPrice: '10,000', supplyPrice: '500,000', taxPrice:'50,000', orderStatus: '-'},
]);

const fetchData = async() => {
    if(!props.orderId) return;

    try{
        const companyRes = await apiClient.get(`/settlement/${props.orderId}/companyInfo`);
        const companyData = companyRes.data.data;
        console.log("주문별 거래처 조회",companyData);
        Object.assign(invoiceForm, {
            companyName: companyData.companyName,
            companyNumber: companyData.registrationNumber,
            ceoName: companyData.representName,
            companyAdress: companyData.address
        });

        const orderRes = await apiClient.get(`/settlement/${props.orderId}/orderInfo`);
        const orderData = orderRes.data.data
        console.log("주문별 주문상품 조회", orderData);
        orderList.value = orderData.map(item => ({
            month: new Date(item.orderDate).getMonth(),
            day: new Date(item.orderDate).getDate(),
            product: item.productName,
            quantity: item.quantity,
            // unitPrice: item.unitPrice,
            // supplyPrice: item.supplyPrice,
            // taxPrice: item.taxPrice,
            // orderStatus: item.orderStatus
        }));
    }catch(error){
        console.log("주문 거래처 정보 불러오기 실패",error)
    }
}


watch(() => props.orderId, (newVal) => {
  if (newVal) fetchData();
});



  </script>
  