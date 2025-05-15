<template>
    <div>
        <!-- 제목 -->
        <div class="text-3xl px-3 py-3">
            <span>{{ $t('title.notice') }}</span>
        </div>
        <div class="p-6 bg-white rounded-md shadow-md">
            <h4 class="text-xl font-bold mb-4">{{ isEditMode ? $t('btn.edit') : $t('btn.create') }}</h4>
            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label for="title" class="block text-sm font-medium text-gray-700">{{ $t('data.title') }}</label>
                    <input type="text" id="title" :placeholder="$t('placeholder.title_input')" v-model="title"
                        class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                <div class="mb-4 my-4">
                    <label for="content" class="block text-sm font-medium text-gray-700">{{ $t('data.content')
                    }}</label>
                    <textarea id="content" :placeholder="$t('placeholder.content_input')" v-model="content"
                        class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-[25rem]"></textarea>
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

const noticesId = Number(route.query.noticesId || "");
const title = ref(route.query.title || "");
const content = ref(route.query.content || "");
const isEditMode = ref(!!route.query.title);

// 선택한 언어를 localstage에 저장 이래야 전역으로 언어선택한거 알수 있음
watch(selectedLang, (newLang) =>{
    const langCode = newLang === 'KOR' ? 'ko' : 'en'
    locale.value = langCode
    localStorage.setItem('selectedLang', langCode)
})

const submitForm = async () => {
    const params = {
        title: title.value,
        content: content.value,
    };

    try {
        if (isEditMode.value) {
            await apiClient.put(`/notice/${noticesId}`, params);
            alert(t('messages.updated_successfully', { itemName: t('title.notice') }));
            router.push(`/notices/${noticesId}`);
        } else {
            await apiClient.post("/notice/", params);
            alert(t('messages.created_successfully', { itemName: t('title.notice') }));
            router.push(`/notices`);
        }
    } catch (error) {
        alert(error.response?.data.message || "알 수 없는 오류 발생");
    }
};

const goBack = () => {
    router.go(-1);
};
</script>
