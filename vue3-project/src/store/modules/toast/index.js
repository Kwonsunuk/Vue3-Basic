export default {
  namespaced: true,
  state: {
    toasts: [], // ✅ 토스트 목록 배열
  },

  mutations: {
    ADD_TOAST(state, payload) {
      state.toasts.push(payload);
    },
    REMOVE_TOAST(state) {
      state.toasts.shift();
    },
  },

  actions: {
    triggerToast({ commit }, { message, type = 'success' }) {
      const toast = {
        id: Date.now(),
        message,
        type,
      };

      commit('ADD_TOAST', toast);

      setTimeout(() => {
        commit('REMOVE_TOAST');
      }, 5000);
    },
  },
};
