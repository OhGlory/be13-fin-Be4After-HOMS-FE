<template>
    <div>
      <div class="text-3xl px-3 py-3">
        <span class="font-bold">거래처 상세 페이지</span>
      </div>
      <ClientDetailFields
        :fields="fields"
        :isEditable="isEditable"
      />

      <div class="flex justify-center w-2/3 m-auto my-4 gap-10">
        <button @click="toggleEdit" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
          {{ isEditable ? '저장' : '수정' }}
        </button>
        <button @click="goBack" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
           취소
        </button>
      </div>
    </div>
  </template>
  

  <script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ClientDetailFields from '@/components/common/ClientDetailFields.vue';
import apiClient from '@/api';

const isEditable = ref(false);
const route = useRoute();
const clientId = route.params.id;

const fields = ref([
  { label: '파트너사명', key: 'companyName', value: '' },
  { label: '대표자명', key: 'ceoName', value: '' },
  { label: '사업자번호', key: 'companyNumber', value: '' },
  { label: '주소', key: 'companyAddress', value: '' },
  { label: '연락처', key: 'companyTell', value: '' },
  { label: '이메일', key: 'companyEmail', value: '' },

]);

const fetchData = async () => {
    const response = await apiClient.get(`admin/company/${clientId}`)
    const data = response.data.data;

    const mapping = {
        companyName: data.companyName,
        ceoName: data.representName,
        companyNumber: data.registrationNumber,
        companyAddress: data.companyId,
        companyTell: data.representCall,
        companyEmail: data.representManagerEmail,

    };

    fields.value.forEach(field => {
        field.value = mapping[field.key];
    });
}


const toggleEdit = () => {
  if (isEditable.value) {
    console.log('저장할 데이터:', fields.value.map(f => ({ [f.label]: f.value })));
  }
  isEditable.value = !isEditable.value;
};

const goBack = () => {
    window.history.back()
}

onMounted(() =>{
    fetchData();
    
}) 
</script>
  
  <style scoped>
  input[readonly] {
    background-color: transparent;
    cursor: default;
  }
  </style>
  