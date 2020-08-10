<template>
  <v-app>
    <v-content class="white" v-if="$route.name === 'login' && userRole && userRole.length > 0">
      <div
        style="height: 100vh;"
        class="d-flex flex-column align-center text-center justify-space-around"
      >
        <div>
          <img src="../src/assets/404.png" alt />
          <h1 class="mt-10">Pemberitahuan</h1>
          <p class="mt-2">Anda sudah login ke sistem ini silahkan kembali ke dashboard anda</p>
          <v-btn @click="backToDashboard" class="primary elevation-0" dark>Kembali ke dashboard</v-btn>
        </div>
      </div>
    </v-content>

    <div v-else-if="userRole && userRole.length > 0">
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant="mini"
        width="280"
        color="#f94f2e"
        app
        dark
        class="py-0"
      >
        <menu-navigation v-on:confirmLogout="confirmLogout" />
      </v-navigation-drawer>

      <v-navigation-drawer v-model="left" fixed temporary></v-navigation-drawer>
    </div>

    <v-content v-if="userRole && userRole.length > 0" class="ml-4 mr-10">
      <v-container fluid class="pb-0">
        <v-row justify="space-between" class="py-3 px-2">
          <v-row class="px-3 align-center">
            <v-icon v-if="drawer && !mini" @click.stop="changeDrawer(true)" class="mr-3">menu</v-icon>
            <v-icon
              v-else-if="drawer && mini"
              @click.stop="changeDrawer(true)"
              class="mr-3"
            >arrow_back</v-icon>
            <v-icon v-else @click.stop="changeDrawer(false)" class="mr-3">arrow_forward</v-icon>
          </v-row>
          <v-menu
            class="elevation-10"
            open-on-hover
            bottom
            transition="slide-y-transition"
            offset-y
            :position-y="200"
          >
            <template v-slot:activator="{ on }">
              <div class="d-flex flex-row align-center" v-on="on">
                <v-icon class="mr-3">person</v-icon>
                <div class="body-2">{{ userFullName }}</div>
                <v-icon class="ml-6">arrow_drop_down</v-icon>
              </div>
            </template>

            <v-list class="py-0">
              <v-list-item to="/account-configuration">
                <v-list-item-content>
                  <v-list-item-title>Pengaturan Akun</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="confirmLogout()">
                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-container>
      <router-view></router-view>
    </v-content>
    <v-content v-else-if="$route.name === 'login' || $route.name === 'forgot-password'">
      <router-view></router-view>
    </v-content>
    <v-content class="white" v-else>
      <div
        style="height: 100vh;"
        class="d-flex flex-column align-center text-center justify-space-around"
      >
        <div>
          <img src="../src/assets/404.png" alt />
          <h1 class="mt-10">Pemberitahuan</h1>
          <p class="mt-2">Anda tidak punya akses untuk membuka halaman ini</p>
          <v-btn :to="{ name: 'login' }" class="primary elevation-0" dark>Kembali ke Login</v-btn>
        </div>
      </div>
    </v-content>

    <!-- Logout Dialog Start Here -->
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card class="custom-modal text-center">
          <v-card-text class="py-5">
            <img src="../src/assets/power.png" class="my-6" alt />
            <div class="title black--text my-2">Konfirmasi Keluar</div>
            <div>Apakah anda yakin ingin keluar dari sistem ?</div>
          </v-card-text>
          <v-card-actions class="pa-5">
            <v-col cols="6" class="py-0 px-0 pr-2">
              <v-btn
                block
                large
                class="elevation-0"
                color="grey darken-2"
                dark
                @click="dialog = false"
              >Tidak</v-btn>
            </v-col>
            <v-col cols="6" class="py-0 px-0 pl-2">
              <v-btn block large dark class="elevation-0" color="primary" @click="logout()">Ya</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- snackbar -->
    <v-snackbar
      v-model="snackbar.value"
      @close="closeSnackbar"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
      :dark="snackbar.color === 'warn darken-1'"
    >
      {{ snackbar.message }}
      <v-btn dark text @click="closeSnackbar">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
/* tslint:disable */
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import {
  isAuth,
  openSnackbarNow,
  isAdmin,
  isGeneralManager,
  isGeneralHRA,
  isGeneralHRP,
  isBranchManager,
  isBranchHRA,
  isBranchHRP,
  isOwner,
} from './common/utils/config';
import { AuthModule } from './store/modules/auth';
import { decodeToken } from './common/utils/jwt';
import { getToken } from './common/utils/cookies';
import { SettingsStore } from './store/modules/settings';
import { ISnackbar } from './common/interfaces/snackbar';
import { UserModule } from './store/modules/user';
import MenuNavigation from './components/sidebar/MenuNavigation.vue';

@Component({
  name: 'MainApp',
  components: {
    MenuNavigation,
  },
})
export default class extends Vue {
  left: boolean = false;
  dialog: boolean = false;
  role: string | null = null;
  drawer: boolean = true;
  APP_VERSION: string = process.env.VUE_APP_VERSION;

