<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>주문관리 > 주문목록 > 상세주문</span>
        </div>
        <!-- 배송 등 상세 정보 -->
        <div class="flex flex-wrap gap-x-8 gap-y-4 justify-between w-full pl-4 pr-4">
            <div class="flex flex-wrap gap-x-3 gap-y-4 w-full">
                <!-- 발주 번호 -->
                <div class="flex flex-col gap-1 w-full md:w-auto">
                    <label class="block text-gray-700 font-semibold">발주번호</label>
                    <div
                        class="w-fit aria-disabled:cursor-not-allowed outline-none focus:outline-none text-stone-800 dark:text-black placeholder:text-stone-600/60 ring-transparent border border-stone-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 pr-2 pl-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-stone-300 hover:ring-none focus:border-stone-400 focus:ring-none peer">
                        {{ orders.orderCode || '-' }}
                    </div>
                </div>
                <!-- 납품위치 (고정) -->
                <div v-if="authStore.isAdmin" class="flex flex-col gap-1 w-full md:w-auto">
                    <label class="block text-gray-700 font-semibold">납품위치</label>
                    <div
                        class="w-fit aria-disabled:cursor-not-allowed outline-none focus:outline-none text-stone-800 dark:text-black placeholder:text-stone-600/60 ring-transparent border border-stone-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 pr-2 pl-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-stone-300 hover:ring-none focus:border-stone-400 focus:ring-none peer">
                        {{ "서울" || '-' }} </div>
                </div>
                <!-- 납품위치 (수정) -->
                <div v-if="authStore.isUser" class="flex flex-col gap-1 w-full md:w-auto">
                    <label class="block text-gray-700 font-semibold">납품위치</label>
                    <select v-model="selectedDelivery"
                        class="select-box aria-disabled:cursor-not-allowed outline-none focus:outline-none text-stone-800 dark:text-black placeholder:text-stone-600/60 ring-transparent border border-stone-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 pr-4 pl-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-stone-300 hover:ring-none focus:border-stone-400 focus:ring-none peer">
                        <option disabled value="">선택</option>
                        <option v-for="option in deliveryOptions" :key="option.value" :value="option.value">{{
                            option.label }}
                        </option>
                    </select>
                </div>

                <!-- 주문날짜 -->
                <div class="flex flex-col gap-1 w-full md:w-auto">
                    <label class="block text-gray-700 font-semibold">주문날짜</label>
                    <div
                        class="w-fit aria-disabled:cursor-not-allowed outline-none focus:outline-none text-stone-800 dark:text-black placeholder:text-stone-600/60 ring-transparent border border-stone-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 pr-2 pl-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-stone-300 hover:ring-none focus:border-stone-400 focus:ring-none peer">
                        {{ new Date(orders.orderDate).toLocaleDateString() || '-' }}
                    </div>
                </div>
                <!-- 납기일 (고정) -->
                <div v-if="authStore.isAdmin" class="flex flex-col gap-1 w-full md:w-auto">
                    <label class="block text-gray-700 font-semibold">납기일</label>
                    <div
                        class="w-fit aria-disabled:cursor-not-allowed outline-none focus:outline-none text-stone-800 dark:text-black placeholder:text-stone-600/60 ring-transparent border border-stone-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 pr-2 pl-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-stone-300 hover:ring-none focus:border-stone-400 focus:ring-none peer">
                        {{ new Date(orders.dueDate).toLocaleDateString() || '-' }}
                    </div>
                </div>
                <!-- 납기일 (수정) -->
                <div v-if="authStore.isUser" class="flex flex-col gap-1 w-full md:w-auto">
                    <label for="dueDateInput" class="block text-gray-700 font-semibold">납기일</label>
                    <input type="date" id="dueDateInput" v-model="selectedDueDate"
                        class="w-fit outline-none focus:outline-none text-stone-800 dark:text-black placeholder:text-stone-600/60 ring-transparent border border-stone-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 px-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-stone-300 hover:ring-none focus:border-stone-400 focus:ring-none peer" />
                </div>
                <!-- 발주요청 버튼 (유저) -->
                <div v-if="authStore.isUser" class="flex items-end ml-auto">
                    <button @click="orderRequest()"
                        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm">
                        발주요청
                    </button>
                </div>
            </div>
        </div>
        <!-- 검색바 -->
        <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
            :userRole="authStore.isAdmin" />
        <!-- 엑셀 업로드 -->
        <input type="file" ref="excelFileInput" @change="excelUpload" style="display: none;" accept=".xlsx, .xls" />

        <!-- 테이블 -->
        <DynamicTable :columns="userColumns" :items="products" :showCheckbox="true" @selected="handleSelectedItems"
            @row-click="handleRowClick" uniqueKey="productId">
            <p>{{ item }}</p>
            <!-- 항목 상세 설정 -->
            <template #cell-id="{ item }">
                <strong>{{ item.produt.productId }}</strong>
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
            <template #cell-productQuantity="{ item }">
                <div v-if="item && item.productQuantity === null">데이터 없음</div>
                <div v-else-if="item && item.productQuantity !== undefined && !item.isEditing">{{ item.productQuantity
                    }}</div>
                <div v-else-if="item && item.productQuantity !== undefined && item.isEditing">
                    <input type="number"
                        class="rounded mr-2 border-1 border-gray-300 w-15 focus:border-orange-500 focus:outline-none"
                        min="1" max="9999" v-model.number="item.productQuantity" @click.stop @mousedown.stop />
                </div>
                <div v-else>데이터 오류</div>
            </template>
            <template #actions="{ item }">
                <div v-if="authStore.isUser">
                    <button @click="editBtn(item)"
                        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
                        {{ item.isEditing ? "완료" : $t("btn.edit") }}
                    </button>
                    <button @click="deleteBtn(item.productId)"
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
                        {{ $t("btn.del") }}
                    </button>
                </div>
            </template>
        </DynamicTable>

        <!-- 페이지 네비 -->
        <PageNav :currentPage="Number(currentPage)" :totalPages="Number(totalPages)" @set-page="handleSetPage">
        </PageNav>
        <!-- 모달 -->
        <ProductDetail :visible="showModal" :productId="Number(selectedId)" @close="showModal = false"></ProductDetail>
    </div>
