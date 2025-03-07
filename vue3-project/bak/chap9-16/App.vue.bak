<template>
  <!--
      📌 v-show vs v-if 차이점
      - 특정 요소를 조건에 따라 표시하거나 숨길 때 `v-show` 또는 `v-if`를 사용함.
      
      ✅ `v-show`
      - 요소를 **항상 렌더링**하지만, CSS `display: none`을 사용하여 숨김 처리.
      - 토글이 자주 발생하는 경우 사용하면 성능상 이점이 있음.
  
      ✅ `v-if`
      - 요소가 **조건을 만족할 때만 렌더링**됨.
      - 한 번 렌더링된 후 제거되면 다시 렌더링할 때 초기화됨.
      - 조건이 **자주 변경되지 않는 경우**에 적합.
    -->
  <div>
    <h3>v-show 사용</h3>
    <div v-show="toggle">true</div>
    <div v-show="!toggle">false</div>
    <button @click="onToggle">Toggle</button>
  </div>

  <div>
    <h3>v-if 사용</h3>
    <div v-if="toggle">true</div>
    <div v-else>false</div>
    <button @click="onToggle">Toggle</button>
  </div>

  <div class="container">
    <h2>To-Do List</h2>

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

    <!-- 📌 할 일 목록이 없을 때 메시지 표시 -->
    <div v-if="!todos.length">추가된 Todo가 없습니다.</div>

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
          <input class="form-check-input" type="checkbox" v-model="todo.completed" />

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
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    // 📌 v-show / v-if 비교를 위한 토글 상태
    const toggle = ref(false);

    // 📌 입력 필드 에러 상태 (입력값이 비어 있을 경우 true)
    const hasError = ref(false);

    // 📌 새로운 할 일 입력 값 (문자열)
    const todo = ref('');

    // 📌 완료된 할 일 스타일 (인라인 스타일 적용용)
    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray',
    };

    // 📌 할 일 목록 (배열)
    const todos = ref([]);

    /**
     * @description `v-show` / `v-if` 상태 토글 함수
     * @details 버튼 클릭 시 `toggle` 값을 반전시켜 화면에서 요소 표시 여부 변경
     */
    const onToggle = () => {
      toggle.value = !toggle.value;
    };

    /**
     * @description 새로운 할 일을 추가하는 함수
     * @details
     * - `v-on:submit.prevent`를 사용하여 기본 폼 제출 동작(새로고침) 방지
     * - 입력값이 비어 있으면 에러 메시지를 표시하고 추가하지 않음
     * - 입력값이 존재하면 `todos` 배열에 새로운 항목 추가 (ID는 `Date.now()` 사용)
     * - 추가 후 입력 필드를 초기화하여 사용자 경험 향상
     */
    const onSubmit = () => {
      if (!todo.value.trim()) {
        hasError.value = true;
      } else {
        hasError.value = false;
        todos.value.push({
          id: Date.now(), // 유니크한 ID 값 생성
          subject: todo.value.trim(), // 입력된 값 저장
          completed: false, // 체크박스 선택 여부 (기본값: 미완료)
        });
        console.log(todos.value);

        // 📌 입력 필드 초기화 (추가 후 비우기)
        todo.value = '';
      }
    };

    /**
     * @description 할 일 목록에서 특정 항목 삭제
     * @details
     * - `index`를 사용하여 `todos` 배열에서 해당 항목을 제거
     * - `splice()`를 사용하여 배열에서 해당 인덱스 항목을 삭제
     */
    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    };

    return {
      toggle,
      hasError,
      todo,
      todoStyle,
      todos,
      onToggle,
      onSubmit,
      deleteTodo,
    };
  },
};
</script>

<style>
/* 📌 체크박스가 선택된 경우 적용될 스타일 */
.todo {
  color: gray;
  text-decoration: line-through;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}
</style>
