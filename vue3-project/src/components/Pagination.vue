<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li v-if="currentPage !== 1" class="page-item">
        <a style="cursor: pointer" class="page-link" @click="onClick(currentPage - 1)">
          Previous
        </a>
      </li>
      <li
        v-for="page in numberOfPages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <a style="cursor: pointer" class="page-link" @click="onClick(page)">{{ page }}</a>
      </li>
      <li v-if="numberOfPages !== currentPage" class="page-item">
        <a style="cursor: pointer" class="page-link" @click="onClick(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    numberOfPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:currentPage'],
  /**
   * 이 컴포넌트에서 필요한 값은 currentPage와 numberOfPages이며, 함수는 getTodos이다. 따라서 부모인 App.vue로 부터
   * props를 통해 받아와야한다. 그리고 페이지를 자식(현재 컴포넌트)에서 부모(App.vue)로 보내야하는데 emit을 통해 보낸다.
   */
  setup(_, { emit }) {
    const onClick = (page) => {
      if (typeof page !== 'number') return; // 잘못된 값 방지
      emit('update:currentPage', page);
    };

    return {
      onClick,
    };
  },
};
</script>

<style scoped>
/* active 클래스를 추가했을 때 스타일 적용 */
.page-item.active .page-link {
  background-color: #007bff; /* Bootstrap 기본 파란색 */
  color: white;
  font-weight: bold;
}
</style>
