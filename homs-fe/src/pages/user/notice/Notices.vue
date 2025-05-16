<template>
  <div>
    <!-- 제목 -->
    <div class="text-3xl px-3 py-3">
      <span>{{ $t('title.notice') }}</span>
    </div>
    <!-- 검색바 -->
    <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
      :userRole="isAdmin" />
    <!-- 테이블 -->
    <DynamicTable :columns="userColumns" :items="users" :showCheckbox="true" @selected="handleSelectedItems">
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
import { userStore } from '@/states/user';
const isAdmin = userStore().isAdmin;

const { t, locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

// 이건 나중에 로그인 정보 권한에 따라 판별할 수 있도록 변경
// ture 이면 admin | false이면 user

const router = useRouter();

const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(0); // 총 페이지 수 상태 관리
const pageSize = ref(10); // 페이지당 항목 수 (고정값)

const selectedUserIds = ref([]); // 선택된 항목 ID

const searchQuery = ref(''); // 검색어
// const selectOption = ref(''); // 검색 옵션

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

// ------- 검색바 --------
const handleSearch = (searchData) => {
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
    label: t('btn.add'),
    color: "bg-orange-500 hover:bg-orange-700",
    action: () => router.push({name:"AdminNoticesFrom"}),
    allowedRoles: ["admin"] // 이 버튼은 'admin'만 볼 수 있음
  },
  {
    label: t('btn.del'),
    color: "bg-gray-500 hover:bg-gray-700",
    action: () => deleteItems(selectedUserIds.value.length),
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
            alert(t('errors.fetch_data_failed'));
        }
    } catch (err) {
        console.error(t('errors.fetch_data_erro'), err);
    }
};

// ------- 페이지네이션 --------
const handleSetPage = (page) => {
  currentPage.value = page;
  fetchData();
};

// ------ 기타 -------

// 체크박스 선택된 항목 처리
const handleSelectedItems = (selectedIds) => {
  selectedUserIds.value = selectedIds;
  console.log('선택된 아이템 ID:', selectedUserIds.value);
  // selectedUserIds.value.length
};

// 게시글 삭제
const deleteItems = async (selectedItemLength) => {
  // try {
  //   await apiClient.delete(`/notice/${noticeId}`);
  //   alert("삭제 됐습니다.");
  //   // 게시글을 삭제한 후 기존 페이지로 돌려보냄
  //   router.push("/notices/");
  // } catch (error) {
  //   alert(error.response.data.message);
  // }
  if (confirm(selectedUserIds.value.length + "개의 항목을 정말로 삭제하시겠습니까?")){
    alert('미구현!')
  }
};

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
    fetchData();
});

</script>