</template>

<script setup>
import apiClient from "@/api";
import SearchBox from "@/components/common/SaerchBar.vue";
import DynamicTable from "@/components/common/DynamicTable.vue";
import PageNav from "@/components/common/PageNav.vue";
import ProductDetail from "@/components/common/modal/ProductDetail.vue";
import {ref, watch, onMounted, toRaw, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import { useAuthStore } from '@/states/auth';

const authStore = useAuthStore();

const {t, locale} = useI18n();
const selectedLang = ref(locale.value === "ko" ? "KOR" : "ENG");

const router = useRouter();
const route = useRoute();

const orderId = ref(route.query.orderId || "");

const showModal = ref(false); // 모달 상태 관리
const selectedId = ref(null); // 선택된 항목 ID

const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(0); // 총 페이지 수 상태 관리
const pageSize = ref(10); // 페이지당 항목 수 (고정값)

const selectedUserIds = ref([]); // 선택된 항목 ID

const searchQuery = ref(""); // 검색어
const selectOption = ref(""); // 검색 옵션

// input 요소에 접근하기 위한 ref
const excelFileInput = ref(null);

// 날짜 입력받을 ref
const editedDueDate = ref(''); // 초기값은 빈 문자열로 설정

// 버튼 클릭 시 파일 선택 다이얼로그를 띄우는 함수
const handleExcelUploadClick = () => {
  excelFileInput.value.click(); // 숨겨진 input 요소 클릭
};

// 배송 정보 더미데이터
const deliveryOptions = ref([
    {value: "서울", label: "서울"},
    {value: "경기", label: "경기"},
    {value: "인천", label: "인천"},
    {value: "부산", label: "부산"},
])

const selectedDelivery = ref('');
const selectedDueDate = ref('');

const orderRequest = async () => {
    if (selectedDelivery.value && selectedDueDate.value) {
        if(confirm("발주신청을 하시겠습니까?")){
            const dueDate = `${selectedDueDate.value}T00:00:00`;
            try{

                const params = {
                    dueDate: dueDate,
                    // deliveryLocation: selectedDelivery.value,
                };
                await apiClient.put(`/order/${orderId.value}/date`, params);
                alert("발주신청이 완료되었습니다!");
            } catch (error) {
                alert(error.response.data.message);
            }
        }
    } else{
        alert("납품 장소와 납품일자를 지정해주세요!");
    }
}

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
        label: "엑셀목록",
        color: "bg-gray-500 hover:bg-gray-700",
        action: () => excelDown(),
        allowedRoles: ["admin","user"],
    },
    {
        label: "엑셀주문",
        color: "bg-gray-500 hover:bg-gray-700",
        action: () => handleExcelUploadClick(),
        allowedRoles: ["user"],
    },
    {
        label: "상품목록",
        color: "bg-orange-500 hover:bg-orange-700",
        action: () => router.push({name: "UserProducts", query: {orderId: orderId.value}}),
        allowedRoles: ["user"],
    },
    {
        label: "일괄삭제",
        color: "bg-gray-500 hover:bg-gray-700",
        action: () => deleteItems(selectedUserIds),
        allowedRoles: ["user"],
    },
]);

