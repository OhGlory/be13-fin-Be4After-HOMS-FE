<template>
  <div>
    <!-- 제목 -->
    <div class="text-3xl px-3 py-3">
      <span>{{ $t('notice') }}</span>
    </div>
    <div class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-2xl font-bold mb-4">{{ notice.title }}</h2>
      <p class="text-gray-500 text-sm">{{ new Date(notice.createdAt).toLocaleDateString() }}</p>
      <hr class="my-4" />
      <p class="text-gray-700">{{ notice.content }}</p>

      <button @click="goToEditPage(notice)"
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
        {{ $t('btnEdit') }}
      </button>
      <button @click="confirmDelete(notice.id)"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
        {{ $t('btnDel') }}
      </button>
      <button @click="goBack" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
        목록
      </button>

    </div>
  </div>
</template>

<script setup>
import apiClient from '@/api';
import { ref , watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'

const route = useRoute(); // 현재 URL 정보 가져옴
const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
const noticeId = Number(route.params.id); // 경로에 포함된 번호를 가져옴
const notice = ref({}); 
const { locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

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
            console.log(response.data.data);
            notice.value = response.data.data; // 응답 데이터 할당

        } else {
            alert("데이터 조회 실패");
        }
    } catch (err) {
        console.error("데이터 조회 오류:", err);
    }
};

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
    fetchData();
});

const goToEditPage = (notice) => {
  console.log('goToEditPage 호출됨', notice.id)
  router.push({
    name: "AdminNoticesFrom",
    query: {
      noticesId: notice.id,
      title: notice.title,
      content: notice.content,
    },
  });
};

const confirmDelete = (noticeId) => {
  if (confirm("정말로 삭제하시겠습니까?")) {
    // 삭제 처리 로직 호출
    deletePostData(noticeId);
  }
};

// 게시글 삭제
const deletePostData = async (noticeId) => {
  try {
    await apiClient.delete(`/notice/${noticeId}`);
    alert("삭제 됐습니다.");
    // 게시글을 삭제한 후 기존 페이지로 돌려보냄
    router.push("/notices/");
  } catch (error) {
    alert(error.response.data.message);
  }
};

  </script>