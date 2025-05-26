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
                                    class="px-6 py-3 text-sm font-bold leading-4 tracking-wider text-left uppercase bg-gray-100 border-b border-gray-200">
                                    {{ column.label }}
                                </th>
                                <th v-if="$slots.actions"
                                    class="px-6 py-3 text-sm font-bold leading-4 tracking-wider text-left uppercase bg-gray-100 border-b border-gray-200">
                                    {{ props.action }}
                                </th>
                            </tr>
                        </thead>

                        <tbody class="bg-white">
                            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-100 cursor-pointer">
                                <td v-if="showCheckbox" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <input type="checkbox" :checked="selectedItems.includes(item[props.uniqueKey])"
                                        @change="toggleIndividualCheckbox(item)" @click.stop />
                                </td>
                                <td v-for="column in columns" :key="column.key" @click="$emit('row-click', item)"
                                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <slot :name="`cell-${column.key}`" :item="item">{{ item[column.key] }}</slot>
                                </td>
                                <td v-if="$slots.actions"
                                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-right">
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
import { ref, watch,defineProps } from 'vue';
import { defineEmits } from 'vue';

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
  uniqueKey: {
        type: String,
        default: 'id'
    }
});

const emit = defineEmits(['selected', 'row-click']);

const selectedItems = ref([]);
const allSelected = ref(false);

// 전체 선택/해제 기능
const toggleAll = () => {
    if (allSelected.value) {
        selectedItems.value = props.items.map(item => item[props.uniqueKey]);
    } else {
        selectedItems.value = [];
    }
    emitSelectedItems();
};

const toggleIndividualCheckbox = (item) => {
    const itemId = item[props.uniqueKey]; // uniqueKey 사용
    const index = selectedItems.value.indexOf(itemId);

    if (index === -1) {
        selectedItems.value.push(itemId);
    } else {
        selectedItems.value.splice(index, 1);
    }
    emitSelectedItems(); // selectedItems 변경 후 emit
};

const emitSelectedItems = () => {
    emit('selected', selectedItems.value);
};

// 전체 선택 상태 감시
watch(selectedItems, () => {
    allSelected.value = props.items.length > 0 && selectedItems.value.length === props.items.length;
    if (props.items.length === 0) {
            allSelected.value = false;
        }
    },{ deep: true });

// props.items가 변경될 때 (예: 페이지 이동, 검색 결과 변경 등) selectedItems 동기화 및 allSelected 재계산
watch(() => props.items, (newItems) => {
    // 새 items 배열에 포함되지 않는 기존 선택 항목은 selectedItems에서 제거
    selectedItems.value = selectedItems.value.filter(id =>
        newItems.some(item => item[props.uniqueKey] === id)
    );
    // items가 변경되면 allSelected 상태도 재계산
    allSelected.value = newItems.length > 0 && selectedItems.value.length === newItems.length;

    // 만약 새 items가 비어있으면 allSelected도 false로
    if (newItems.length === 0) {
        allSelected.value = false;
    }
}, { deep: true });

</script>