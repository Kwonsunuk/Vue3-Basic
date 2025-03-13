<template>
  <!-- 
        📌 재사용 가능한 리스트 컴포넌트
        - `v-for`을 사용하여 `items` 배열을 반복 렌더링.
        - `slot`을 사용하여 부모 컴포넌트에서 각 항목을 원하는 방식으로 렌더링할 수 있도록 함.
        - Scoped Slot을 활용하여 `item`, `index` 값을 부모로 전달.
    -->
  <div class="card mt-2" v-for="(item, index) in items" :key="item.id">
    <slot :item="item" :index="index"></slot>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style></style>
