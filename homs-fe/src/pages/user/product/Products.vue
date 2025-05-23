<template>
  <div>
    <!-- 제목 -->
    <div class="text-3xl px-3 py-3">
      <span>상품관리 > 상품목록</span>
    </div>
    <!-- 검색바 -->
    <SearchBox @search="handleSearch" :selectOptions="handleSelectOption" :buttons="actionButtons"
      :userRole="isAdmin" />
    <!-- 테이블 -->
    <DynamicTable :columns="userColumns" :items="users" :showCheckbox="true" @selected="handleSelectedItems"
      @row-click="handleRowClick" uniqueKey="productId">
      <!-- 항목 상세 설정 -->
      <template #cell-productId="{ item }">
        <strong>{{ item.productId }}</strong>
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
        <div v-if="item && item.productQuantity === null">
          데이터 없음
        </div>
        <div v-else-if="item && item.productQuantity !== undefined">
          {{ item.productQuantity }}
        </div>
        <div v-else>
          데이터 오류
        </div>
      </template>
      <template #actions="{ item }">
        <div v-if="isAdmin">
          <button @click="editBtn(item.productId)"
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
            {{ $t('btn.edit') }}
          </button>
          <button @click="deleteBtn(item.productId)"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm">
            {{ $t('btn.del') }}
          </button>
        </div>
        <div v-else>
          <input type="number"
            class="rounded mr-2 border-1 border-gray-300 w-24 focus:border-orange-500 focus:outline-none" min="1"
            max="9999" v-model.number="item.quantityToOrder" @mousedown.stop>
          <button @click="orderBtn(item.productId, item.quantityToOrder)"
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
            발주 추가
          </button>
        </div>
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
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { userStore } from '@/states/user';
const isAdmin = userStore().isAdmin;

const { t, locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

const router = useRouter();
const route = useRoute();

const orderId = ref(route.query.orderId || ""); // 추가 주문 여부

const showModal = ref(false); // 모달 상태 관리
const selectedId = ref(null); // 선택된 항목 ID

const currentPage = ref(1); // 현재 페이지 상태 관리
const totalPages = ref(0); // 총 페이지 수 상태 관리
const pageSize = ref(10); // 페이지당 항목 수 (고정값)

const selectedUserIds = ref([]); // 선택된 항목 ID

const searchQuery = ref(''); // 검색어
const selectOption = ref(''); // 검색 옵션

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
  { value: "productName", label: "제품명" },
  { value: 'productDomain', label: '분야' },
  { value: 'productCategory', label: '분류' },
]);
// 액션 버튼 정의
const actionButtons = ref([
  // 이 버튼은 'admin'만 볼 수 있음
  {
    label: t('btn.add'),
    color: "bg-orange-500 hover:bg-orange-700",
    action: () => router.push({name:"ProductForm"}),
    allowedRoles: ["admin"] 
  },
  {
    label: t('btn.del'),
    color: "bg-gray-500 hover:bg-gray-700",
    action: () => deleteItems(selectedUserIds.value.length),
    allowedRoles: ["admin"]
  },
  // 이 버튼은 'user'만 볼 수 있음
  {
    label: "일괄추가",
    color: "bg-orange-500 hover:bg-orange-700",
    action: () => router.push({name:"ProductForm"}),
    allowedRoles: ["user"]
  },
  {
    label: "발주목록",
    color: "bg-gray-500 hover:bg-gray-700",
    action: () => router.push({name:"ProductForm"}),
    allowedRoles: ["user"]
  },
]);

// ------- 테이블 --------
const userColumns = ref([
  { label: '번호', key: 'productId' },
  { label: '분야', key: 'productDomain' },
  { label: '분류', key: 'productCategory' },
  { label: '제품명', key: 'productName' },
  { label: '최소단위', key: 'productMinQuantity' },
  { label: '재고량', key: 'productQuantity' },
]);

const users = ref([
    { id: 1, categroy: 'PO', categroy2: 'LDPE', productName: '303', productMinQuantity: '10', inven: '9999'},
    { id: 2, categroy: 'PO', categroy2: 'LDPE', productName: '303', productMinQuantity: '10', inven: '9999'},
    { id: 3, categroy: 'PO', categroy2: 'LDPE', productName: '303', productMinQuantity: '10', inven: '9999'},
    { id: 4, categroy: 'PO', categroy2: 'LDPE', productName: '303', productMinQuantity: '10', inven: '9999'},
]);

const orderBtn = (productId,quantity) => {
  console.log(`상품 ID: ${productId}, 추가할 수량: ${quantity}`);
  
  orderData(productId,quantity);
}

const orderData = async (productId,quantity) => {
  if (confirm("상품을 주문목록에 추가하시겠습니까?")) {

    const params = {
        productId: productId,
        quantity: quantity
      }

    if (orderId.value){
      await apiClient.post(`/orderitem/${orderId.value}`,params)
      router.push({name:"OrderItemList", query: { orderId: orderId.value } })
    }else{
      console.log("새 주문 생성");
      const order = await apiClient.post("/order/")
      orderId.value = order.data.data.orderId

      await apiClient.post(`/orderitem/${order.data.data.orderId}`,params)
      router.push({name:"OrderItemList", query: { orderId: orderId.value } })
    }
  }
}


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
    const response = await apiClient.get(`/product/files/${productId}`);
    const files = response.data.data
    console.log(files);
    // 반복문으로 files에서 key값을 기준으로 value를 가져옴
    Object.keys(files).forEach(async key => {
      const value = files[key];
      if (value !== null && value !== undefined && value !== '') {
        // s3로 시작하는 key값의 value를 가져옴
        if (key.startsWith('s3')) {
          await apiClient.delete(`/files/delete?key=${value}`);
        }
      }
    });

    const response2 = await apiClient.delete(`/product/files/${productId}`);
    console.log(response2.data);

  } catch (error) {
    console.log("파일이 없습니다.");
  }

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

    if (searchQuery.value && selectOption.value) {
        // selectOption 값이 key가 되고, searchQuery는 value가 됩니다.
        params[selectOption.value] = searchQuery.value; 
    }

    try {
        const response = await apiClient.get("/product/", { params });
        if (response.status === 200) {
            console.log(response.data.data);
            users.value = response.data.data.content.map(item => ({
                ...item, // 기존 item의 모든 속성을 복사
                quantityToOrder: 1 // 각 상품마다 고유한 quantityToOrder 속성 추가 (기본값 1)
            })); // 응답 데이터 할당
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

// 다중 삭제
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