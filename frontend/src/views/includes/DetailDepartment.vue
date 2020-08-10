<template>
  <v-container class="pa-2 mb-10" fluid>
    <v-row class="mb-3">
      <div class="align-center justify-space-between d-flex flex-row px-3">
        <router-link class="subtitle" :to="{ name: 'department' }">
          <v-icon small color="primary">home</v-icon>
        </router-link>
        <span class="grey--text darken-1 subtitle mx-4">/</span>
        <router-link class="subtitle" :to="{ name: 'department' }">
          <span>Data Departemen</span>
        </router-link>
        <span class="grey--text darken-1 subtitle mx-4">/</span>
        <span class="grey--text darken-1 subtitle">Detail Departemen</span>
      </div>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="round card-custom relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-6">
              <v-icon color="grey" class="mr-2" small>dashboard</v-icon>
              <div class="black--text">Detail Departemen</div>
            </div>
            <v-row class="mb-3" align="center" justify="space-around">
              <v-col class="py-0 d-flex flex-row align-start">
                <v-icon class="mr-3 box-icon orange lighten-5" color="primary lighten-2">info</v-icon>
                <div>
                  <div>Nama Departemen</div>
                  <div class="title font-weight-regular black--text">{{ department.name }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <v-icon
                  class="mr-3 box-icon orange lighten-5"
                  color="primary lighten-2"
                >account_balance</v-icon>
                <div>
                  <div>Periode Pengajian</div>
                  <div
                    class="title font-weight-regular black--text"
                  >{{ department.meta.payslip_filter === 1 ? 'Mingguan' : department.meta.payslip_filter === 2 ? 'Bulanan' : '-' }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <v-icon class="mr-3 box-icon orange lighten-5" color="primary lighten-2">equalizer</v-icon>
                <div>
                  <div>Nama Cabang</div>
                  <div
                    class="title font-weight-regular black--text"
                  >{{ department.branch ? department.branch.name : '-' }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start" style="margin-right: 100px;">
                <v-icon
                  class="mr-3 box-icon orange lighten-5"
                  color="primary lighten-2"
                >calendar_today</v-icon>
                <div>
                  <div>Tanggal Diubah</div>
                  <div
                    class="title font-weight-regular black--text"
                  >{{ formatDate(department.updated_at, 'long') }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- group component -->
    <department-group :departmentId="department.id"></department-group>
    <!-- area & position component -->
    <department-area></department-area>
  </v-container>
</template>

<script lang="ts" src="./detailDepartment.ts"></script>