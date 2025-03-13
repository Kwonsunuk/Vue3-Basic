<template>
  <!--
        📌 v-for를 사용하여 목록을 동적으로 렌더링
        - 같은 요소를 반복해서 출력할 때 `v-for`을 사용함.
        - `:key` 속성을 사용하여 각 항목을 구별해야 함.
  
        ✅ `:key`를 설정하는 이유
        - Vue는 `key`를 기반으로 DOM을 효율적으로 업데이트함.
        - 고유한 `id`를 사용하면 불필요한 DOM 재렌더링을 방지하고 성능을 최적화할 수 있음.

        왜 이런식으로 slot을 사용하냐 할  수 있는데 우선 이건 scoped slot이다.
        현재 TodoList.vue가 부모이고 List.vue가 자식 컴포넌트이다.
        <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id"> 

        📌 `List.vue`를 사용하여 재사용 가능한 리스트 컴포넌트 구현
        - `List.vue`는 단순히 `v-for`을 사용하여 목록을 렌더링함.
        - `<template #default="{ item, index }">` 를 사용해 `List.vue`에서 데이터를 받아옴.
        - Scoped Slot을 활용하여 `item`과 `index`를 `List.vue`로부터 전달받아 원하는 방식으로 렌더링함.
  -->
  <List :items="todos">
    <template #default="{ item, index }">
      <div
        class="card-body p-2 d-flex align-items-center"
        style="cursor: pointer"
        @click="moveToPage(item.id)"
      >
        <div class="flex-grow-1">
          <!-- 📌 v-model을 사용하여 `todo.completed` 값 변경
        삭제 버튼을 누르면 이벤트 버블링이 발생하는데 이벤트 버블링이란 한 요소에서 이벤트가 발생하면, 
        이 요소에 할당된 핸들러가 작동하고, 이어서 부모 요소의 핸들러가 동작하는데 
        이때 가장 최상단의 조상 요소를 만날 때까지 이 과정이 반복되면서 요소 각각 할당된 핸들러가 동작함을 말한다. 
        따라서 원치않은 동작 이벤트가 발생할 수 있다.

        밑의 체크 박스('@change="toggleTodo"')를 클릭하면 `completed` 상태가 변경되는데,  
        부모 요소의 클릭 핸들러('@click="moveToPage(todo.id)"')까지 실행되는 문제가 발생한다.  
        따라서 `stopPropagation()`을 사용하여 이벤트 전파를 막아야 한다.  
        Vue.js에서는 `@change.stop`을 사용하면 된다고 알려져 있지만, `change` 이벤트는 전파되지 않으므로 `stop`이 동작하지 않는다.  
        ✅ 해결 방법: `@click.stop`만을 사용하거나, 아니면 @change="toggleTodo(index)"와 @click.stop을 둘 다 쓴다.
        -->

          <input
            class="ml-2 mr-2"
            type="checkbox"
            :checked="item.completed"
            @change="toggleTodo(index, $event)"
            @click.stop
          />

          <!--
              ✅ 스타일 바인딩 (`v-bind:style`)
              - `todo.completed`가 `true`일 경우, `todoStyle` 적용
              - 인라인 스타일을 동적으로 변경해야 할 때 유용
            <label class="form-check-label" :style="todo.completed ? todoStyle : {}">
              {{ todo.subject }}
            </label>
            
              ✅ 클래스 바인딩 (`v-bind:class`)
              - `todo.completed`가 `true`일 경우, `todo` 클래스 추가
              - CSS 클래스를 동적으로 변경할 때 유용
            -->
          <span :class="{ todo: item.completed }">
            {{ item.subject }}
          </span>
        </div>
        <div>
          <!--
         📌 삭제 버튼 클릭 시 이벤트 전파 방지 (`@click.stop` 필요)

          ✅ 이벤트 버블링이 발생하는 이유
          - `<button>` 요소를 클릭하면 `click` 이벤트가 부모 요소까지 전파됨.
          - 현재 코드에서는 `@click="moveToPage(todo.id)"`가 부모 요소에 있기 때문에,  
            삭제 버튼을 눌러도 **해당 Todo의 상세 페이지로 이동하는 문제가 발생**함.

          ✅ 해결 방법 (`@click.stop` 적용)
          - `@click.stop="deleteTodo(index)"`을 사용하여 클릭 이벤트 전파 차단.
          - 이렇게 하면 삭제 버튼 클릭 시 **부모의 `moveToPage()`가 실행되지 않음**.P
         -->
          <button class="btn btn-danger btn-sm" @click.stop="openModal(item.id)">Delete</button>
        </div>
      </div>
    </template>
    <!-- </div> -->
  </List>
  <teleport to="#modal">
    <!--
      📌 Modal (삭제 확인 창)
      - `teleport`를 사용하여 모달을 최상위 `#modal` 영역으로 이동시켜 관리.
      - `@close`: 모달 닫기
      - `@delete`: 삭제 실행 (emit을 통해 부모로 전달)
      Modal이나 Toast의 경우 여러 곳에서 사용하는데 Modal은 emit이나 props로 정보를 전달받아 각페이지에서 다른 글이 나오게하기 힘들다.
      따라서 slot을 사용한다. -->
    <DeleteModal v-if="showModal" @close="closeModal" @delete="deleteTodo"></DeleteModal>
  </teleport>
</template>

<script>
import { useRouter } from 'vue-router';
import DeleteModal from '@/components/DeleteModal.vue';
import { ref } from 'vue';
import List from '@/components/List.vue';

export default {
  components: {
    DeleteModal,
    List,
  },
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
    const router = useRouter();
    const showModal = ref(false);
    const todoDeleteId = ref(null);
    // 완료 상태 토글
    const toggleTodo = (index, event) => {
      emit('toggle-todo', index, event.target.checked);
    };

    const openModal = (id) => {
      todoDeleteId.value = id;
      showModal.value = true;
    };

    const closeModal = () => {
      todoDeleteId.value = null;
      showModal.value = false;
    };

    // 할 일 삭제
    const deleteTodo = () => {
      emit('delete-todo', todoDeleteId.value);
      showModal.value = false;
      todoDeleteId.value = null;
    };

    // Todos 페이지에서 각 Todo를 상세히 볼 수 있는 페이지로 이동할 때 router.push를 사용.
    const moveToPage = (todoId) => {
      console.log(todoId);
      router.push({
        name: 'Todo',
        params: {
          id: todoId,
        },
      });
    };

    return {
      router,
      showModal,
      toggleTodo,
      openModal,
      closeModal,
      deleteTodo,
      moveToPage,
    };
  },
};
</script>

<style></style>
