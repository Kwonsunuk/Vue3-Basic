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
    <div style="color: red">{{ error }}</div>

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
import axios from 'axios';
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

    //
    const error = ref('');

    /**
     * @description `v-show` / `v-if` 상태 토글 함수
     * @details 버튼 클릭 시 `toggle` 값을 반전시켜 화면에서 요소 표시 여부 변경
     */
    const onToggle = () => {
      toggle.value = !toggle.value;
    };

    /**
     * @description 특정 할 일의 완료 여부를 토글하는 함수
     * @details
     * - HTTP `PATCH` 요청을 통해 `completed` 상태를 업데이트.
     * - 성공적으로 반영되면 `todos` 배열에서 해당 상태 변경.
     */
    const toggleTodo = async (index) => {
      error.value = '';
      const { id } = todos.value[index]; // 이렇게 해야 id를 올바르게 가져옴
      console.log(id);
      try {
        await axios.patch(`http://localhost:3000/todos/${id}`, {
          completed: !todos.value[index].completed,
        });
        todos.value[index].completed = !todos.value[index].completed;
      } catch (err) {
        error.value = 'Something went wrong.';
        console.log(err);
      }
    };

    const searchText = ref('');
    // 📌 검색어 필터링 (computed)
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) => todo.subject.includes(searchText.value));
      }
      return todos.value;
    });

    /**
     * @description 새로운 할 일을 추가하는 함수 (비동기 요청)
     * @details JSON Server (`db.json`)을 이용한 비동기 API 요청.
     * - `TodoSimpleForm.vue`에서 `context.emit('add-todo', 데이터)` 실행 시 호출됨.
     * - REST API를 사용하여 json-server(DB)로 데이터를 저장.
     * - `axios.post()`를 이용해 POST 요청을 보내고, 성공 시 응답 데이터를 `todos` 배열에 추가.
     * - `try-catch`를 사용하여 에러를 핸들링.
     */
    const addTodo = async (todo) => {
      /**
       * 📌 비동기 요청 (Axios 사용)
       * - JSON Server (`db.json`)에 새로운 할 일 저장 요청.
       * - HTTP `POST` 요청을 사용하여 새로운 데이터를 DB에 추가.
       * - 요청을 보낼 때 `axios.post()`를 사용하며, 이는 비동기적으로 동작함.
       * - 서버에서 응답을 받을 때까지 코드 실행을 멈추고 기다리려면 `await`을 사용해야 함.
       * - 요청이 완료되면 `res.data`에 응답 데이터가 저장됨.
       */
      error.value = ''; // 기존 에러 초기화
      try {
        const res = await axios.post('http://localhost:3000/todos', {
          subject: todo.subject, // 할 일 제목
          completed: todo.completed, // 완료 여부 (기본값: false)
        });

        // 요청이 성공적으로 완료되면, 응답 데이터를 todos 배열에 추가
        todos.value.push(res.data);
      } catch (err) {
        // 요청이 실패하면 에러 로그를 출력하고 사용자에게 에러 메시지 표시
        console.log(err);
        error.value = 'Something went wrong.';
      }

      /**
       * 📌 `.then()` vs `async/await` 차이점
       *
       * ✅ `.then()` 방식 (Promise Chaining)
       * - `axios.post()` 요청이 성공하면 `.then(res => { ... })` 블록이 실행됨.
       * - 실패하면 `.catch(err => { ... })` 블록이 실행됨.
       * - 하지만 `.then().then().catch()` 같은 형태로 중첩될 경우 **콜백 지옥**이 발생할 수 있음.
       *
       * ✅ `async/await` 방식
       * - `await` 키워드를 사용하여 응답이 올 때까지 기다림.
       * - `try-catch`를 이용한 예외 처리가 가능하여 가독성이 좋음.
       * - 동기적인 코드 흐름처럼 보이기 때문에 **가독성이 향상**됨.
       *
       * 📌 `.then()` 방식 예제:
       * axios.post('http://localhost:3000/todos', { subject: todo.subject, completed: todo.completed })
       *   .then((res) => {
       *     error.value = '';
       *     todos.value.push(res.data);
       *   })
       *   .catch((err) => {
       *     console.log(err);
       *     error.value = 'Something went wrong.';
       *   });
       *
       * ✅ `async/await` 방식이 `.then()` 방식보다 가독성이 뛰어나므로 async/await을 사용함.
       */
    };

    /**
     * @description 할 일 목록을 서버에서 가져오는 함수
     * @details Axios `GET` 요청을 통해 할 일 목록을 불러옴.
     */
    const getTodos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/todos');
        todos.value = res.data;
        error.value = '';
        console.log(res.data);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
    };

    // 📌 컴포넌트가 마운트될 때 할 일 목록 가져오기
    getTodos();

    /**
     * @description 할 일 목록에서 특정 항목 삭제
     * @details `index`를 사용하여 `todos` 배열에서 해당 항목을 제거.
     * - `axios.delete()`를 이용해 해당 ID의 데이터를 서버에서 삭제.
     * - 성공적으로 삭제되면 `todos` 배열에서도 제거.
     */
    const deleteTodo = async (index) => {
      try {
        const { id } = todos.value[index];
        console.log(id);
        await axios.delete(`http://localhost:3000/todos/${id}`);
        todos.value.splice(index, 1);
        error.value = '';
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
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
      error,
      onToggle,
      toggleTodo,
      searchText,
      filteredTodos,
      addTodo,
      getTodos,
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
