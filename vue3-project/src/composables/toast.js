import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useToast() {
  const store = useStore(); // Vuex store 인스턴스 가져오기

  /**
   * 📌 Vuex의 `state` 값을 `computed`로 감싸서 반응형을 유지
   *
   * ✅ 왜 `computed()`를 사용해야 할까?
   * - Vuex의 `state`는 반응형이지만, `store.state`를 직접 참조하면 반응형 속성을 잃을 수 있음.
   * - `computed()`로 감싸면 **Vue가 상태 변화를 추적하고 자동으로 업데이트**함.
   * - 즉, `store.state.toast.showToast`가 변경될 때 `showToast` 값도 자동으로 업데이트됨.
   */
  // const toastAlertType = computed(() => store.state.toast.toastAlertType);
  // const toastMessage = computed(() => store.getters['toast/toastMessageWithSmile']); // Vuex의 `getter` 사용
  // const showToast = computed(() => store.state.toast.showToast);

  // ✅ Vuex의 `state.toast.toasts`를 computed()로 감싸 반응형 유지
  const toasts = computed(() => store.state.toast.toasts);

  /**
   * 📌 `triggerToast`: 토스트 메시지를 트리거하는 함수
   *
   * ✅ Vuex 액션(`triggerToast`)을 통해 상태를 변경하는 이유?
   * - Vuex에서는 `state`를 직접 변경할 수 없고, 반드시 `mutations`를 통해 변경해야 함.
   * - 하지만 `mutations`는 **동기 작업만 가능**하므로, 비동기 작업이 필요하면 `actions`을 사용해야 함.
   * - `actions` 내부에서 `commit()`을 호출하여 `mutation`을 실행하고 상태를 변경함.
   *
   * ✅ `triggerToast` 함수의 역할
   * - Vuex `actions`(`toast/triggerToast`)를 호출하여 토스트 메시지를 표시함.
   * - 메시지(`message`)와 알림 타입(`type`)을 객체 형태로 전달하여 동적으로 설정 가능.
   */
  // ✅ Vuex `actions`를 호출하여 토스트 트리거
  const triggerToast = (message, type = 'success') => {
    store.dispatch('toast/triggerToast', { message, type });
  };

  return {
    toasts, // ✅ 반응형 `toasts` 배열 반환
    triggerToast, // ✅ `triggerToast()` 함수 반환
  };
}
