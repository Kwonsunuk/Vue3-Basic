# 📌 Vue3 To-Do List 프로젝트

이 프로젝트는 **Vue 3, Vuex, Vue Router, JSON Server**를 활용하여 만든 **To-Do List 애플리케이션**이다.  
CRUD 기능을 포함하며, **모달 창, 애니메이션, 페이지네이션, 검색 기능, Vuex 상태 관리, Toast 알림 등**을 구현하였다.  
최신 기술을 사용해 **컴포넌트 기반 설계, API 연동, 비동기 처리, 상태 관리**를 경험할 수 있다.

---

## 📂 프로젝트 폴더 구조  

```bash
vue3-project
├── .editorconfig          # 코드 스타일 가이드 설정
├── .eslintrc.cjs         # ESLint 설정 파일
├── .prettierrc           # Prettier 설정 파일
├── README.md             # 프로젝트 문서
├── babel.config.js       # Babel 설정 파일
├── db.json               # JSON Server를 위한 가짜 데이터베이스
├── jsconfig.json         # JavaScript 설정 파일
├── package.json          # 프로젝트 의존성 및 스크립트 정의
├── package-lock.json     # 패키지 버전 고정 파일
├── vue.config.js         # Vue 프로젝트 설정 파일
│
├── public/               # 정적 파일 (HTML, 파비콘 등)
│   ├── favicon.ico       # 브라우저 탭 아이콘
│   └── index.html        # 기본 HTML 파일
│
├── src/                  # 애플리케이션 소스 코드
│   ├── App.vue           # 최상위 Vue 컴포넌트
│   ├── main.js           # Vue 애플리케이션 진입점
│   │
│   ├── assets/           # 정적 자산 (이미지, 스타일 등)
│   │   └── logo.png
│   │
│   ├── axios.js          # Axios 기본 URL 및 인터셉터 설정
│   │
│   ├── components/       # UI 컴포넌트 모음
│   │   ├── DeleteModal.vue   # 삭제 확인 모달
│   │   ├── List.vue          # 리스트 컴포넌트
│   │   ├── Modal.vue         # 재사용 가능한 모달 컴포넌트
│   │   ├── Navbar.vue        # 네비게이션 바
│   │   ├── Pagination.vue    # 페이지네이션 컴포넌트
│   │   ├── Toast.vue         # 알림(Toast) 메시지 컴포넌트
│   │   ├── TodoForm.vue      # 투두 입력 폼
│   │   ├── TodoInput.vue     # 개별 입력 필드
│   │   ├── TodoList.vue      # 투두 리스트 컴포넌트
│   │   └── TodoSimpleForm.vue # 간단한 투두 입력 폼
│   │
│   ├── composables/      # 재사용 가능한 Vue 3 Composition API 관련 코드
│   │   ├── count.js      # 카운트 기능 로직
│   │   └── toast.js      # Toast 메시지 로직
│   │
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── index.vue     # 메인 페이지
│   │   └── todos/        # 투두 관련 페이지
│   │       ├── _id.vue   # 특정 투두 상세 페이지
│   │       ├── create/   # 투두 생성 페이지
│   │       │   └── index.vue
│   │       └── index.vue # 투두 리스트 페이지
│   │
│   ├── router/           # Vue Router 설정
│   │   └── index.js
│   │
│   ├── store/            # Vuex 상태 관리
│   │   ├── index.js      # Vuex 초기 설정
│   │   └── modules/      # Vuex 모듈화된 스토어
│   │       ├── index.js
│   │       └── toast/    # Toast 메시지 관련 상태 관리
│   │           └── index.js
│   │
│   └── styles/           # 스타일 관련 폴더 (추가 가능)
│
└── bak/                  # 이전 백업된 코드
    ├── chap1~8/
    │   └── App.vue.bak   # 챕터 1~8 백업 코드
    ├── chap9-16/
    │   └── App.vue.bak   # 챕터 9~16 백업 코드
```

---

## 🚀 주요 기능

✅ **기본 기능**

- CRUD 기능: 할 일 추가, 삭제, 수정, 완료 표시
- Vuex 사용: 전역 상태 관리 적용
- Vue Router: 페이지 이동 기능 구현
- JSON Server: 로컬 가짜 API 서버로 데이터 저장 및 관리

✅ **추가 기능**

- Toast 알림: To-Do 추가/삭제 시 알림 메시지 표시
- 모달 창: To-Do 삭제 시 모달 창 확인
- 페이지네이션: 한 페이지당 5개의 항목을 표시
- 검색 기능: 할 일 제목을 기준으로 필터링
- 정렬 기능: 가장 최신 할 일이 위쪽에 표시되도록 DESC 정렬
- 컴포넌트 추출: Navbar, Pagination, Modal 등의 컴포넌트화

---

## 🛠 사용 기술

- **프론트엔드**: Vue 3, Vuex, Vue Router, Composition API
- **백엔드 (Mock API)**: JSON Server
- **스타일링**: Bootstrap 5
- **비동기 요청**: Axios

---

## 💡 배운 점

- Vue 3 Composition API를 활용한 상태 및 메서드 관리
- Vue Router를 이용한 동적 라우팅 처리
- Vuex를 통한 전역 상태 관리
- 비동기 처리 (async/await, then/catch) 및 JSON Server와의 연동
- 재사용 가능한 컴포넌트 개발 (Modal, Pagination, Toast 등)
- watchEffect & watch를 활용한 데이터 변경 감지
- Transition & TransitionGroup을 활용한 애니메이션 적용

