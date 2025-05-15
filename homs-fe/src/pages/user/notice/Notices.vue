<template>
  <div>
    <!-- 제목 -->
    <div class="text-3xl px-3 py-3">
      <span>{{ $t('notice') }}</span>
    </div>
    <!-- 검색바 -->
    <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
      :userRole="currentUserRole" />
    <!-- 테이블 -->
    <DynamicTable :columns="userColumns" :items="users" :showCheckbox="true">
      <!-- 항목 상세 설정 -->
      <template #cell-id="{ item }">
        <strong>{{ item.id }}</strong>
      </template>
      <template #cell-createdAt="{ item }">
        {{ new Date(item.createdAt).toLocaleDateString() }}
      </template>
    </DynamicTable>

    <!-- 페이지 네비 -->
    <PageNav :currentPage="Number(currentPage)" :totalPages="Number(totalPages)" @set-page="handleSetPage"></PageNav>
  </div>
</template>

<script setup>
import apiClient from '@/api';
import SearchBox from '@/components/common/SaerchBar.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import PageNav from '@/components/common/PageNav.vue';
import { ref , watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

const router = useRouter();

const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(0); // 총 페이지 수 상태 관리
const pageSize = ref(10); // 페이지당 항목 수 (고정값)

const searchQuery = ref(''); // 검색어
// const selectOption = ref(''); // 검색 옵션

const currentUserRole = ref('admin'); // 현재 유저 권한

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

// ------- 검색바 --------
const handleSearch = (searchData) => {
  console.log('검색 데이터:', searchData);
  // 여기서 검색 로직을 처리하거나 부모 컴포넌트로 데이터를 전달할 수 있습니다.
  searchQuery.value = searchData.searchQuery;
  pageSize.value = searchData.size;
  currentPage.value = 1;
  fetchData();
};
// 검색 필터 목록
const handleSelectOption = ref([
  { value: "", label: "전체" },
  // { value: 'TITLE', label: '제목' },
  // { value: 'CONTENT', label: '내용' },
]);
// 액션 버튼 정의
const actionButtons = ref([
  {
    label: "추가",
    color: "bg-orange-500 hover:bg-orange-700",
    action: () => router.push({name:"AdminNoticesFrom"}),
    allowedRoles: ["admin"] // 이 버튼은 'admin'만 볼 수 있음
  },
  {
    label: "삭제",
    color: "bg-gray-500 hover:bg-gray-700",
    action: (item) => console.log("삭제:", item),
    allowedRoles: ["admin"] // 이 버튼은 'admin'만 볼 수 있음
  }
]);

// ------- 테이블 --------
const userColumns = ref([
  { label: '순번', key: 'id' },
  { label: '제목', key: 'title' },
  { label: '등록일', key: 'createdAt' },
]);

// 샘플 데이터
const users = ref([
  { id: 1, title: '한화 솔루션 케미칼에서 알려드립니다.', createdAt: '25-04-23' },
  { id: 2, title: '아무말이나 더미데이터로 넣어봅시다!', createdAt: '25-04-24' },
]);

// ------- 페이지네이션 --------
const handleSetPage = (page) => {
  currentPage.value = page;
  fetchData();
};

// 데이터 가져오는 함수
const fetchData = async () => {
    // 기본 요청 파라미터
    const params = {
        page: currentPage.value - 1, // 현재 페이지 번호 -1 (0 기반 인덱스)
        size: pageSize.value,
    };

    if (searchQuery.value) {
        params.title = searchQuery.value;
    }

    try {
        const response = await apiClient.get("/notice/", { params });
        if (response.status === 200) {
            console.log(response.data.data);
            users.value = response.data.data.content; // 응답 데이터 할당
            totalPages.value = response.data.data.totalPages; // 총 페이지 수 할당
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

</script>