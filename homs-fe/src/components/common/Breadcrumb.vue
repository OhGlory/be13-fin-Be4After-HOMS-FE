<template>
    <nav aria-label="breadcrumb" class="text-lg sm:text-xl font-medium text-black px-3 py-3">
        <ol class="flex items-center space-x-1">
            <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path + index" class="flex items-center">
                <template v-if="index === 0 && crumb.meta.isHome">
                    <router-link :to="crumb.path" class="hover:text-orange-600 transition-colors">
                        <span class="sr-only">Go to Home</span>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z">
                            </path>
                        </svg>
                    </router-link>
                </template>
                <template v-else-if="index < breadcrumbs.length - 1">
                    <span class="mx-2 text-black ">/</span>
                    <router-link :to="crumb.path" class="hover:text-orange-600 transition-colors">{{ getCrumbName(crumb)
                    }}</router-link>
                </template>
                <template v-else>
                    <span class="mx-2 text-black ">/</span>
                    <span class="text-black" aria-current="page">{{ getCrumbName(crumb) }}</span>
                </template>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
const matched = route.matched;
const crumbs = [];

// 1. '홈' 항목 강제 추가
crumbs.push({
    path: '/',
    meta: { breadcrumb: '홈', isHome: true },
    params: {}
});

// 2. matched 배열을 순회하며 crumbs 구성
matched.forEach(record => {
    // 레이아웃 라우트(UserLayout, AdminLayout) 및 홈 라우트는 건너뛰기
    if (record.name === 'UserLayout' || record.name === 'AdminLayout' || record.path === '/') {
    return;
    }

    // 2-1. 그룹 이름 추가 (group meta가 있고, 아직 추가되지 않았다면)
    if (record.meta && record.meta.group) {
    const groupExists = crumbs.some(c => c.meta.breadcrumb === record.meta.group && c.meta.isGroup);
    if (!groupExists) {
        // 그룹의 'path'는 해당 그룹의 첫 번째 목록 페이지로 설정
        // 예를 들어 '주문 관리' 그룹은 '/orders'로 연결
        // 이 부분은 라우터 구조에 따라 유연하게 변경해야 합니다.
        // 현재는 'orders' 라우트의 path를 그대로 가져와 사용합니다.
        let groupPath = record.path.split('/').slice(0, -1).join('/') || '/'; // 예: "orders/list" -> "orders"
        if (groupPath === '') { // 최상위 그룹 (예: /admin, /orders)인 경우
            groupPath = `/${record.path.split('/')[0]}`;
        }
        // 특별히 정의된 그룹 경로가 있다면 사용 (필요시 추가)
        if (record.meta.group === '주문 관리') groupPath = '/orders';
        else if (record.meta.group === '클레임 관리') groupPath = '/claims';
        // ... (다른 그룹들도 여기에 추가)


        crumbs.push({
        path: groupPath, // 그룹의 루트 경로 (예: /orders)
        meta: { breadcrumb: record.meta.group, isGroup: true },
        params: {}
        });
    }
    }

    // 2-2. 현재 라우트의 breadcrumb 추가
    if (record.meta && record.meta.breadcrumb) {
    let currentPath = record.path;
    if (record.path.includes(':')) {
        Object.keys(route.params).forEach(key => {
        currentPath = currentPath.replace(`:${key}`, route.params[key]);
        });
    }

    crumbs.push({
        path: currentPath,
        meta: record.meta,
        params: route.params
    });
    }
});

// 중복되는 브레드스크럼 항목 제거
const uniqueCrumbs = [];
const seenIdentifiers = new Set(); // 경로 + 텍스트로 고유하게 식별
crumbs.forEach(crumb => {
    const crumbText = typeof crumb.meta.breadcrumb === 'function' ? crumb.meta.breadcrumb(crumb) : crumb.meta.breadcrumb;
    const identifier = `${crumb.path}-${crumbText}`; // 경로와 텍스트 조합으로 고유 ID 생성

    if (!seenIdentifiers.has(identifier)) {
    uniqueCrumbs.push(crumb);
    seenIdentifiers.add(identifier);
    }
});

return uniqueCrumbs;
});

const getCrumbName = (crumb) => {
if (typeof crumb.meta.breadcrumb === 'function') {
    return crumb.meta.breadcrumb(crumb);
}
return crumb.meta.breadcrumb;
};
</script>