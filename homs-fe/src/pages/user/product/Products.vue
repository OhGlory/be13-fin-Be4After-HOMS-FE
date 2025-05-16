<template>
  <div>
    <!-- 제목 -->
    <div class="text-3xl px-3 py-3">
      <span>상품목록</span>
    </div>
    <!-- 검색바 -->
    <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
      :userRole="isAdmin" />
    <!-- 테이블 -->
    <DynamicTable :columns="userColumns" :items="users" :showCheckbox="true" @selected="handleSelectedItems"
      @row-click="handleRowClick">
      <!-- 항목 상세 설정 -->
      <template #cell-id="{ item }">
        <strong>{{ item.id }}</strong>
      </template>
      <template #cell-category="{ item }">
        {{ item.category?.categoryId }}
      </template>
      <template #cell-productDomain="{ item }">
        {{ item.category?.productDomain }}
      </template>
      <template #cell-productCategory="{ item }">
        {{ item.category?.productCategory }}
      </template>
      <template #cell-minQuantity>10</template>
      <template #actions="{ item }">
        <button @click="editBtn(item.productId)"
          class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
          {{ $t('btn.edit') }}
        </button>
        <button @click="deleteBtn(item.productId)"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
          {{ $t('btn.del') }}
        </button>
      </template>
    </DynamicTable>

    <!-- 페이지 네비 -->
    <PageNav :currentPage="Number(currentPage)" :totalPages="Number(totalPages)" @set-page="handleSetPage"></PageNav>
    <!-- 모달 -->
    <ProductDetail :visible="showModal" :productId="Number(selectedId)" @close="showModal = false"></ProductDetail>
  </div>
</template>

<script setup>
import apiClient from '@/api';
import SearchBox from '@/components/common/SaerchBar.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import PageNav from '@/components/common/PageNav.vue';
import ProductDetail from '@/components/common/modal/ProductDetail.vue';
import { ref , watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { userStore } from '@/states/user';
const isAdmin = userStore().isAdmin;

const { t, locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

const router = useRouter();

const showModal = ref(false); // 모달 상태 관리
const selectedId = ref(null); // 선택된 항목 ID

const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(0); // 총 페이지 수 상태 관리
const pageSize = ref(10); // 페이지당 항목 수 (고정값)

const selectedUserIds = ref([]); // 선택된 항목 ID

const searchQuery = ref(''); // 검색어
// const selectOption = ref(''); // 검색 옵션


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
    action: () => router.push({name:"ProductForm"}),
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
  { label: '번호', key: 'productId' },
  { label: '분야', key: 'productDomain' },
  { label: '분류', key: 'productCategory' },
  { label: '제품명', key: 'productName' },
  { label: '최소단위', key: 'minQuantity' },
  { label: '재고량', key: 'productQuantity' },
]);

const users = ref([
    { id: 1, categroy: 'PO', categroy2: 'LDPE', productName: '303', minQuantity: '10', inven: '9999'},
    { id: 2, categroy: 'PO', categroy2: 'LDPE', productName: '303', minQuantity: '10', inven: '9999'},
    { id: 3, categroy: 'PO', categroy2: 'LDPE', productName: '303', minQuantity: '10', inven: '9999'},
    { id: 4, categroy: 'PO', categroy2: 'LDPE', productName: '303', minQuantity: '10', inven: '9999'},
]);

const editBtn = (productId) => {
  router.push({ name: 'ProductForm', query: { productId: productId } });
};

const deleteBtn = (productId) => {
  if (confirm(t('script.delete'))) {
    // 삭제 처리 로직 호출
    deletePostData(productId);
  }
};

// 상품 삭제
const deletePostData = async (productId) => {
  try {
    await apiClient.delete(`/product/${productId}`);
    router.push("/products/");
    fetchData();
  } catch (error) {
    alert(error.response.data.message);
  }
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
        const response = await apiClient.get("/product/", { params });
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

// 선택한 행에 대한 정보 처리
const handleRowClick = (item) => {
  selectedId.value = item.productId; // 선택된 항목 ID 업데이트
  showModal.value = true;
};

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  // 모달 상태를 localstorage에 넣어서 상태 관리
  const modalConfirmed = localStorage.getItem('modalConfirmed')
  if (modalConfirmed === 'true') {
    showModal.value = false
  }
    fetchData();
});

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

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

</script>