  // GETTERS
  get snackbar(): ISnackbar {
    return SettingsStore.snackbar;
  }

  get dataDrawer(): boolean {
    return SettingsStore.drawer;
  }

  get mini(): boolean {
    return SettingsStore.mini;
  }

  get userRole(): string[] {
    return AuthModule.roles;
  }

  get userFullName(): string {
    return UserModule.fullName;
  }

  @Watch('userRole')
  watchUserRole() {
    const id: string = AuthModule.id;
    this.setUserInfo(id);
  }

  // METHODS
  mounted() {
    this.checkUserAuth();
    this.drawer = this.dataDrawer;
  }

  closeSnackbar() {
    SettingsStore.closeSnackbar();
  }

  confirmLogout() {
    this.dialog = true;
  }

  checkUserAuth() {
    if (this.$route.name === 'forgot-password') {
      // do nothing
    } else if (isAuth()) {
      const token: any = getToken();
      const userData = decodeToken(token);
      AuthModule.setUserData(userData);
      this.setUserInfo(userData.id);
    } else if (this.$route.name !== 'login') {
      this.$router.push({
        path: '/login',
      });
    }
  }

  async logout() {
    await AuthModule.LogoutUser();
    await UserModule.setInitDataUser();
    UserModule.setUserFullName('');
    this.dialog = false;
    this.$router.push({
      path: '/login',
    });
  }

  async setUserInfo(id: any) {
    await UserModule.getOneUser(id);
    const user = UserModule.user;
    const full_name = `${user.first_name} ${
      user.last_name && user.last_name !== '' && user.last_name !== null
        ? user.last_name
        : ''
    }`;
    UserModule.setUserFullName(full_name);
  }

  changeDrawer(type: boolean) {
    SettingsStore.changeDrawer(type);
    this.drawer = this.dataDrawer;
  }

  backToDashboard() {
    if (isAdmin()) {
      this.$router.push({ name: 'admin' });
    } else if (isGeneralManager()) {
      this.$router.push({ name: 'general' });
    } else if (isGeneralHRA()) {
      this.$router.push({ name: 'general-hr-attendance' });
    } else if (isGeneralHRP()) {
      this.$router.push({ name: 'general-hr-payroll' });
    } else if (isBranchManager()) {
      this.$router.push({ name: 'branch' });
    } else if (isBranchHRA()) {
      this.$router.push({ name: 'branch-hr-attendance' });
    } else if (isBranchHRP()) {
      this.$router.push({ name: 'branch-hr-payroll' });
    } else if (isOwner()) {
      this.$router.push({ name: 'owner' });
    }
  }
}
</script>

<style lang="css">
.v-card:not(.v-sheet--tile) {
  border-radius: 8px;
}
.theme--dark.v-list-item:hover::before {
  opacity: 0.5 !important;
  background: #ff7155 !important;
  color: white !important;
  border-radius: 8px !important;
}
.theme--dark.v-list-item--active::before,
.theme--dark.v-list-item--active:hover::before,
.theme--dark.v-list-item:focus::before {
  opacity: 0 !important;
}
.v-toolbar__content {
  width: 100%;
}
.list-active .v-list-item--active {
  background: #df2702;
  border-radius: 8px;
}
.flex-row img {
  margin: 0 auto !important;
}
.flex-row .headline {
  flex-grow: 1;
}
.icon-box {
  min-width: 50px !important;
}
.icon-card {
  height: 45px;
  padding: 10px;
  border-radius: 8px;
}
.relative {
  position: relative !important;
}
.action {
  opacity: 0;
  transition: all ease 500ms;
  position: absolute;
  top: 25px;
  right: 20px;
  z-index: 200;
}
.action-active {
  opacity: 1 !important;
}
.card-custom::before {
  content: '' !important;
  background-image: url('./assets/intersect2.svg') !important;
  background-repeat: no-repeat !important;
  opacity: 1 !important;
  background-position: right !important;
  background-color: rgba(255, 255, 255, 0) !important;
  width: 100%;
  height: 100%;
  top: -24px !important;
  transition: 500ms all ease;
  position: absolute;
}
.card-hover {
  transition: 500ms all ease;
  border-top: 4px solid #ffffff !important;
}
.card-hover:hover {
  border-top: 4px solid #f94f2e !important;
}
.round {
  border-radius: 8px !important;
}
.round-bottom {
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}
.round-top {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  border-top-left-radius: 8px !important;
  border-top-right-radius: 8px !important;
}
.box-icon {
  padding: 10px;
  border-radius: 8px;
}
.font-sm {
  font-size: 12px;
}
.font-md {
  font-size: 14px !important;
}
.font-lg {
  font-size: 20px;
}
.font-16 {
  font-size: 16px;
}
.number button {
  text-align: center;
  margin: 5px;
  border-radius: 7px;
  height: 50px !important;
}
.text-link {
  cursor: pointer !important;
}
.text-link:hover {
  color: blue;
}
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  background: #ffffff;
}
.cursor-pointer {
  cursor: pointer !important;
}
</style>
