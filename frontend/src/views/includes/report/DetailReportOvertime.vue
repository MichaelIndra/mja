<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">person</v-icon>
          <div>Detail Laporan Payslip Lembur</div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-btn @click="backToReport" color="blue" dark class="mb-3 elevation-0">Kembali</v-btn>

    <v-card class="mb-3">
      <v-card-text>
        <div class="d-flex flex-row align-center justify-space-between">
          <div>
            <div>Periode Mulai</div>
            <div class="title black--text">{{ overtime.start_at }}</div>
          </div>
          <div>
            <div>Periode Selesai</div>
            <div class="title black--text">{{ overtime.end_at }}</div>
          </div>
          <div>
            <div>Karyawan</div>
            <div class="title black--text">{{ overtime.employee_count }} Orang</div>
          </div>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-data-table
          sort-by="employee.name"
          :headers="headers"
          :items="employeeOvertime"
          :items-per-page="30"
          :loading="loading"
          class="elevation-0"
        ></v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" src="./detailReportOvertime.ts"></script>