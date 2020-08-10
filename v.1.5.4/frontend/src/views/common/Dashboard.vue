
<template>
  <v-container class="pa-2" fluid>
    <div class="d-flex flex-row justify-space-between align-center">
      <div class="title d-flex flex-row">
        <v-icon color="grey" class="mr-2">home</v-icon>
        <div>Beranda Sistem HR</div>
      </div>
      <div class="grey--text darken-2 subtitle">Terakhir diperbarui 04 Oktober 2019</div>
    </div>
    <v-row>
      <v-col class="flex-grow-1">
        <v-card class="mx-auto pa-4" min-height="150" elevation="10">
          <div class="d-flex flex-row justify-space-between">
            <div>
              <v-list-item three-line>
                <v-list-item-avatar class="avatar-dashboard"  size="40" color="#f94f2e">
                  <v-icon color="white">person</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="display-1 font-weight-bold mb-1"
                  >{{ listEmployee.length }}</v-list-item-title>
                  <div class="font-weight-medium subheading">Total karyawan</div>
                  <div class="mt-2 caption grey--text">07/09/2019</div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <v-divider vertical class="mx-7"></v-divider>
            <div>
              <v-list-item three-line>
                <v-list-item-avatar class="avatar-dashboard"  size="40" color="green">
                  <v-icon color="white">person</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="display-1 font-weight-bold mb-1"
                  >{{ listDepartment.length }}</v-list-item-title>
                  <div class="font-weight-medium subheading">Total Departemen</div>
                  <div class="mt-2 caption grey--text">07/09/2019</div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col class="flex-grow-0">
        <v-card color="#f94f2e" class="pa-4" dark width="350" min-height="150" elevation="10">
          <div class="pa-2">
            <div>Total Pengeluaran</div>
            <div class="mt-3 d-flex flex-row align-end justify-space-between">
              <div class="display-1 font-weight-bold mb-1">Rp150 juta</div>
              <div>04/10</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./dashboard.ts"></script>

<style lang="css">
.v-application .elevation-10 {
  box-shadow: 0 9px 18px 3px rgba(0, 0, 0, 0.12) !important;
}
.avatar-dashboard {
  border-radius: 5px;
}
.subtitle {
  font-size: 12px;
}
</style>