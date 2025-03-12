import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/index.vue';
import Todos from '../pages/todos/index.vue';
import Todo from '../pages/todos/_id.vue';
import TodoCreate from '../pages/todos/create/index.vue';

/**
 * 📌 `createWebHistory()`
 * - Vue Router에서 **HTML5 History 모드**를 활성화하는 함수.
 * - 브라우저의 `pushState` 및 `replaceState`를 사용하여 **URL을 조작**할 수 있음.
 * - URL에 `#/path` 없이 **깨끗한 경로(`/home`, `/about` 등)**를 사용 가능.
 * - 단, **서버에서 직접 URL을 요청할 경우 404 에러 방지를 위해**
 *   Nginx, Apache에서 `index.html`로 리디렉션하는 설정이 필요함.
 */
const history = createWebHistory();

/**
 * 📌 `createRouter()`
 * - Vue 애플리케이션에서 **라우터 인스턴스를 생성**하는 함수.
 * - `history` 옵션을 통해 **어떤 히스토리 모드를 사용할지 설정 가능**.
 *   - `createWebHistory()` → HTML5 히스토리 모드 (권장)
 *   - `createHashHistory()` → `#/home` 같은 해시 기반 라우팅
 *   - `createMemoryHistory()` → 서버 사이드 렌더링(SSR)에서 사용
 * - `routes` 배열을 통해 URL과 컴포넌트를 매핑함.
 *
 * 📌 `pages` 폴더 구조
 * - `src/pages/index.vue` → `/` (홈 페이지)
 * - `src/pages/todos/index.vue` → `/todos` (투두 리스트 페이지)
 *   - 즉, `pages` 폴더 내 `index.vue` 파일은 해당 폴더의 기본 라우트로 작동함.
 *   - `/todos`를 찾고 싶으면 `pages/todos/index.vue` 파일을 불러오면 됨.
 * - `pages` 폴더에는 라우트에 매핑될 **컴포넌트들이 위치**함.
 */
const router = createRouter({
  history, // `createWebHistory()`를 사용하여 브라우저 히스토리 모드 적용
  /**
   * 📌 `routes` 배열
   * - `{}` 하나하나의 객체는 각 **라우트를 의미**함.
   * - 각 객체는 3개의 속성을 가짐:
   *   1️⃣ `path`: 해당 라우트의 URL 경로
   *   2️⃣ `name`: 라우트의 이름 (네이밍 라우트 사용 시 필요)
   *   3️⃣ `component`: 해당 경로에서 렌더링될 컴포넌트
   */
  routes: [
    {
      path: '/', // 기본 홈 페이지
      name: 'Home',
      component: Home, // 동적 로드 방식
    },
    {
      path: '/todos', // "/todos" 페이지
      name: 'Todos',
      component: Todos,
    },
    {
      path: '/todos/create', // "/todo 생성 페이지
      name: 'TodoCreate',
      component: TodoCreate,
    },
    {
      path: '/todos/:id', // "/todos/id" 페이지
      name: 'Todo',
      component: Todo,
    },
  ],
});

export default router;
