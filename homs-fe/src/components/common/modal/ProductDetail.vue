<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-gray-900 opacity-60"></div>
        <div class="relative bg-white shadow-lg w-2xl max-w-5xl text-left z-10 pb-10">
            <div class="flex justify-end bg-slate-700 text-xl font-semibold mb-2 p-2">
                <img :src="xmark" alt="엑스마크" class="w-5 h-5 cursor-pointer" @click="onClose">
            </div>
            <div class="p-6">
                <div class="flex items-center">
                    <p class="mb-6 text-gray-700 text-3xl font-extrabold">
                        제품 상세 정보
                    </p>
                    <div class="ml-auto">
                        <button v-if="productFiles?.s3Msds" @click="downloadFile(productFiles.s3Msds)"
                            class=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
                            MSDS
                        </button>
                        <button v-if="productFiles?.s3Tds1" @click="downloadFile(productFiles.s3Tds1)"
                            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">
                            TDS
                        </button>
                    </div>
                </div>

                <div class="mb-8 flex">
                    <img v-if="productFiles?.s3Image" :src="productFiles.s3Image"
                        :alt="productFiles.s3Image || '제품 이미지'"
                        class="w-full h-48 object-contain rounded-md shadow-md" />
                    <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md shadow-md">
                        <span class="text-gray-500">이미지 없음</span>
                    </div>
                    <div class="ml-8 w-full">
                        <label class="block text-gray-700 font-semibold mb-1">제품명</label>
                        <div class="mb-5 border border-gray-300 rounded-md py-2 px-3 text-gray-800">
                            {{ productDetail?.productName || '-' }}
                        </div>
                        <label class="block text-gray-700 font-semibold mb-1">제조공정</label>
                        <div class="border border-gray-300 rounded-md py-2 px-3 text-gray-800">
                            {{ productDetail?.category.manufacturingProcess || '-' }}
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-1">제품 특징</label>
                        <div class="border border-gray-300 rounded-md py-2 px-3 text-gray-800 whitespace-pre-line">
                            {{ productDetail?.productFeature || '-' }}
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-1">적용 용도</label>
                        <div class="border border-gray-300 rounded-md py-2 px-3 text-gray-800 whitespace-pre-line">
                            {{ productDetail?.productUsage || '-' }}
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-8">
                    <button @click="onClose"
                        class="px-6 py-3 w-1/6 bg-slate-500 text-white font-bold hover:bg-slate-600 transition">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import xmark from '@/assets/xmark.svg'
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import apiClient from '@/api';

const { t } = useI18n();

// `defineProps()`를 사용하여 props를 올바르게 선언
const props = defineProps({
    visible: Boolean,
    productId: {
        type: Number,
        default: () => ({})
    },
});

const emit = defineEmits(['close']);

function onClose() {
    emit('close');
}

const productDetail = ref(null);
const productFiles = ref(null);
const basePath = import.meta.env.VITE_API_URL;

// 데이터 가져오는 함수
const fetchData = async (productId) => {
    if (!productId) return; // productId가 없으면 데이터 로드 안함
    try {
        const response = await apiClient.get(`/product/${productId}`);
        if (response.status === 200) {
            productDetail.value = response.data.data;
        } else {
            alert(t('errors.fetch_data_failed'));
        }
    } catch (err) {
        console.error(t('errors.fetch_data_error'), err);
    }

    try {
        const response = await apiClient.get(`/product/files/${productId}`);
        if (response.status === 200) {
            console.log(response.data.data);
            productFiles.value = response.data.data;

            if(productFiles.value.s3Image){
                productFiles.value.s3Image = basePath+`/files/view?key=${productFiles.value.s3Image}`
            }
        } else {
            alert(t('errors.fetch_data_failed'));
        }
    } catch (err) {
        console.error(t('errors.fetch_data_error'), err);
        productFiles.value = null;
    }
};

// 모달이 열릴 때 감지해서 데이터 로딩
watch(() => props.visible, (newVisible) => {
    if (newVisible && props.productId) {
        fetchData(props.productId);
    } else {
        productDetail.value = null;
    }
});

// 파일 다운로드
const downloadFile = (fileKey) => {
    if (!fileKey) {
        alert("다운로드할 파일이 없습니다.");
        return;
    }

    // 백엔드 다운로드 API의 전체 URL을 구성합니다.
    // 'fileKey'는 MSDS나 TDS 파일의 S3 키(예: "msds/example.pdf")가 될 것입니다.
    // 백엔드 API가 /api/download?key={fileKey} 이런 형태라고 가정합니다.
    const downloadUrl = basePath+`/files/download?key=${(fileKey)}`;
    
    // 새 탭에서 열어 다운로드 시작
    // 대부분의 경우 브라우저가 자동으로 다운로드를 처리합니다.
    window.open(downloadUrl, '_blank');
};

onMounted(() => {
    if (props.visible && props.product.id) {
        fetchData(props.product.id);
    }
});
</script>