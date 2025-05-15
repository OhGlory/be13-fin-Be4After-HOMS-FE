<template>
    <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h4 class="text-xl font-bold mb-4">{{ isEditMode ? "공지사항 수정" : "공지사항 작성" }}</h4>
        <form @submit.prevent="submitForm">
            <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-700">제목</label>
                <input type="text" id="title" placeholder="제목을 입력하세요" v-model="title"
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="mb-4">
                <label for="content" class="block text-sm font-medium text-gray-700">내용</label>
                <textarea id="content" placeholder="내용을 입력하세요" v-model="content"
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <hr class="my-4" />

            <button type="submit"
                class="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition">
                {{ isEditMode ? "수정" : "저장" }}
            </button>
        </form>
    </div>
</template>


<script setup>
import apiClient from "@/api";
import {ref, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";

const route = useRoute();
const router = useRouter();

const qnaId = Number(route.query.id || "");
const title = ref(route.query.title || "");
const content = ref(route.query.content || "");
const isEditMode = ref(!!route.query.title);

const submitForm = async () => {
    const params = {
        title: title.value,
        content: content.value,
    };

    // try {
    //     if (isEditMode.value) {
    //         // ?parentId=1
    //         await apiClient.put(`/qna/${qnaId}`, params);
    //         alert(" 공지사항이 수정되었습니다.");
    //         router.push(`/qna/${qnaId}`);
    //     } else {
    //         const response = await apiClient.post("/qna", params);
    //         alert("공지사항이 생성되었습니다.");
    //         router.push(`/qna`);
    //     }
    // } catch (error) {
    //     alert(error.response?.data.message || "알 수 없는 오류 발생");
    // }
};
</script>
