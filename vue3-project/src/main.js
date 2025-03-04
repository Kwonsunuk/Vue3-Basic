import { createApp } from 'vue' 
// Vue의 createApp 함수를 가져온다. (애플리케이션 인스턴스를 생성하는 역할)

import App from './App.vue' 
// 최상위 루트 컴포넌트(App.vue)를 불러온다.

createApp(App).mount('#app') 
// createApp을 사용해 Vue 애플리케이션을 생성하고, App 컴포넌트를 최상위 컴포넌트로 등록한 후,
// 해당 애플리케이션을 HTML에서 id가 'app'인 요소에 마운트(연결)한다.


