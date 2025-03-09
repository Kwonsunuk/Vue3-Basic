<template>
  <div class="d-flex align-items-center justify-content-center">
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

    <!--
      📌 검색 입력 필드
      - `v-model`을 사용하여 `searchText` 상태와 바인딩.
      - `@keyup.enter`를 이용해 사용자가 Enter 키를 입력하면 `searchTodo()` 실행.
    -->
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />
    <!-- 
      📌 자식 컴포넌트에서 부모 컴포넌트로 데이터 전달
      - `TodoSimpleForm` 컴포넌트의 `onSubmit` 함수에서 `context.emit('add-todo', 데이터)` 실행 시
      - 부모 컴포넌트의 `addTodo` 함수가 호출되며, `todos` 배열에 새로운 데이터가 추가됨.
    -->
    <TodoSimpleForm @add-todo="addTodo" />
    <div style="color: red">{{ error }}</div>

    <!-- 📌 할 일 목록이 없을 때 메시지 표시 -->
    <div v-if="!todos.length">There is nothing to display.</div>

    <!-- 
      📌 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달
      - `todos` 배열을 `TodoList`에 전달하여 리스트 출력.
      - 자식에서 `toggle-todo` 또는 `delete-todo` 이벤트 발생 시, 부모에서 이를 처리함.
    -->
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />

    <!--
      📌 페이지네이션 UI
      - 현재 페이지(`currentPage`)가 1이 아니면 "Previous" 버튼 활성화.
      - `v-for`를 사용하여 페이지 번호를 동적으로 생성.
      - 현재 페이지와 일치하는 페이지 번호에 `active` 클래스 적용.
    -->
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li v-if="currentPage !== 1" class="page-item">
          <a style="cursor: pointer" class="page-link" @click="getTodos(currentPage - 1)">
            Previous
          </a>
        </li>
        <li
          v-for="page in numberOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''"
        >
          <a style="cursor: pointer" class="page-link" @click="getTodos(page)">{{ page }}</a>
        </li>
        <li v-if="numberOfPages !== currentPage" class="page-item">
          <a style="cursor: pointer" class="page-link" @click="getTodos(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';

export default {
  components: {
    TodoSimpleForm,
    TodoList,
  },
  setup() {
    // 📌 할 일 목록 (배열)
    const todos = ref([]);

    const error = ref('');

    // 📌 페이지네이션 관련 상태
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);

    const searchText = ref('');

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

    /**
     * @description 할 일 목록을 서버에서 가져오는 함수
     * @details
     * - Axios `GET` 요청을 통해 `todos` 데이터를 가져옴.
     * - `x-total-count`를 사용해 전체 할 일 개수를 계산하여 페이지네이션 적용.
     */
    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );

        // x-total-count 값 가져오기
        numberOfTodos.value = parseInt(res.headers['x-total-count'] || 0, 10);
        todos.value = res.data;
      } catch (err) {
        console.error('Error:', err);
        error.value = 'Something went wrong.';
      }
    };

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
        getTodos(1);

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
     * @description 검색 필터링 및 즉시 검색 기능
     * - `watch()`를 사용하여 `searchText`의 변화 감지.
     * - `setTimeout`을 사용하여 불필요한 요청을 줄이고, 일정 시간 입력 후 검색 수행.
     */
    let timeout = null;
    watch(searchText, () => {
      // setTimeout을 적용하지 않으면 new를 검색할 때 n을 검색하고 ne를 검색하고 new를 검색하기 쓸데없이 자원이 낭비된다.
      // 하지만 setTimeout을 입력해도 각 각 2초 씩 걸리고 검색하기에 timeout을 이용한다.
      // 하지만 그래도 오래걸리는 거 같다 그러면 keyup이벤트를 이용해 엔터 이벤트를 적용한다.

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000);
    });

    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
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
        getTodos(1);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
    };

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    // 📌 숫자 값 (count)
    const count = ref(1);

    // 📌 computed 사용 - 캐싱됨
    const doubleCountComputed = computed(() => count.value * 2);

    // 📌 method 사용 - 호출될 때마다 연산 수행
    const doubleCountMethod = () => count.value * 2;

    return {
      todos,
      error,
      numberOfTodos,
      limit,
      currentPage,
      toggleTodo,
      searchText,
      addTodo,
      getTodos,
      searchTodo,
      deleteTodo,
      count,
      doubleCountComputed,
      doubleCountMethod,
      numberOfPages,
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
