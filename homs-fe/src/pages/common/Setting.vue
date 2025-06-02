<template>
    <div>
      <div class="text-3xl px-3 py-3">
        <span class="font-bold">계정 설정</span>
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
import ClientDetailFields from '@/components/common/ClientDetailFields.vue';
import apiClient from '@/api';

const isEditable = ref(false);

const fields = ref([
  { label: '이름', key: 'managerName', value: '' },
  { label: '거래처명', key: 'companyId', value: '' },
  { label: '담당', key: 'deptId', value: '' },
  { label: '아이디', key: 'userName', value: '' },
  { label: '비밀번호', key: 'password', value: '' },
  { label: '이메일', key: 'managerEmail', value: '' },
  { label: '전화번호', key: 'managerPhone', value: '' },
]);

const getAuthUserId = () => {
  const authString = localStorage.getItem('auth');
  if (!authString) return null;

    const auth = JSON.parse(authString);
    return auth.user?.userId || null;

};


const userData = async (userId) => {
  try {
    const response = await apiClient.get(`/user/${userId}`);
    const data = response.data.data;

    const [companyRes, deptRes] = await Promise.all([
      apiClient.get(`/company/${data.companyId}`),
    //   apiClient.get(`/department/${data.deptId}`),           //담당 부서를 받아올 Api가 없네....
    ]);

    const companyName = companyRes.data.data.companyName;
    // const deptName = deptRes.data.data.deptName;

    fields.value = fields.value.map(field => {
      let value = data[field.key] ?? '';

      if (field.key === 'companyId') {
        value = companyName;
      } 
    //   else if (field.key === 'deptId') {
    //     value = deptName;
    //   }

      return {
        ...field,
        value,
      };
    });
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
  }
};

const toggleEdit = async () => {
  if (isEditable.value) {
    const updatedData = {};
    fields.value.forEach(field => {
      updatedData[field.key] = field.value;
    });

    // 로컬스토리지에서 userId 가져오기
    const userId = getAuthUserId();

      await apiClient.put(`/user/${userId}`, {
        managerName: updatedData.managerName,
        managerEmail: updatedData.managerEmail,
        managerPhone: updatedData.managerPhone,
        password: updatedData.password,
        // companyId와 deptId는 일반 사용자가 수정하지 않는다고 가정
      });
  }

  // 수정 모드 토글
  isEditable.value = !isEditable.value;
};



const goBack = () => {
    window.history.back()
}

onMounted( () =>{
    const userId = getAuthUserId();               //user 정보 추출

    if (userId) {
      userData(userId);  // 여기에 전달
    } else {
      console.error('userId가 auth 정보에 없습니다.');
    }

})


</script>

<style lang="scss" scoped>

</style>