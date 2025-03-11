<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <!-- 
      📌 `router-link` vs `<a>` 태그 차이점 (Vue Router)
      
      ✅ `<a>` 태그 (일반 링크)
      - 기본 HTML 태그로, 클릭 시 브라우저가 서버에 요청을 보내고 페이지를 **새로고침**함.
      - 페이지가 완전히 다시 로드되므로 SPA(Single Page Application)에서 불필요한 성능 저하가 발생할 수 있음.
      - 예시:
        <a class="navbar-brand" href="/">Ugi Coder</a>  
        <a class="nav-link" href="/todos">Todos</a>  

      ✅ `router-link` (Vue Router)
      - Vue Router에서 제공하는 컴포넌트로, 내부적으로 **히스토리 API(`pushState`)를 사용하여**
        페이지를 새로고침하지 않고 **클라이언트 사이드에서 경로를 변경**함.
      - Vue 앱 내에서만 경로를 변경하므로, **빠르고 부드러운 페이지 전환이 가능**함.
      - `to` 속성을 사용하여 이동할 경로를 지정.
      - 예시:
        <router-link class="navbar-brand" to="/">Ugi Coder</router-link>
        <router-link class="nav-link" to="/todos">Todos</router-link>  

      📌 결론:  
      - **Vue SPA에서는 `router-link`를 사용하는 것이 성능적으로 유리**하며, 페이지 새로고침 없이 부드러운 내비게이션이 가능함.
      - 단, 외부 사이트 이동 시 `<a>` 태그를 사용해야 하며, `target="_blank"` 옵션도 적용 가능함.
    -->

    <!-- 
      📌 `router-link`에서 `:to="{ name: 'Home' }"` 방식이 더 권장되는 이유

      ✅ `to="/"` (문자열 경로 방식)
      - URL을 직접 문자열로 지정하는 방식.
      - 예제:
        <router-link class="navbar-brand" to="/">Ugi Coder</router-link>

      ✅ `:to="{ name: 'Home' }"` (네임드 라우트 방식)
      - `routes` 배열에서 **라우트 이름(`name`)을 기반으로 경로를 설정하는 방식**.
      - Vue Router는 `name`을 기반으로 동작하여, 프로젝트 구조가 커질 때 **더 확장성과 유지보수성이 좋음**.
      - 예제:
        <router-link class="navbar-brand" :to="{ name: 'Home' }">Ugi Coder</router-link>

      📌 `name`을 사용하면 유리한 경우:
      1️⃣ **경로 변경 시 유지보수 용이**  
         - `routes`에서 `path`가 변경되더라도 `name`을 사용하면 `router-link`를 수정할 필요 없음.
         - 예를 들어 `/home` → `/dashboard`로 변경 시, `name: 'Home'`은 그대로 사용 가능.
      
      2️⃣ **동적 라우트(`params`) 사용 가능**  
         - `:to="{ name: 'UserDetail', params: { id: 123 } }"` 처럼 동적으로 데이터를 전달할 수 있음.
      
      3️⃣ **다른 컴포넌트에서도 일관된 네이밍 유지**  
         - 여러 곳에서 동일한 `name`을 사용하면 코드 일관성을 유지할 수 있음.

      📌 결론:
      - **작은 프로젝트**에서는 `to="/"` 방식도 가능하지만,
      - **대규모 프로젝트에서는 `:to="{ name: 'Home' }"` 방식을 권장**하며, 유지보수성과 확장성이 높음.
    -->
    <router-link class="navbar-brand" :to="{ name: 'Home' }">Ugi Coder</router-link>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" :to="{ name: 'Todos' }">Todos</router-link>
      </li>
    </ul>
  </nav>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style></style>

<!-- 
  ✅ 2025/03/09:
  - Vue Router 설치 후 페이지 간 이동 설정.

  ✅ 2025/03/10:
  - `App.vue`를 `pages/todos/index.vue`로 이동한 후 경로 오류 발생.
  - 해결 방법: `npm install eslint-import-resolver-alias --save-dev` 설치 및 `.eslintrc.cjs` 수정.

  📌 Vue.js 앱의 작동 원리
  - Vue 컴포넌트(`.vue` 파일)는 **JS 코드로 변환**된 후, 브라우저에서 실행됨.
  - 실제 HTML 파일은 `public/index.html`을 사용하며, Vue 앱이 **이 파일을 기반으로 동작**함.
  - Vue 컴포넌트 내부에서는 **Virtual DOM을 사용하여 변경된 부분만 효율적으로 업데이트**함.
  
  ✅ 2025/03/11: JavaScript 자료형 & 참조 타입 vs 원시 타입

  📌 **JavaScript의 두 가지 자료형**
  1️⃣ **원시 타입 (Primitive Type)**  
    - **값 자체를 저장**하며, 메모리 주소가 아니라 **실제 데이터**를 변수에 저장.
    - `Number`, `String`, `Boolean`, `null`, `undefined`, `Symbol`, `BigInt`
    - **예제**:
      ```js
      let a = 1;
      let b = 1;
      console.log(a === b); // true (값 자체를 비교하므로 같음)
      ```
  
  2️⃣ **참조 타입 (Reference Type)**  
    - **값이 아니라 메모리 주소를 저장**하며, 변수에는 실제 데이터가 아니라 **참조값(메모리 주소)**가 저장됨.
    - `Object`, `Array`, `Function`
    - **예제**:
      ```js
      let c = { a: 1 };
      let d = { a: 1 };
      console.log(c === d); // false (메모리 주소가 다름)
      ```
  
  📌 **원시 타입 vs 참조 타입의 차이**
  - 원시 타입은 **값 자체를 비교**하지만,  
    참조 타입은 **메모리 주소를 비교**하므로, 같은 값을 가진 객체라도 다르게 인식될 수 있음.

  ✅ **참조 타입 변수 복사 시 주의점**
  ```js
  let e = d; // e에 d의 메모리 주소를 저장 (같은 객체를 가리킴)
  console.log(d === e); // true (같은 메모리 주소를 공유)

  e.a = 2; 
  console.log(d.a); // 2 (d도 영향을 받음, 같은 객체를 참조 중)

  ✅ 객체를 독립적으로 복사하는 방법 (Shallow Copy vs Deep Copy)

  얕은 복사 (Shallow Copy): 객체의 참조 값만 복사
  let e = { ...d }; // `d`의 프로퍼티를 복사하지만, 중첩 객체는 공유됨
  console.log(d === e); // false (새로운 객체 생성됨)
  e.a = 3;
  console.log(d.a); // 2 (d의 값은 변경되지 않음)

  깊은 복사 (Deep Copy): 객체의 모든 중첩된 값까지 완전히 새로운 메모리 공간을 할당
  lodash 라이브러리 사용 (npm install lodash)
  import cloneDeep from 'lodash/cloneDeep';
  let f = cloneDeep(d); // 깊은 복사 수행
  console.log(d === f); // false (완전히 새로운 객체)

  ✅ 2025/03/11:
  - lodash 설치
  - npm i lodash 설치 후 npm i -S lodash 의존성 추가
  -->
