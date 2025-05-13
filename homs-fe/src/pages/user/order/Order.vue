<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>주문관리 > 발주목록</span>
        </div>
        <!-- 검색바 -->
        <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
            :userRole="currentUserRole" />
        <!-- 테이블 -->
        <DynamicTable :columns="userColumns" :items="users" :showCheckbox="true" action="승인여부">
            <template #cell-id="{ item }">
                <strong>{{ item.id }}</strong>
            </template>
            <template #cell-name="{ item }">
                {{ item.name }}
            </template>
            <template #cell-email="{ item }">
                <a :href="`mailto:${item.email}`">{{ item.email }}</a>
            </template>
            <template #actions="{ item }">
                <button @click="editUser(item)"
                    class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
                    승인
                </button>
                <button @click="deleteUser(item)"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
                    거부
                </button>
            </template>
        </DynamicTable>
        <!-- 페이지 네비 -->
        <PageNav :currentPage="currentPage" :totalPages="totalPages" @set-page="handleSetPage"></PageNav>
    </div>
</template>

<script setup>
import SearchBox from '@/components/common/SaerchBar.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import PageNav from '@/components/common/PageNav.vue';
import { ref } from 'vue';

const searchResult = ref(null);
const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(20); // 총 페이지 수 상태 관리
const currentUserRole = ref('admin'); // 현재 유저 권한

// ------- 검색바 --------
const handleSearch = (searchData) => {
  console.log('검색 데이터:', searchData);
  // 여기서 검색 로직을 처리하거나 부모 컴포넌트로 데이터를 전달할 수 있습니다.
  searchResult.value = searchData;
};

const handleSelectOption = ref([
  { value: "", label: "전체" },
  { value: "important", label: "중요" },
  { value: "recent", label: "최근" },
]);

const actionButtons = ref([
  {
    label: "일괄승인",
    color: "bg-orange-500 hover:bg-orange-700",
    action: (item) => console.log("추가:", item),
    allowedRoles: ["admin", "editor"] // 이 버튼은 'admin' 또는 'editor'만 볼 수 있음
  },
  {
    label: "일괄제거",
    color: "bg-gray-500 hover:bg-gray-700",
    action: (item) => console.log("삭제:", item),
    allowedRoles: ["admin"] // 이 버튼은 'admin'만 볼 수 있음
  },
]);

// ------- 테이블 --------
const userColumns = ref([
  { label: '순번', key: 'id' },
  { label: '발주번호', key: 'orderCode' },
  { label: '거래처명', key: 'companyName' },
  { label: '납품장소', key: 'deliveryName' },
  { label: '요청일', key: 'orderDate' },
  { label: '납기일', key: 'settlementDate' },
]);

const users = ref([
    { id: 1, orderCode: 'H-04-23', companyName: '영광상사', deliveryName: '서울', orderDate: '25-04-02', settlementDate: '25-04-11'},
    { id: 2, orderCode: 'H-04-23', companyName: '영광상사', deliveryName: '서울', orderDate: '25-04-02', settlementDate: '25-04-11'},
    { id: 3, orderCode: 'H-04-23', companyName: '하이젠버그', deliveryName: '미국', orderDate: '25-04-02', settlementDate: '25-04-11'},
]);

const editUser = (user) => {
  console.log('수정:', user);
};

const deleteUser = (user) => {
  console.log('삭제:', user);
};

// ------- 페이지네이션 --------
const handleSetPage = (page) => {
  console.log('페이지 변경 요청:', page);
  currentPage.value = page;
  // 여기서 해당 페이지의 데이터를 불러오는 로직 등을 수행해야 합니다.
};

</script>