// ------- 테이블 --------
const userColumns = ref([
    {label: "번호", key: "productId"},
    {label: "분야", key: "productDomain"},
    {label: "분류", key: "productCategory"},
    {label: "제품명", key: "productName"},
    {label: "최소단위", key: "productMinQuantity"},
    {label: "주문수량", key: "productQuantity"},
]);

const products = ref([
    {id: 1, categroy: "PO", categroy2: "LDPE", productName: "303", productMinQuantity: "10", inven: "9999"},
    {id: 2, categroy: "PO", categroy2: "LDPE", productName: "303", productMinQuantity: "10", inven: "9999"},
    {id: 3, categroy: "PO", categroy2: "LDPE", productName: "303", productMinQuantity: "10", inven: "9999"},
    {id: 4, categroy: "PO", categroy2: "LDPE", productName: "303", productMinQuantity: "10", inven: "9999"},
]);

const orders = ref([]);

const editBtn = async (item) => {
    if (item) {
        item.isEditing = !item.isEditing;
        if (item.isEditing === false) {
            await apiClient.put(`/orderitem/${orders.value.orderId}/renew/${item.productId}?quantity=${item.productQuantity}`);
        }
    }
};

// 주문 단일 취소
const deleteBtn = (productId) => {
    if (confirm(t("script.delete"))) {
        deletePostData([productId]);
    }
};

// 주문 일괄 취소
const deleteItems = async (selectedItems) => {
    if (selectedItems.value.length <= 0) {
        alert("항목을 선택해주세요!");
    } else if (confirm(selectedItems.value.length + "개의 항목을 정말로 삭제하시겠습니까?")) {
        const rowSelectedItems = toRaw(selectedItems.value);
        deletePostData(rowSelectedItems);
    }
    selectedItems.value = []; // 초기화
};

