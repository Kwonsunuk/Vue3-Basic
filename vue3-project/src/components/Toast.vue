<template>
  <div class="toast_box">
    <transition-group name="slide">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="alert"
        :class="`alert-${toast.type}`"
        role="alert"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import useToast from '@/composables/toast';

export default {
  setup() {
    const { toasts } = useToast(); // ✅ `toasts`를 반응형 데이터로 가져옴

    return {
      toasts,
    };
  },
};
</script>

<style scoped>
.toast_box {
  position: fixed;
  top: 10px;
  right: 10px;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
