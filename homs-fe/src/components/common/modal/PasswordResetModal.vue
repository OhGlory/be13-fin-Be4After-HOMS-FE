<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-gray-900 opacity-60"></div>
      <div class="relative bg-white shadow-lg w-full max-w-2/5 text-center z-10 pb-10">
        <div class="flex justify-end bg-slate-700 text-xl font-semibold mb-2 p-2">
          <img :src="xmark" alt="엑스마크" class="w-5 h-5 cursor-pointer" @click="onClose">
        </div>
        <p class="mb-6 text-gray-700 text-2xl font-extrabold">
            비밀번호 찾기
        </p>
        <!-- input영역 -->
        <div class="grid grid-cols-3 mx-10 gap-y-5">

            <!-- 아이디 -->
            <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-200 font-semibold self-center">
                아이디
            </label>
            <div class="col-span-2 p-2 border border-gray-200">
                <input v-model="resetPwform.userId" type="text" class=" flex w-1/2 border border-gray-300 text-md ">
            </div>

            <!-- 이메일 -->
            <label class=" flex items-center pl-3 h-full bg-gray-200 border border-gray-200 font-semibold self-center">
                이메일
            </label>
            <div class="col-span-2 p-2 border border-gray-200">
                <input v-model="resetPwform.userEmail" type="email" class="flex w-1/2 border border-gray-300 text-md">
            </div>
        </div>

        <div>
            <p class="my-5 font-semibold">파트너사 초기 계정: 로그인 아이디는 사업자 <span class="text-xl font-bold text-blue-600">등록번호 10자리</span> 입니다.</p>
            <div class="grid grid-cols-2 gap-x-3 pr-20">
                <p class="flex items-center justify-end font-bold text-center text-xl text-orange-500 ">
                    기타문의
                </p>
                <div class="flex flex-col justify-start">
                    <p class="flex justify-start font-semibold">e-mail : Ohglory@gmail.com</p>
                    <p class="flex justify-start font-semibold">연락처 : 010-2294-8826</p>
                </div>
            </div>
        </div>

        <div class="flex gap-10 justify-center mt-5">
            <button @click="onSave" class="px-6 py-3 w-1/6 bg-orange-600 text-white font-bold  hover:bg-orange-700 transition">
                저장
            </button>
            <button @click="onClose" class="px-6 py-3 w-1/6 bg-slate-500 text-white font-bold hover:bg-slate-600 transition">
                취소
            </button>
        </div>

      </div>
    </div>
    
    <PasswordResetSendModal :visible="showSuccess" :FormData="resetPwform" @close="onConfirmModalClose" />
  </template>
  
  <script setup>
  import xmark from '@/assets/xmark.svg'
  import { reactive, ref } from 'vue'
import PasswordResetSendModal from './PasswordResetSendModal.vue'
  

  const showSuccess = ref(false)


  defineProps({
    visible: Boolean,
  })

  const emit = defineEmits(['close'])

  const resetPwform = reactive({
    userId:'',
    userEmail:'',
  })

  // 비밀번호 초기화 모달만 닫는기능
  function onClose() {
      emit('close')
      clearForm()
  }

  function onSave(){
      showSuccess.value=true
      clearForm()
  }

  function clearForm(){
      resetPwform.userEmail = ""
      resetPwform.userId = ""
  }

    //하위 모달인 임시 비밀번호 발급 모달이 닫히면 같이 닫히는 기능
  function onConfirmModalClose(){
    showSuccess.value = false
    emit('close')
  }

  </script>
  