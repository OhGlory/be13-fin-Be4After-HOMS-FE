<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>주문관리 > 주문목록</span>
        </div>
        <!-- 검색바 -->
        <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons" :userRole="isAdmin" />
        <!-- 테이블 -->
        <DynamicTable :columns="orderColumns" :items="orders" :showCheckbox="false" @selected="handleSelectedItems" @row-click="handleRowClick" uniqueKey="orderId">
            <!-- 항목 상세 설정 -->
            <template #cell-id="{item}">
                <strong>{{ item.orderId }}</strong>
            </template>
            <template #cell-orderDate="{item}">
                {{ new Date(item.orderDate).toLocaleDateString() }}
            </template>
            <template #cell-dueDate="{item}">
                {{ new Date(item.dueDate).toLocaleDateString() }}
            </template>
            <template #cell-approved="{item}">
                <strong v-if="item.approved === true">승인</strong>
                <strong v-else-if="item.approved === false">거부</strong>
                <strong v-else>미승인</strong>
            </template>
            <template #cell-productQuantity="{item}">
                <div v-if="item && item.productQuantity === null">데이터 없음</div>
                <div v-else-if="item && item.productQuantity !== undefined && !item.isEditing">{{ item.productQuantity }}</div>
                <div v-else-if="item && item.productQuantity !== undefined && item.isEditing">
                    <input
                        type="number"
                        class="rounded mr-2 border-1 border-gray-300 w-15 focus:border-orange-500 focus:outline-none"
                        min="1"
                        max="9999"
                        v-model.number="item.productQuantity"
                        @click.stop
                        @mousedown.stop
                    />
                </div>
                <div v-else>데이터 오류</div>
            </template>
            <template #actions="{item}">
                <div v-if="isAdmin">
                    <button @click="editBtn(item.editMode)" class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">거부</button>
                    <button @click="deleteBtn(item.productId)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">승인</button>
                </div>
                <div v-else>
                    <button v-if="item.approved !== true" @click="deleteBtn(item.orderId)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">취소</button>
                </div>
            </template>
        </DynamicTable>

        <!-- 페이지 네비 -->
        <PageNav :currentPage="Number(currentPage)" :totalPages="Number(totalPages)" @set-page="handleSetPage"> </PageNav>
    </div>
</template>

<script setup>
import apiClient from "@/api";
import SearchBox from "@/components/common/SaerchBar.vue";
import DynamicTable from "@/components/common/DynamicTable.vue";
import PageNav from "@/components/common/PageNav.vue";
import {ref, watch, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {userStore} from "@/states/user";
const isAdmin = userStore().isAdmin;

const {t, locale} = useI18n();
const selectedLang = ref(locale.value === "ko" ? "KOR" : "ENG");

const router = useRouter();
const route = useRoute();

const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(0); // 총 페이지 수 상태 관리
const pageSize = ref(10); // 페이지당 항목 수 (고정값)

const selectedUserIds = ref([]); // 선택된 항목 ID

const searchQuery = ref(""); // 검색어
const selectOption = ref(""); // 검색 옵션

// const orders = ref({});

// ------- 검색바 --------
const handleSearch = (searchData) => {
    searchQuery.value = searchData.searchQuery;
    selectOption.value = searchData.selectOption;
    pageSize.value = searchData.size;
    currentPage.value = 1;
    fetchData();
};
// 검색 필터 목록
const handleSelectOption = ref([
    {value: "productName", label: "제품명"},
    {value: "productDomain", label: "분야"},
    {value: "productCategory", label: "분류"},
]);
// 액션 버튼 정의
const actionButtons = ref([
    {
        label: "일괄승인",
        color: "bg-orange-500 hover:bg-orange-700",
        action: (item) => console.log("추가:", item),
        allowedRoles: ["admin", "editor"], // 이 버튼은 'admin' 또는 'editor'만 볼 수 있음
    },
    {
        label: "일괄제거",
        color: "bg-gray-500 hover:bg-gray-700",
        action: (item) => console.log("삭제:", item),
        allowedRoles: ["admin"], // 이 버튼은 'admin'만 볼 수 있음
    },
]);

// ------- 테이블 --------
const orderColumns = ref([
    {label: "순번", key: "orderId"},
    {label: "발주번호", key: "orderCode"},
    {label: "거래처명", key: "companyName"},
    {label: "납품장소", key: "deliveryName"},
    {label: "요청일", key: "orderDate"},
    {label: "납기일", key: "dueDate"},
    {label: "승인여부", key: "approved"},
]);

const orders = ref([
    {id: 1, orderCode: "H-04-23", companyName: "영광상사", deliveryName: "서울", orderDate: "25-04-02", settlementDate: "25-04-11"},
    {id: 2, orderCode: "H-04-23", companyName: "영광상사", deliveryName: "서울", orderDate: "25-04-02", settlementDate: "25-04-11"},
    {id: 3, orderCode: "H-04-23", companyName: "하이젠버그", deliveryName: "미국", orderDate: "25-04-02", settlementDate: "25-04-11"},
]);

const editBtn = async (item) => {
    if (item) {
        item.isEditing = !item.isEditing;
        if (item.isEditing === false) {
            await apiClient.put(`/orderitem/${orders.value.orderId}/renew/${item.productId}?quantity=${item.productQuantity}`);
        }
    }
};

const deleteBtn = async (orderId) => {
    if (confirm("주문을 취소하시겠습니까?")) {
        try {
            await apiClient.delete(`/order/${orderId}`);
            fetchData();
        } catch (error) {
            alert(error.response.data.message);
        }
    }
};

// 데이터 가져오는 함수
const fetchData = async () => {
    // 기본 요청 파라미터
    const params = {
        page: currentPage.value - 1, // 현재 페이지 번호 -1 (0 기반 인덱스)
        size: pageSize.value,
    };

    if (searchQuery.value && selectOption.value) {
        // selectOption 값이 key가 되고, searchQuery는 value가 됩니다.
        params[selectOption.value] = searchQuery.value;
    }

    try {
        const response = await apiClient.get("/order/");
        if (response.status === 200) {
            console.log(response.data.message);
            console.log(response.data.data);

            orders.value = response.data.data;

            console.log(orders.value);
            totalPages.value = response.data.data.totalPages; // 총 페이지 수 할당
        } else {
            alert(t("errors.fetch_data_failed"));
        }
    } catch (err) {
        console.error(t("errors.fetch_data_erro"), err);
    }
};

// 선택한 행에 대한 정보 처리
const handleRowClick = (item) => {
    console.log("선택된 행:", item.orderId);
    // /orders/list?orderId=14
    router.push({name: "OrderItemList", query: {orderId: item.orderId}});
};

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
    // 모달 상태를 localstorage에 넣어서 상태 관리
    const modalConfirmed = localStorage.getItem("modalConfirmed");
    if (modalConfirmed === "true") {
        showModal.value = false;
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
    console.log("선택된 아이템 ID:", selectedUserIds.value);
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
    if (confirm(selectedUserIds.value.length + "개의 항목을 정말로 삭제하시겠습니까?")) {
        alert("미구현!");
    }
};

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) => {
    const langCode = newLang === "KOR" ? "ko" : "en";
    locale.value = langCode;
    localStorage.setItem("selectedLang", langCode);
});
</script>
