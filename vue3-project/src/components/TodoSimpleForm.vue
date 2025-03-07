<template>
  <!--
        📌 Form을 사용한 입력 필드
        - `v-on:submit.prevent`를 사용하여 기본 폼 제출 시 페이지 새로고침을 방지함.
        - 주요 이벤트 수정자(Event Modifiers):
          - `.stop` → 이벤트 전파 중단 (`event.stopPropagation()`)
          - `.prevent` → 기본 동작 방지 (`event.preventDefault()`)
          - `.capture` → 캡처링 단계에서 이벤트 실행
          - `.self` → 이벤트가 해당 요소에서 발생한 경우에만 실행
          - `.once` → 한 번만 실행
          - `.passive` → `event.preventDefault()`를 호출하지 않음
      -->
  <form @submit.prevent="onSubmit">
    <div class="d-flex">
      <div class="flex-grow-1 mr-2">
        <input class="form-control" type="text" v-model="todo" placeholder="Type new to-do" />
      </div>
      <div>
        <button class="btn btn-primary" type="submit">Add</button>
      </div>
    </div>
    <!-- 📌 입력값이 비어 있을 경우 에러 메시지 표시 -->
    <div v-show="hasError" class="error-message">This field cannot be empty</div>
  </form>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['add-todo'],
  /**
   * 📌 자식 컴포넌트에서 부모 컴포넌트로 데이터를 전달할 때 `context.emit()` 사용.
   * - `props`는 부모 → 자식 데이터 전달할 때 사용.
   * - `emit`은 자식 → 부모 데이터 전달할 때 사용.
   */
  setup(props, { emit }) {
    // 📌 입력 필드 에러 상태 (입력값이 비어 있을 경우 true)
    const hasError = ref(false);

    // 📌 새로운 할 일 입력 값 (문자열)
    const todo = ref('');

    /**
     * 📌 새로운 할 일을 부모 컴포넌트로 전달하는 함수
     * - 입력값이 비어 있으면 에러 메시지 출력.
     * - 입력값이 존재하면 `context.emit('add-todo', 데이터)`를 통해 부모에게 전달.
     */
    const onSubmit = () => {
      if (!todo.value.trim()) {
        hasError.value = true;
      } else {
        emit('add-todo', {
          id: Date.now(), // 유니크한 ID 값 생성
          subject: todo.value.trim(), // 입력된 값 저장
          completed: false, // 체크박스 선택 여부 (기본값: 미완료)
        });
        hasError.value = false;
        // 📌 입력 필드 초기화 (추가 후 비우기)
        todo.value = '';
      }
    };

    return {
      hasError,
      todo,
      onSubmit,
    };
  },
};
</script>
