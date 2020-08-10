import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
const opts: any = {
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      dark: {
        primary: '#f94f2e',
      },
      light: {
        primary: '#f94f2e',
      },
    },
  },
};

export default new Vuetify(opts);
