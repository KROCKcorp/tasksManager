import { createApp } from 'vue';
import { Quasar, Notify, Ripple, ClosePopup } from 'quasar';
import 'quasar/dist/quasar.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(Quasar, {
  plugins: { Notify },
  directives: { Ripple, ClosePopup },
});
app.use(router);
app.mount('#app');
