<template>
    <div>
        <div class="flex flex-col mt-2">
            <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-4 lg:px-8">
                <div
                    class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th v-for="column in columns" :key="column.key"
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                                    {{ column.label }}
                                </th>
                                <th v-if="$slots.actions" class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
                            </tr>
                        </thead>

                        <tbody class="bg-white">
                            <tr v-for="item in items" :key="item.id">
                                <td v-for="column in columns" :key="column.key"
                                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <slot :name="`cell-${column.key}`" :item="item">{{ item[column.key] }}</slot>
                                </td>
                                <td v-if="$slots.actions" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
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
import { defineProps } from 'vue';

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
});
</script>