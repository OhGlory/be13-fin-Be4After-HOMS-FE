<template>
  <!-- 페이징 버튼 -->
  <div class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
    <div class="flex mr-4 rounded">
      <a href="#" @click="prevPage()"
        class="px-3 py-2 ml-0 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 rounded-l hover:bg-indigo-500 hover:text-white"><span>Previous</span></a>
      <a href="#" v-for="page in totalPages" :key="page"
        :class="page === currentPage ? 'bg-indigo-500 text-white' : 'text-indigo-700'" @click="setPage(page)"
        class="px-3 py-2 leading-tight bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"><span>{{
          page }}</span></a>
      <a href="#" @click="nextPage"
        class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-gray-200 rounded-r hover:bg-indigo-500 hover:text-white"><span>Next</span></a>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNav",
  props: {
    // 현재 페이지 위치 (기본 1)
    currentPage: {
      type: Number,
      default: 1,
    },
    // 한 페이지에 나타낼 항목 수 (기본 10)
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    // 총 페이지 수
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ["set-page"], // 이벤트 정의 (부모에게 값을 전달)
  methods: {
    // 페이징 버튼 메소드
    setPage(page) {
      this.$emit("set-page", page);
    },
    // 페이징 뒤로 버튼
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("set-page", this.currentPage - 1);
      }
    },
    // 페이징 앞으로 버튼
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("set-page", this.currentPage + 1);
      }
    },
  },
};
</script>

<style>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.px-5 {
  padding-left: 1.25rem;
  /* 20px */
  padding-right: 1.25rem;
  /* 20px */
}

.py-5 {
  padding-top: 1.25rem;
  /* 20px */
  padding-bottom: 1.25rem;
  /* 20px */
}

.bg-white {
  background-color: #ffffff;
}

.border-t {
  border-top-width: 1px;
}

@media (min-width: 640px) {
  .xs\:flex-row {
    flex-direction: row;
  }
}

@media (min-width: 640px) {
  .xs\:justify-between {
    justify-content: space-between;
  }
}

.flex {
  display: flex;
}

.mr-4 {
  margin-right: 1rem;
  /* 16px */
}

.rounded {
  border-radius: 0.25rem;
  /* 4px */
}

.px-3 {
  padding-left: 0.75rem;
  /* 12px */
  padding-right: 0.75rem;
  /* 12px */
}

.py-2 {
  padding-top: 0.5rem;
  /* 8px */
  padding-bottom: 0.5rem;
  /* 8px */
}

.ml-0 {
  margin-left: 0px;
}

.leading-tight {
  line-height: 1.25;
  /* 20px */
}

.text-indigo-700 {
  color: #4f46e5;
}

.bg-white {
  background-color: #ffffff;
}

.border {
  border-width: 1px;
}

.border-r-0 {
  border-right-width: 0px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.rounded-l {
  border-top-left-radius: 0.25rem;
  /* 4px */
  border-bottom-left-radius: 0.25rem;
  /* 4px */
}

.hover\:bg-indigo-500:hover {
  background-color: #818cf8;
}

.hover\:text-white:hover {
  color: #ffffff;
}

.bg-indigo-500 {
  background-color: #818cf8;
}

.text-white {
  color: #ffffff;
}

.text-indigo-700 {
  color: #4f46e5;
}

.rounded-r {
  border-top-right-radius: 0.25rem;
  /* 4px */
  border-bottom-right-radius: 0.25rem;
  /* 4px */
}
</style>