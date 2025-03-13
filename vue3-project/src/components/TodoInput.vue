<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <!-- 📌 subject 값을 올바르게 바인딩하도록 `props.subject` 사용 -->
    <input :value="subject" @input="onInput" type="text" class="form-control" />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    /**
     * 📌 onInput 이벤트 핸들러
     * - 사용자가 입력한 값을 부모 컴포넌트에 전달하는 역할을 함.
     * - `emit('update-subject', e.target.value)`를 호출하여 `subject` 값 변경.
     */
    const onInput = (e) => {
      emit('update:subject', e.target.value);
    };

    return {
      onInput,
    };
  },
};
</script>

<style></style>
