<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>통합계정관리</span>
        </div>
        <!-- 검색바 -->
        <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
            :userRole="currentUserRole" />
        <!-- 테이블 -->
        <DynamicTable :columns="userColumns" :items="users" :showCheckbox="false">
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
                    수정
                </button>
                <button @click="deleteUser(item)"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
                    삭제
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
    label: "신규 계정 생성",
    color: "bg-orange-500 hover:bg-orange-700",
    action: (item) => console.log("추가:", item),
    allowedRoles: ["admin", "editor"] // 이 버튼은 'admin' 또는 'editor'만 볼 수 있음
  },
]);

// ------- 테이블 --------
const userColumns = ref([
  { label: '순번', key: 'id' },
  { label: '이름', key: 'userName' },
  { label: '파트너사', key: 'companyName' },
  { label: '담당', key: 'deptName' },
  { label: '이메일', key: 'email' },
  { label: '권한', key: 'role' },
  { label: '계정상태', key: 'isLockedOut' },
  { label: '최종 접속일', key: 'loginDate' },
]);

const users = ref([
    { id: 1, userName: '신하람', companyName: '영광상사', deptName: '구매', email: 'kim123@gmail.com', role: '관리자', isLockedOut:"로그인", loginDate: '25-04-02'},
    { id: 2, userName: '김민수', companyName: '한빛전자', deptName: '영업', email: 'minsu77@gmail.com', role: '유저', isLockedOut: '로그인', loginDate: '25-04-01' },
    { id: 3, userName: '박지훈', companyName: '태양물산', deptName: '총무', email: 'jihoon99@yahoo.com', role: '관리자', isLockedOut: '로그아웃', loginDate: '25-04-03' },
    { id: 4, userName: '이서윤', companyName: '대명유통', deptName: '마케팅', email: 'seoyun@daemyung.com', role: '유저', isLockedOut: '로그인', loginDate: '25-04-02' },
    { id: 5, userName: '정우성', companyName: '미래테크', deptName: '개발', email: 'woosung_dev@mirai.com', role: '관리자', isLockedOut: '잠김', loginDate: '25-04-04' },
    { id: 6, userName: '김하나', companyName: '엔젤푸드', deptName: '품질관리', email: 'hana_kim@angelfood.com', role: '유저', isLockedOut: '로그인', loginDate: '25-04-05' },
    { id: 7, userName: '최동혁', companyName: '스마트솔루션', deptName: '개발', email: 'donghyuk@smart.com', role: '관리자', isLockedOut: '로그인', loginDate: '25-04-01' },
    { id: 8, userName: '송지민', companyName: '에코리빙', deptName: '기획', email: 'jimin_song@eco.com', role: '유저', isLockedOut: '잠김', loginDate: '25-04-06' },
    { id: 9, userName: '한도윤', companyName: '코리아무역', deptName: '수출입', email: 'doyun_h@korea.com', role: '관리자', isLockedOut: '로그인', loginDate: '25-04-07' },
    { id: 10, userName: '유나리', companyName: '스타미디어', deptName: '홍보', email: 'nariyu@star.com', role: '유저', isLockedOut: '잠김', loginDate: '25-04-09'},
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