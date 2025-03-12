import { ref, onUnmounted } from 'vue';

export default function useToast() {
  onUnmounted(() => {
    /**
     * setTimeout은 페이지를 이동하면서 컴포넌트가 DOM에서 Unmount되어도 메모리에 남아있다.
     * 그래서 메모리에서 삭제를 해줘야한다.
     */
    // clearTimeout(timeOut.value);
  });
  const showToast = ref(false);
  const toastAlertType = ref('');
  const toastMessage = ref('');
  const timeOut = ref('');

  const triggerToast = (message, type = 'success') => {
    toastMessage.value = message;
    toastAlertType.value = type;
    showToast.value = true;

    timeOut.value = setTimeout(() => {
      toastMessage.value = '';
      toastAlertType.value = '';
      showToast.value = false;
    }, 3000);
  };

  return {
    showToast,
    toastAlertType,
    toastMessage,
    triggerToast,
  };
}
