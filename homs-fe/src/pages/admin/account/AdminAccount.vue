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
    <DynamicTable :columns="userColumns" :items="users" :showCheckbox="false" :page="currentPage" :pageSize="pageSize">
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/states/auth';

const router = useRouter();
const authStore = useAuthStore();
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
]);

const getApiPath = (basePath) => {
  return authStore.isAdmin ? `/admin${basePath}` : basePath;
};


const userData = async() => {
  const response = await apiClient.get("/admin/user");
  const data = response.data.data;
  console.log("data: ",data);
  
  const usersWithCompanyName = await Promise.all(
      data.map(async (item) => {

        return {
          id: item.userId,
          userName: item.managerName,
          companyName: item.companyName,
          deptName: item.deptName,
          email: item.managerEmail,
          role: "관리자",
          isLockedOut: "로그인",
          loginDate: "-",
        };
      })
    );

    users.value = usersWithCompanyName;
}

const editUser = (user) => {
  console.log('수정:', user.id);
  router.push({ name: 'AccountDetail', params: { id: user.id } })
};

const deleteUser = async (user) => {
  console.log('삭제:', user);
  try{
    await apiClient.delete(getApiPath(`/user/${user.id}`));
    alert("사용자가 삭제 되었습니다.")
  }catch(error){
    alert("삭제 실패 하였습니다.",error)
  }
};

// ------- 페이지네이션 --------
const handleSetPage = (page) => {
  console.log('페이지 변경 요청:', page);
  currentPage.value = page;
  // 여기서 해당 페이지의 데이터를 불러오는 로직 등을 수행해야 합니다.
};

onMounted(() => {
  userData();
})

</script>