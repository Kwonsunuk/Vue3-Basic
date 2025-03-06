<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="d-flex">
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
    </div>
    <div>
      <!--
      📌 computed와 method 차이점
      - computed는 캐싱(저장)이 가능하여 같은 연산을 반복하지 않음.
      - method는 호출될 때마다 새롭게 계산함.
      - computed는 매개변수를 받을 수 없지만, method는 매개변수를 받을 수 있음.
    -->
      <h4>count: {{ count }}</h4>
      <h4>doubleCountComputed: {{ doubleCountComputed }}</h4>
      <h4>doubleCountMethod: {{ doubleCountMethod() }}</h4>
      <button @click="count++">Add one</button>
    </div>
  </div>

  <div class="container">
    <h2>To-Do List</h2>

    <input class="form-control" type="text" v-model="searchText" placeholder="Search" />
    <hr />
    <!-- 
      📌 자식 컴포넌트에서 부모 컴포넌트로 데이터 전달
      - `TodoSimpleForm` 컴포넌트의 `onSubmit` 함수에서 `context.emit('add-todo', 데이터)` 실행 시
      - 부모 컴포넌트의 `addTodo` 함수가 호출되며, `todos` 배열에 새로운 데이터가 추가됨.
    -->
    <TodoSimpleForm @add-todo="addTodo" />

    <!-- 📌 할 일 목록이 없을 때 메시지 표시 -->
    <div v-if="!filteredTodos.length">There is nothing to display.</div>

    <!-- 
      📌 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달
      - `todos` 배열을 `TodoList`에 전달하여 리스트 출력.
      - 자식에서 `toggle-todo` 또는 `delete-todo` 이벤트 발생 시, 부모에서 이를 처리함.
    -->
    <TodoList :todos="filteredTodos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';

export default {
  components: {
    TodoSimpleForm,
    TodoList,
  },
  setup() {
    // 📌 v-show / v-if 비교를 위한 토글 상태
    const toggle = ref(false);

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
     * @description 완료 상태 토글 함수
     * @details 특정 할 일의 완료 여부를 반전시킴.
     */
    const toggleTodo = (index) => {
      todos.value[index].completed = !todos.value[index].completed;
    };

    const searchText = ref('');
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) => {
          return todo.subject.includes(searchText.value);
        });
      }
      return todos.value;
    });

    /**
     * @description 새로운 할 일을 추가하는 함수
     * @details
     * - `TodoSimpleForm.vue`에서 `context.emit('add-todo', 데이터)` 실행 시 호출됨.
     */
    const addTodo = (todo) => {
      todos.value.push(todo);
    };

    /**
     * @description 할 일 목록에서 특정 항목 삭제
     * @details `index`를 사용하여 `todos` 배열에서 해당 항목을 제거.
     */
    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    };

    // 📌 숫자 값 (count)
    const count = ref(1);

    // 📌 computed 사용 - 캐싱됨
    const doubleCountComputed = computed(() => count.value * 2);

    // 📌 method 사용 - 호출될 때마다 연산 수행
    const doubleCountMethod = () => count.value * 2;

    return {
      toggle,
      todos,
      onToggle,
      toggleTodo,
      searchText,
      filteredTodos,
      addTodo,
      deleteTodo,
      count,
      doubleCountComputed,
      doubleCountMethod,
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
