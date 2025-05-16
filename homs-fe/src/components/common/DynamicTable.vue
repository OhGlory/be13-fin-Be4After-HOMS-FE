<template>
    <div>
        <div class="flex flex-col mt-2">
            <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-4 lg:px-8">
                <div
                    class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th v-if="showCheckbox"
                                    class="px-6 py-3 text-sm font-bold leading-4 tracking-wider text-left uppercase bg-gray-100 border-b border-gray-200">
                                    <input type="checkbox" @change="toggleAll" v-model="allSelected" />
                                </th>

                                <th v-for="column in columns" :key="column.key"
                                    class="px-6 py-3 text-center text-sm font-bold leading-4 tracking-wider uppercase bg-gray-100 border-b border-gray-200">
                                    {{ column.label }}
                                </th>
                                <th v-if="$slots.actions"
                                    class="px-6 py-3 text-center text-sm font-bold leading-4 tracking-wider uppercase bg-gray-100 border-b border-gray-200">
                                    {{ props.action }}
                                </th>
                            </tr>
                        </thead>

                        <tbody class="bg-white">
                            <tr v-for="item in items" :key="item.id" class=" hover:bg-gray-100">
                                <td v-if="showCheckbox" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <input type="checkbox" v-model="selectedItems" :value="item.id"
                                        @change="emitSelectedItems" />
                                </td>
                                <td v-for="column in columns" :key="column.key" @click="ditailPage(item.id)"
                                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <slot :name="`cell-${column.key}`" :item="item">{{ item[column.key] }}</slot>
                                </td>
                                <td v-if="$slots.actions" class="px-6 py-4 flex justify-center border-b border-gray-200 whitespace-nowrap">
                                    <slot name="actions" :item="item"></slot>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['selected']);

const selectedItems = ref([]);
const allSelected = ref(false);

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // 각 열의 정보를 담는 객체 배열
    // 예: [{ label: '순번', key: 'no' }, { label: '제목', key: 'title' }]
  },
  items: {
    type: Array,
    required: true,
    // 테이블 데이터를 담는 객체 배열
    // 각 객체의 키는 columns 배열의 key 값과 매칭되어야 합니다.
  },
  showCheckbox: {
    type: Boolean,
    // 체크박스 표시 여부
  },
  action: {
    type: String,
    // 액션 부분 헤더
  },
  ditailPageUrl: {
    type: String,
    // 상세 페이지 URL
  },
});

// 상세 페이지 이동
const ditailPage = (item) => {
  router.push({ name: route.name+'Detail', params: { id: item } });
};

// 전체 선택/해제 기능
const toggleAll = () => {
    if (allSelected.value) {
        selectedItems.value = props.items.map(item => item.id);
    } else {
        selectedItems.value = [];
    }
    emitSelectedItems();
};

// 전체 선택 상태 감시
watch(selectedItems, () => {
    allSelected.value = selectedItems.value.length === props.items.length;
});

// 선택된 아이템들을 부모 컴포넌트로 emit
const emitSelectedItems = () => {
    emit('selected', selectedItems.value);
};

</script>