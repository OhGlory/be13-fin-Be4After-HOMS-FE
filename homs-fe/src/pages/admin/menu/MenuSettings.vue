<template>
  <div>
    <!-- 제목 및 루트 추가 버튼 -->
    <div class="btn-title">
      <span>메뉴 관리</span>
      <button @click="addMenuRoot" class="btn-create-root"> 생성 </button>
    </div>

    <!-- DynamicTable -->
    <DynamicTable :columns="menusColumns" :items="flatMenus">
      <!-- 메뉴명 셀 -->
      <template #cell-menuName="{ item }">
        <div
          class="cell-menu" :style="{ paddingLeft: item.level * 20 + 'px' }">
          <span v-if="item.hasChildren && item.level === 0" @click.stop="toggleFolder(item)">
            {{ openState[item.menuId] ? '▼' : '▶' }}
          </span>
          <span v-else style="display: inline-block; width: 18px;"></span>

          <input v-model="item.menuName"/>
        </div>
      </template>

      <!-- 순번 셀 -->
      <template #cell-sortNo="{ item }">
        <div class="cell-sort">
          <input type="number" v-model.number="item.sortNo" min="1"/>
        </div>
      </template>

      <!-- 담당자 셀 (드롭다운) -->
      <template #cell-deptId="{ item }">
        <select v-model="item.deptId" class="dept-select">
          <option disabled value="">선택</option>
          <option v-for="opt in departmentOptions" :key="opt.value" :value="opt.label">
            {{ opt.label }}
          </option>
        </select>
      </template>

      <!-- 버튼 셀 -->
      <template #cell-button="{ item }">
        <div class="cell-buttons">
          <button
            v-if="item.hasChildren && item.level === 0"
            @click.stop="addMenuChild(item)"
            class="btn-create-child"
          >
            생성
          </button>
          <button @click.stop="updateMenu(item)" class="btn-update-child">
            수정
          </button>
          <button @click.stop="deleteMenu(item.menuId)" class="btn-delete-child">
            삭제
          </button>
        </div>
      </template>
    </DynamicTable>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import DynamicTable from "@/components/common/DynamicTable.vue";
import apiClient from "@/api";

// 메뉴 트리 및 평탄화 데이터
const menus = ref([]); // 트리 구조 데이터 관리 및 API 전송용
const flatMenus = ref([]); // 트리 구조 UI 표시용

// 트리 노드의 펼침 상태 저장
const openState = reactive({});

// 트리 평탄화
const flattenTree = (nodes, level = 0, arr = []) => {
  nodes.forEach((node) => {
    if (openState[node.menuId] === undefined)
      openState[node.menuId] = true;

    arr.push({
      ...node,
      level,
      hasChildren: node.children !== undefined,
    });

    if (node.children && openState[node.menuId]) {
      flattenTree(node.children, level + 1, arr);
    }
  });
  return arr;
};

// API 호출
const fetchData = async () => {
  try {
    const res = await apiClient.get("/admin/menu");
    if (res.status === 200) {
      menus.value = res.data.data;
    } else {
      menus.value = getSampleMenuTree();
    }
  } catch (e) {
    console.error(e);
    menus.value = getSampleMenuTree();
  }
};

// 샘플 메뉴 데이터
const getSampleMenuTree = () => [
  {
    menuId: 1,
    menuName: "주문 관리",
    sortNo: 1,
    deptId: "배송",
    children: [
      { menuId: 3, menuName: "주문 목록", sortNo: 1, deptId: "배송", children: [] },
      { menuId: 4, menuName: "클레임 목록", sortNo: 2, deptId: "구매", children: [] },
    ],
  },
  {
    menuId: 2,
    menuName: "상품 관리",
    sortNo: 2,
    deptId: "자재",
    children: [
      { menuId: 5, menuName: "상품 목록", sortNo: 1, deptId: "영업", children: [] },
      { menuId: 6, menuName: "카테고리 목록", sortNo: 2, deptId: "영업", children: [] },
    ],
  },
];

// 메뉴 변경 시 평탄화
watch(menus, (newVal) => {
  if (newVal) {
    flatMenus.value = flattenTree(newVal);
  }
});

// 초기 데이터 로딩
onMounted(() => {
  fetchData();
});

// 루트 메뉴 추가
const addMenuRoot = () => {
  const newId = Math.floor(Math.random() * 1000000);
  menus.value.push({
    menuId: newId,
    menuName: "새 루트 메뉴",
    sortNo: menus.value.length + 1,
    deptId: "",
    children: [],
  });
  flatMenus.value = flattenTree(menus.value);
};

// 자식 메뉴 추가
const addMenuChild = (item) => {
  item.children = item.children || [];
  const newId = Math.floor(Math.random() * 1000000);
  
  item.children.push({
    menuId: newId,
    menuName: "새 자식 메뉴",
    sortNo: item.children.length + 1,
    deptId: "",
    children: [],
  });
  flatMenus.value = flattenTree(menus.value);
};

// 메뉴 삭제
const deleteMenu = async (menuId) => {
  try {
    await apiClient.delete(`/admin/menu/delete/${menuId}`);
    fetchData();
  } catch (error) {
    alert(error.response.data.message);
  }
};

// 메뉴 수정
const updateMenu = async (menuId) => {
  try {
    await apiClient.delete(`/admin/menu/update/${menuId}`);
    fetchData();
  } catch (error) {
    alert(error.response.data.message);
  }
};

// 폴더 열기/닫기
const toggleFolder = (item) => {
  openState[item.menuId] = !openState[item.menuId];
  flatMenus.value = flattenTree(menus.value);
};

// 컬럼 정의
const menusColumns = [
  { label: "메뉴명", key: "menuName" },
  { label: "순번", key: "sortNo" },
  { label: "담당자", key: "deptId" },
  { label: "", key: "button" },
];

// 드롭다운 옵션
const departmentOptions = [
  { label: "배송", value: "1" },
  { label: "구매", value: "2" },
  { label: "영업", value: "3" },
  { label: "자재", value: "4" },
];

</script>

<style>
.btn-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  padding: 12px;
}

.cell-menu {
  cursor: pointer;
}

.cell-sort {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cell-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btn-create-root {
  background-color: #f97316;
  color: white;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-right: 8px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.btn-create-root:hover {
  background-color: #c2410c;
}

.btn-create-child {
  background-color: #f97316;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-create-child:hover {
  background-color: #c2410c;
}

.btn-update-child {
  background-color: #9ca3af;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-update-child:hover {
  background-color: #6b7280;
}

.btn-delete-child {
  background-color: #f43f5e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-delete-child:hover {
  background-color: #e11d48;
}

.dept-select {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>

<style>
.btn-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.cell-menu {
  cursor: pointer;
}

.cell-sort,
cell-deptId {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cell-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btn-create-root {
  background-color: #f97316;
  color: white;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-right: 8px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.btn-create-root:hover {
  background-color: #c2410c;
}

.btn-create-child {
  background-color: #f97316;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-create-child:hover {
  background-color: #c2410c;
}

.btn-update-child {
  background-color: #9ca3af;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-update-child:hover {
  background-color: #6b7280;
}

.btn-delete-child {
  background-color: #f43f5e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-delete-child:hover {
  background-color: #e11d48;
}
</style>