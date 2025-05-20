<template>
  <div>
    <!-- 제목 -->
    <div class="text-3xl px-3 py-3">
      <span>{{ $t('title.notice') }}</span>
    </div>
    <div class="p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold mb-4">{{ notice.title }}</h1>
        <p class="text-gray-500 text-sm">{{ new Date(notice.createdAt).toLocaleDateString() }}</p>
      </div>
      <hr class="my-2" />
      <div v-if="notice.imagePath" class="mt-6">
        <img :src="imagePath" alt="Notice Image" class="max-w-full rounded-md" />
      </div>
      <p class="text-gray-700">{{ notice.content }}</p>
      <hr class="my-6" />
      <div class="flex items-center justify-end">
        <div v-if="isAdmin">
          <button @click=" goToEditPage(notice)"
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
            {{ $t('btn.edit') }}
          </button>
          <button @click="confirmDelete(notice.id)"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
            {{ $t('btn.del') }}
          </button>
        </div>
        <button @click="goBack" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
          {{ $t('btn.list') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiClient from '@/api';
import { ref , watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { userStore } from '@/states/user';
const isAdmin = userStore().isAdmin;

const route = useRoute(); // 현재 URL 정보 가져옴
const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
const noticeId = Number(route.params.id); // 경로에 포함된 번호를 가져옴
const notice = ref({}); 
const { t, locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

// 이미지 관련
const basePath = import.meta.env.VITE_API_URL;
const imagePath = ref('');

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

const goBack = () => {
  router.push("/notices");
};

// 데이터 가져오는 함수
const fetchData = async () => {
    try {
        const response = await apiClient.get(`/notice/${noticeId}`);
        if (response.status === 200) {
            notice.value = response.data.data; // 응답 데이터 할당
            imagePath.value = basePath+`/files/view?key=${notice.value.imagePath}`
        } else {
            alert(t('errors.fetch_data_failed'));
        }
    } catch (err) {
        console.error(t('errors.fetch_data_erro'), err);
    }
};

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchData();
});

const goToEditPage = (notice) => {
  router.push({
    name: "AdminNoticesFrom",
    query: { noticesId: notice.id },
  });
};

const confirmDelete = (noticeId) => {
  if (confirm(t('script.delete'))) {
    // 삭제 처리 로직 호출
    deletePostData(noticeId);
  }
};

// 게시글 삭제
const deletePostData = async (noticeId) => {
  try {
    // 이미지가 있다면 먼저 제거
    if (notice.value.imagePath){
      const response = await apiClient.delete(`/files/delete?key=${notice.value.imagePath}`);
      console.log(response.data);
    }

    await apiClient.delete(`/notice/${noticeId}`);
    router.push("/notices/");
  } catch (error) {
    alert(error.response.data.message);
  }
};

  </script>