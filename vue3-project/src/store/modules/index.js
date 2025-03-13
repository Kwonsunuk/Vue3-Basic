import { createStore } from 'vuex';
import toast from './toast/index'; // ✅ 모듈을 올바르게 불러옴

export default createStore({
  modules: {
    toast, // ✅ `toast` 모듈 등록
  },
});
