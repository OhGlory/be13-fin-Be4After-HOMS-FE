<template>
    <div>
        <!-- 제목 -->
        <div class="btn-title">
            <span>배송지 관리</span>
        </div>

        <!-- 검색바 -->
        <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" />

        <!-- DynamicTable -->
        <DynamicTable :columns="deliveryColumns" :items="delivery" :showCheckbox="false" />

        <DeliveryAddressModal
            :visible="showCheckModal"
            :data="selectedDelivery"
            :selectedCompanyId="selectedCompanyId"
            @confirm="confirmCheckTaxInvoice"
            @cancel="cancelCheckTaxInvoice"
        ></DeliveryAddressModal>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import SearchBox from "@/components/common/SaerchBar.vue";
import DynamicTable from "@/components/common/DynamicTable.vue";
import apiClient from "@/api";
import DeliveryAddressModal from "@/components/common/modal/DeliveryAddressModal.vue";

const delivery = ref([]);
const selectedCompanyId = ref(null);
const showCheckModal = ref(false);
const selectedDelivery = ref(null); // 선택된 항목

// ------- 검색바 --------
const handleSearch = (searchData) => {
    searchQuery.value = searchData.searchQuery;
    pageSize.value = searchData.size;
    currentPage.value = 1;
    fetchData();
};

// 검색 필터 목록
const handleSelectOption = ref([{value: "", label: "전체"}]);

const confirmCheckTaxInvoice = () => {
    showCheckModal.value = false;
    selectedDelivery.value = null;

    fetchData();
};

const cancelCheckTaxInvoice = () => {
    showCheckModal.value = false;
    selectedDelivery.value = null;
};

// 컬럼 정의
const deliveryColumns = [
    {label: "배송지 명", key: "deliveryName"},
    {label: "납품 장소", key: "streetAddress"},
    {label: "상세 주소", key: "detailedAddress"},
    {label: "", key: "button"},
];

// API 호출
const fetchData = async () => {
    try {
        const res = await apiClient.get(`deliveryAdd/`);

        if (res.status === 200) {
            delivery.value = res.data.data;
            console.log(delivery.value);
        }
    } catch (e) {
        console.error(e);
    }
};

// 초기 데이터 로딩
onMounted(async () => {
    await fetchData(); // companyId가 설정된 후에 호출
});
</script>
