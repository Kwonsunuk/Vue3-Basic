<template>
  <!--
        📌 v-for를 사용하여 목록을 동적으로 렌더링
        - 같은 요소를 반복해서 출력할 때 `v-for`을 사용함.
        - `:key` 속성을 사용하여 각 항목을 구별해야 함.
  
        ✅ `:key`를 설정하는 이유
        - Vue는 `key`를 기반으로 DOM을 효율적으로 업데이트함.
        - 고유한 `id`를 사용하면 불필요한 DOM 재렌더링을 방지하고 성능을 최적화할 수 있음.
      -->
  <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id">
    <div class="card-body p-2 d-flex align-items-center">
      <div class="form-check flex-grow-1">
        <!-- 📌 v-model을 사용하여 `todo.completed` 값 변경 -->
        <input
          class="form-check-input"
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(index)"
        />

        <!--
              ✅ 스타일 바인딩 (`v-bind:style`)
              - `todo.completed`가 `true`일 경우, `todoStyle` 적용
              - 인라인 스타일을 동적으로 변경해야 할 때 유용
            <label class="form-check-label" :style="todo.completed ? todoStyle : {}">
              {{ todo.subject }}
            </label>
            -->

        <!--
              ✅ 클래스 바인딩 (`v-bind:class`)
              - `todo.completed`가 `true`일 경우, `todo` 클래스 추가
              - CSS 클래스를 동적으로 변경할 때 유용
            -->
        <label class="form-check-label" :class="{ todo: todo.completed }">
          {{ todo.subject }}
        </label>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(index)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * 📌 props (부모 -> 자식 데이터 전달)
   * - 부모에서 자식으로 데이터를 전달하는 단방향 바인딩.
   * - 부모의 `todos` 배열을 그대로 받아와 렌더링함.
   * - `readonly` 속성을 가짐 (자식에서 props를 직접 변경하면 Vue 경고 발생).
   */
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  /**
   * 📌 emits (자식 -> 부모 데이터 전달)
   * - `toggle-todo`: 체크박스 변경 시 완료 상태 토글.
   * - `delete-todo`: 삭제 버튼 클릭 시 특정 할 일 제거.
   */
  emits: ['toggle-todo', 'delete-todo'],
  setup(props, { emit }) {
    // 완료 상태 토글
    const toggleTodo = (index) => {
      emit('toggle-todo', index);
    };

    // 할 일 삭제
    const deleteTodo = (index) => {
      emit('delete-todo', index);
    };

    return {
      toggleTodo,
      deleteTodo,
    };
  },
};
</script>

<style></style>