// 주문 취소 처리
const deletePostData = async (params) => {
    try {
        await apiClient.delete(`/orderitem/${orders.value.orderId}/out`, {
            params: {productIds: params}, // 리스트 데이터를 직접 전달
            // 쿼리 스트링 직접 변환
            paramsSerializer: (params) => {
                return params.productIds.map((id) => `productIds=${id}`).join("&"); // 배열을 올바르게 직렬화
            },
        });

        fetchData();
    } catch (error) {
        console.log(error);
        alert(error);
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
        const response = await apiClient.get(`/orderitem/${orderId.value}`, {params});
        if (response.status === 200) {
            console.log(response.data.message);
            console.log(response.data.data);
            products.value = response.data.data.map((item) => ({
                productId: item.product.productId,
                category: item.product.category,
                productName: item.product.productName,
                productMinQuantity: item.product.productMinQuantity,
                productQuantity: item.product.productQuantity,
                isEditing: false, // 수정 모드 초기화
            }));
            orders.value = response.data.data[0].order;
            /*
            .map(item => ({
                orderCode: item.order.orderCode,
                orderDate: item.order.orderDate,
                orderStatus: item.order.orderStatus,
                orderId: item.order.orderId,
                dueDate: item.order.dueDate,
                approved: item.order.approved,
                parentOrderId: item.order.parentOrderId,
                rejectReason: item.order.rejectReason
            }));
            */

            console.log(products.value);
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
    selectedId.value = item.productId; // 선택된 항목 ID 업데이트
    showModal.value = true;
};

// 엑셀 다운로드
const excelDown = async () => {
    try{
        const response = await apiClient.get(`/excel/download?type=ORDER&orderId=${orderId.value}`,{
            responseType: 'blob'
        });

        // Blob 데이터 가져오기
        const blob = new Blob([response.data], {type: response.headers['content-type'] || "application/octet-stream"});
        
        // 파일 이름 가져오기 (Content-Disposition 헤더에서 파싱)
        let filename = 'download.xlsx'; // 기본 파일 이름
        const contentDisposition = response.headers['content-disposition'];

        if (contentDisposition) {
            // filename*=UTF-8''... 형식 (RFC 5987) 처리
            const filenameStarMatch = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(contentDisposition);
            if (filenameStarMatch && filenameStarMatch[1]) {
                try {
                    filename = decodeURIComponent(filenameStarMatch[1].replace(/"/g, ''));
                } catch (e) {
                    console.warn("UTF-8 filename decoding failed, trying simple filename.");
                }
            } else {
                // filename="..." 또는 filename=... 형식 처리
                const filenameMatch = /filename="([^"]+)"|filename=([^;]+)/i.exec(contentDisposition);
                if (filenameMatch && (filenameMatch[1] || filenameMatch[2])) {
                    try {
                        filename = decodeURIComponent(filenameMatch[1] || filenameMatch[2]);
                    } catch (e) {
                        console.warn("Simple filename decoding failed, using default filename.");
                    }
                }
            }
        }

        // 임시 URL 생성
        const url = URL.createObjectURL(blob);
        
        // 가상 <a> 태그 생성 및 다운로드
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); // 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        
        // URL 해제
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }catch{
        console.error('파일 다운로드 실패:', error);
        alert("엑셀 다운로드 실패");
    }
    
}

// 엑셀 업로드
const excelUpload = async (event) => {
    const file = event.target.files[0]; // 선택된 첫 번째 파일 가져오기

    if (!file) {
        console.warn("파일이 선택되지 않았습니다.");
        return;
    }

    // FormData 객체 생성: 파일을 서버로 보낼 때 사용합니다.
    const formData = new FormData();
    formData.append("file", file); // 'file'은 서버에서 파일을 받을 때 사용할 필드 이름입니다.
    // 필요한 경우 다른 데이터도 추가할 수 있습니다.
    // formData.append("orderId", orderId.value);

    try {
        const response = await apiClient.post(`/excel/upload?orderId=${orderId.value}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수 헤더
            },
        });

        console.log("파일 업로드 성공:", response.data);
        alert("엑셀 파일이 성공적으로 업로드되었습니다!");

    } catch (error) {
        console.error("파일 업로드 실패:", error);
        if (error.response) {
            console.error("서버 응답 데이터:", error.response.data);
            alert(`엑셀 파일 업로드 실패: ${error.response.data.message || error.message}`);
        } else {
            alert(`엑셀 파일 업로드 실패: ${error.message}`);
        }
    } finally {
        // 업로드 후 input 파일 선택을 초기화하여 같은 파일 재선택 가능하게 함
        event.target.value = '';
        fetchData();
    }
}

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
    // selectedUserIds.value.length
};

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) => {
    const langCode = newLang === "KOR" ? "ko" : "en";
    locale.value = langCode;
    localStorage.setItem("selectedLang", langCode);
});
</script>
