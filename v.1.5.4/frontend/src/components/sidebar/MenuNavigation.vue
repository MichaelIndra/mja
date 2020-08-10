<template>
  <div>
    <div class="px-5 py-5">
      <div v-if="!mini && drawer" class="d-flex align-center flex-row mb-2">
        <img style="width: 25px;" src="../../assets/logo-main.svg" />
        <div class="white--text ml-2 font-weight-bold headline">ePayroll</div>
      </div>
      <div class="subtitle white--text">Attendance and Payroll System</div>
    </div>
    <v-divider></v-divider>
    <v-list dense class="list-active px-3">
      <template v-for="(menu, key) in menus">
        <v-subheader
          :key="key"
          v-if="menu.header && userRole[0] === menu.role && !mini"
          class="mx-2"
        >{{ menu.header }}</v-subheader>
        <v-list-item
          v-else-if="userRole[0] === menu.role"
          :key="menu.title"
          :to="{ name: menu.routeName }"
        >
          <v-list-item-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <!-- <v-divider></v-divider> -->
      <!-- <v-list-item @click="confirmLogout()">
        <v-list-item-action>
          <v-icon>mdi-exit-to-app</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>-->
    </v-list>

    <v-footer class="text-center" color="primary" fixed>
      <!-- <v-spacer></v-spacer> -->
      <div class="text-center" style="width:100%; font-size: 12px;">v{{APP_VERSION}}</div>
    </v-footer>
  </div>
</template>
<script src="./menuNavigation.ts"></script>
