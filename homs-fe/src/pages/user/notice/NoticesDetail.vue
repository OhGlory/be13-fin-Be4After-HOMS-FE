<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>{{ $t('notice') }}</span>
        </div>
        <div class="p-6 bg-white rounded-md shadow-md">
            <h2 class="text-2xl font-bold mb-4">{{ notice.title }}</h2>
            <p class="text-gray-500 text-sm">{{ notice.date }}</p>
            <hr class="my-4" />
            <p class="text-gray-700">{{ notice.content }}</p>

            <button @click="goBack"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
                목록
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref , watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'

const route = useRoute();
const router = useRouter();

const { locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

const notices = ref([
  { id: "1", title: "[공지] 시스템 점검 안내", date: "2025-05-10", content: "2025년 5월 20일 오전 2시~4시 시스템 점검이 예정되어 있습니다." },
  { id: "2", title: "[공지] 신규 기능 업데이트", date: "2025-05-12", content: "새로운 기능이 추가되었습니다! 자세한 내용은 공지사항을 확인해주세요." }
]);

// 현재 페이지의 공지사항을 찾아 반환
const notice = computed(() => {
  return notices.value.find(n => n.id === route.params.id) || { title: "공지사항을 찾을 수 없습니다.", date: "", content: "" };
});

const goBack = () => {
  router.push("/notices");
};

  </script>