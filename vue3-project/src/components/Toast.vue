<template>
  <div class="alert toast_box" :class="`alert-${type}`" role="alert">{{ message }}</div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      tpye: String,
      default: 'success',
    },
  },
};
</script>

<style>
.toast_box {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
