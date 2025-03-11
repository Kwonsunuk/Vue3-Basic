<template>
  <h1>To-Do Page</h1>
  <div v-if="loading">Loading..</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input type="text" class="form-control" v-model="todo.subject" />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              type="button"
              class="btn"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click="toggleTodoStatus"
            >
              {{ todo.completed ? 'Completed' : 'Incomplete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">저장</button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">취소</button>
  </form>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import _ from 'lodash';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);
    const todoId = route.params.id;
    // getTodo를 통해 가져온 데이터를 리액티브 스테이트에 담아 리턴해 템플릿에서 사용.

    const getTodo = async () => {
      const res = await axios.get(`http://localhost:3000/todos/${todoId}`);

      todo.value = { ...res.data };
      originalTodo.value = { ...res.data };
      loading.value = false;
    };

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    const moveToTodoListPage = () => {
      router.push({
        name: 'Todos',
      });
    };

    const onSave = async () => {
      try {
        const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
          subject: todo.value.subject,
          completed: todo.value.completed,
        });
        originalTodo.value = { ...res.data };
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getTodo();

    return {
      route,
      router,
      todo,
      originalTodo,
      loading,
      todoId,
      getTodo,
      todoUpdated,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
    };
  },
};
</script>

<style></style>
