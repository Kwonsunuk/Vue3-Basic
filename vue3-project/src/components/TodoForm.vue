<template>
  <div v-if="loading">Loading..</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <!-- 📌 `subject` 값을 `todo.subject`에서 가져와 Input 컴포넌트에 전달 -->
        <TodoInput label="Subject" v-model:subject="todo.subject" />
      </div>
      <div v-if="editing" class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              class="btn"
              type="button"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click="toggleTodoStatus"
            >
              {{ todo.completed ? 'Completed' : 'Incomplete' }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">
      {{ editing ? 'Update' : 'Create' }}
    </button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">Cancel</button>
  </form>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import { ref, computed, onUpdated } from 'vue';
import _ from 'lodash';
import useToast from '@/composables/toast';
import TodoInput from '@/components/TodoInput.vue';

export default {
  components: {
    TodoInput,
  },
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: '',
      completed: false,
      body: '',
    });
    onUpdated(() => {
      console.log(todo.value.subject);
    });
    const originalTodo = ref(null);
    const loading = ref(false);
    const { toastMessage, toastAlertType, showToast, triggerToast } = useToast();

    const todoId = route.params.id;

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`todos/${todoId}`);

        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };

        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.log(error);
        triggerToast('Something went wrong', 'danger');
      }
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

    if (props.editing) {
      getTodo();
    }

    const onSave = async () => {
      if (!todo.value.subject) {
        triggerToast('Subject is required', 'danger');
        return;
      }
      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body,
        };
        if (props.editing) {
          res = await axios.put(`todos/${todoId}`, data);
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post('todos', data);
          todo.value.subject = '';
          todo.value.body = '';
        }

        const message = `Successfully ${props.editing ? 'Updated!' : 'Created!'}`;
        triggerToast(message);

        if (!props.editing) {
          router.push({
            name: 'Todos',
          });
        }
      } catch (error) {
        console.log(error);
        triggerToast('Something went wrong', 'danger');
      }
    };

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastAlertType,
    };
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
