<template>
    <div>
        <SearchBox @search="handleSearch" />
        <DynamicTable :columns="userColumns" :items="users">
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
                <button @click="editUser(item)">수정</button>
                <button @click="deleteUser(item)">삭제</button>
            </template>
        </DynamicTable>
    </div>
</template>

<script setup>
import SearchBox from '@/components/common/SaerchBar.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import { ref } from 'vue';

const searchResult = ref(null);

const handleSearch = (searchData) => {
  console.log('검색 데이터:', searchData);
  // 여기서 검색 로직을 처리하거나 부모 컴포넌트로 데이터를 전달할 수 있습니다.
  searchResult.value = searchData;
};

const userColumns = ref([
  { label: '순번', key: 'id' },
  { label: '제목', key: 'title' },
  { label: '등록일', key: 'createdAt' },
]);

const users = ref([
  { id: 1, title: '한화 솔루션 케미칼에서 알려드립니다.', createdAt: '25-04-23' },
  { id: 2, title: '아무말이나 더미데이터로 넣어봅시다!', createdAt: '25-04-24' },
]);

const editUser = (user) => {
  console.log('수정:', user);
};

const deleteUser = (user) => {
  console.log('삭제:', user);
};

</script>