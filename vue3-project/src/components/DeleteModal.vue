<template>
  <Modal>
    <template #title> Delete Todo!! </template>
    <template #body> Are you sure that you want delete this todo? </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="onClose">Close</button>
      <button type="button" class="btn btn-danger" @click="onDelete">Delete</button>
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('close'); // 부모 컴포넌트에서 `@close` 이벤트를 받아 처리
    };

    const onDelete = () => {
      emit('delete'); // 부모 컴포넌트에서 `@delete` 이벤트를 받아 처리
    };

    return {
      onClose,
      onDelete,
    };
  },
};
</script>

<style></style>
