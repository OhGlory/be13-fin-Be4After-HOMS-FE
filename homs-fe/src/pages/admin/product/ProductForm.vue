<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>상품목록</span>
        </div>
        <div class="p-6 bg-white rounded-md shadow-md">
            <h4 class="text-xl font-bold mb-4">{{ isEditMode ? $t('btn.edit') : '추가' }}</h4>
            <form @submit.prevent="submitForm">
                <div class="flex gap-10">
                    <!-- 이미지 -->
                    <div class="mb-4 my-4 w-60">
                        <img v-if="productDetail?.imageUrl" :src="productDetail.imageUrl"
                            :alt="productDetail.productName || '제품 이미지'"
                            class="w-full max-h-96 object-contain rounded-md shadow-md" />
                        <div v-else
                            class="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md shadow-md">
                            <span class="text-gray-500">이미지 없음</span>
                        </div>
                        <div class="mt-10 flex justify-center">
                            <button @click="onSave"
                                class=" w-40 px-6 py-3 w-1/6 bg-orange-600 text-white font-bold  hover:bg-orange-700 transition">
                                업로드
                            </button>
                        </div>

                    </div>
                    <!-- 제품 정보 -->
                    <div>
                        <div class="mb-4">
                            <label for="productName" class="block text-sm font-medium text-gray-700">제품코드</label>
                            <input type="text" id="productName" :placeholder="'ex) 303'" v-model="productName"
                                class="w-30 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div class="mb-4">
                            <label for="categoryLevel1" class="block text-sm font-medium text-gray-700">분야</label>
                            <select id="categoryLevel1" v-model="selectedCategoryLevel1"
                                @change="loadSecondLevelCategories">
                                <option value="" disabled>선택하세요</option>
                                <option v-for="category in topLevelCategories" :key="category.categoryId"
                                    :value="category.categoryId">
                                    {{ category.categoryName }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label v-if="secondLevelCategories.length > 0" for="categoryLevel2"
                                class="block text-sm font-medium text-gray-700">분류</label>
                            <select v-if="secondLevelCategories.length > 0" id="categoryLevel2"
                                v-model="selectedCategoryLevel2" @change="loadThirdLevelCategories">
                                <option value="" disabled>선택하세요</option>
                                <option v-for="category in secondLevelCategories" :key="category.categoryId"
                                    :value="category.categoryId">
                                    {{ category.categoryName }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label v-if="thirdLevelCategories.length > 0" for="categoryLevel3"
                                class="block text-sm font-medium text-gray-700">제조 공정</label>
                            <select v-if="thirdLevelCategories.length > 0" id="categoryLevel3"
                                v-model="selectedCategoryLevel3">
                                <option value="" disabled>선택하세요</option>
                                <option v-for="category in thirdLevelCategories" :key="category.categoryId"
                                    :value="category.categoryId">
                                    {{ category.categoryName }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="productName" class="block text-sm font-medium text-gray-700">최소 수량</label>
                            <input type="text" id="productName" :placeholder="'ex) 10'"
                                class="w-30 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                    </div>
                    <!-- 적용 용도 / 제품 특징 -->
                    <div class="w-full">
                        <div class=" mb-4">
                            <label for="productUsage" class="block text-sm font-medium text-gray-700">적용 용도</label>
                            <textarea id="productUsage" :placeholder="$t('placeholder.content_input')"
                                v-model="productUsage"
                                class="w-[30rem] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-[5rem]"></textarea>
                        </div>
                        <div class="mb-4 my-4">
                            <label for="productFeature" class="block text-sm font-medium text-gray-700">제품 특징</label>
                            <textarea id="productFeature" :placeholder="$t('placeholder.content_input')"
                                v-model="productFeature"
                                class="w-[30rem] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-[5rem]"></textarea>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end">
                    <button type="submit"
                        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
                        {{ isEditMode ? $t('btn.edit') : $t('btn.save') }}
                    </button>
                    <button type="button" @click="goBack" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded
                    text-sm">
                        {{ $t('btn.cancel') }}
                    </button>
                </div>
            </form>

        </div>
    </div>
</template>


<script setup>
import apiClient from "@/api";
import {ref, watch, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const selectedLang = ref(locale.value === 'ko' ? 'KOR' : 'ENG')

const route = useRoute();
const router = useRouter();

// 수정용 데이터
const productsId = Number(route.query.productsId || "");
const productName = ref(route.query.productName || "");
const productUsage = ref(route.query.productUsage || "");
const productFeature = ref(route.query.productFeature || "");
const isEditMode = ref(!!route.query.productName);

// 데이터 속성 정의
const categoryData = ref([]);
const topLevelCategories = ref([]);
const secondLevelCategories = ref([]);
const thirdLevelCategories = ref([]);
const selectedCategoryLevel1 = ref(null);
const selectedCategoryLevel2 = ref(null);
const selectedCategoryLevel3 = ref(null);
const selectedCategoryId = ref(null);

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

const submitForm = async () => {

    if(selectedCategoryLevel3.value){
        selectedCategoryId.value = selectedCategoryLevel3.value
    }
    else if(selectedCategoryLevel2.value){
        selectedCategoryId.value = selectedCategoryLevel2.value
    }
    else{
        alert("분류를 선택해주세요!!");
        return 0;
    }

    const params = {
        productName: productName.value,
        productUsage: productUsage.value,
        productFeature: productFeature.value,
        categoryId: selectedCategoryId.value
    };

    try {
        if (isEditMode.value) {
            await apiClient.put(`/product/${productsId}`, params);
            alert(t('messages.updated_successfully'));
            router.push(`/products/`);
        } else {
            await apiClient.post("/product/", params);
            alert("상품이 추가되었습니다.");
            router.push(`/products/`);
        }
    } catch (error) {
        alert(error.response?.data.message || "알 수 없는 오류 발생");
    }
};

const goBack = () => {
    router.go(-1);
};

// 데이터 가져오는 함수
const fetchData = async () => {
    try {
        const response = await apiClient.get("/productCategory/");
        if (response.status === 200) {
            console.log(response.data.data);
            categoryData.value = response.data.data;
            topLevelCategories.value = [...categoryData.value].sort((a, b) => a.sortNo - b.sortNo);
        } else {
            alert(t('errors.fetch_data_failed'));
        }
    } catch (err) {
        console.error(t('errors.fetch_data_erro'), err);
    }
};

// 첫 번째 드롭다운 선택 시 두 번째 드롭다운 데이터 로딩
const loadSecondLevelCategories = () => {
  if (selectedCategoryLevel1.value) {
    const selectedTopLevelCategory = categoryData.value.find(
      (category) => category.categoryId === selectedCategoryLevel1.value
    );
    if (selectedTopLevelCategory && selectedTopLevelCategory.children) {
      secondLevelCategories.value = [...selectedTopLevelCategory.children].sort((a, b) => a.sortNo - b.sortNo);
      thirdLevelCategories.value = [];
      selectedCategoryLevel2.value = null;
      selectedCategoryLevel3.value = null;
    } else {
      secondLevelCategories.value = [];
      thirdLevelCategories.value = [];
      selectedCategoryLevel2.value = null;
      selectedCategoryLevel3.value = null;
    }
  } else {
    secondLevelCategories.value = [];
    thirdLevelCategories.value = [];
    selectedCategoryLevel2.value = null;
    selectedCategoryLevel3.value = null;
  }
};

// 두 번째 드롭다운 선택 시 세 번째 드롭다운 데이터 로딩
const loadThirdLevelCategories = () => {
  if (selectedCategoryLevel2.value) {
    const selectedSecondLevelCategory = secondLevelCategories.value.find(
      (category) => category.categoryId === selectedCategoryLevel2.value
    );
    if (selectedSecondLevelCategory && selectedSecondLevelCategory.children) {
      thirdLevelCategories.value = [...selectedSecondLevelCategory.children].sort((a, b) => a.sortNo - b.sortNo);
      selectedCategoryLevel3.value = null;
    } else {
      thirdLevelCategories.value = [];
      selectedCategoryLevel3.value = null;
    }
  } else {
    thirdLevelCategories.value = [];
    selectedCategoryLevel3.value = null;
  }
};


// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
    fetchData();
});

</script>
