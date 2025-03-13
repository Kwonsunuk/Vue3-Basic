// 📌 컴포지션 함수에서 `reactive` 상태를 반환할 때 리액티비티가 끊어질 가능성
//
// ✅ 문제점:
// - Vue의 `reactive()`를 사용하여 상태를 생성하고 그대로 반환하면,
//   반환된 상태를 사용하려는 컴포넌트에서 리액티비티가 끊어질 수 있음.
// - 이는 `reactive()`가 **객체 전체를 감싸는 방식**이기 때문에,
//   구조 분해 할당을 하면 반응형 객체에서 속성이 분리될 가능성이 있기 때문임.
//
// ✅ 해결 방법:
// 1️⃣ `reactive` 객체 내부 속성을 `toRefs()`로 변환하여 반환 (Vue의 반응형 시스템 유지)
// 2️⃣ `ref`를 개별적으로 사용하여 각 속성을 관리
// 3️⃣ `reactive()`를 사용할 경우 객체 전체를 직접 변경하는 방식 유지

import { reactive, toRefs } from 'vue';

export default function useCount() {
  const state = reactive({
    count: 0, // 📌 반응형 상태 (객체)
  });

  // 📌 해결 방법: `toRefs()`를 사용하여 개별 속성을 `ref`로 변환 후 반환
  return toRefs(state);
}

/**
 * ✅ `reactive()`와 `toRefs()`의 차이점 및 구조 분해 할당 문제
 *
 * 1. **객체 전체를 반응형으로 감싼다는 의미**
 *    - `reactive()`는 객체 전체를 감싸서 반응형으로 만든다.
 *    - 즉, `state = reactive({ count: 0 })` 라고 하면,
 *      `state` 자체가 Vue의 반응형 시스템에 의해 감지됨.
 *    - `state.count` 값을 변경하면 반응형이 유지되지만,
 *      `state` 내부 속성(`count`)만 따로 빼내면 반응형이 깨질 수 있음.
 *
 * 2. **구조 분해 할당이란?**
 *    - 객체에서 특정 속성만 추출하여 개별 변수로 사용하는 것.
 *    - 예제:
 *      ```js
 *      const obj = { a: 1, b: 2 };
 *      const { a } = obj; // obj의 a 속성을 개별 변수로 분해
 *      console.log(a); // 1
 *      ```
 *    - 위와 같이 `{ count } = state;` 형태로 구조 분해 하면
 *      `count`가 `state` 객체에서 분리되어 Vue의 반응형 시스템에서 벗어나게 됨.
 *
 * 3. **개별 속성이 반응형 시스템에서 분리될 가능성이란?**
 *    - `reactive()`로 만든 객체의 속성(예: `state.count`)은
 *      `state` 객체 내에서 사용할 때는 반응형이 유지됨.
 *    - 하지만 구조 분해 할당을 하면 `state.count`가 **반응형 객체에서 분리됨**.
 *    - 즉, `const { count } = useCount();` 처럼 분해하면 `count`가 반응형을 잃고
 *      Vue가 변경 사항을 감지하지 못함.
 *
 * 4. **`toRefs()`를 사용하면 왜 반응형이 유지될까?**
 *    - `toRefs()`를 사용하면 객체의 각 속성을 **개별적인 `ref`로 변환**함.
 *    - 즉, `{ count: ref(0) }`처럼 변환되므로 구조 분해 할당을 해도
 *      `count`는 여전히 반응형 상태로 유지됨.
 *
 * 📌 `toRefs()`가 없는 경우 (`return state`):
 * ```js
 * const { count } = useCount(); // `count`가 반응형 객체에서 분리됨 (🚨 반응성 깨짐)
 * count++; // 값이 증가하지 않음 (반응형이 아니기 때문)
 * ```
 *
 * 📌 `toRefs()`를 사용한 경우 (`return toRefs(state)`):
 * ```js
 * const { count } = useCount(); // `count`가 ref로 변환됨 (✅ 반응성 유지)
 * count++; // 값이 정상적으로 증가함
 * ```
 *
 * 🎯 결론:
 * - **Vue 컴포넌트에서 구조 분해 할당할 경우 반응성을 유지하려면 `toRefs()`를 사용해야 함.**
 * - **반응형 객체(`reactive()`) 내부 속성을 개별적인 `ref`로 변환하면,**
 *   컴포넌트에서 직접 `count++`처럼 값을 변경할 수 있음.
 */
