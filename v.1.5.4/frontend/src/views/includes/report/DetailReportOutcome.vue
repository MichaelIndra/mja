<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">person</v-icon>
          <div>Detail Laporan Payslip Pengeluaran</div>
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
            <div class="title black--text">{{ outcome.start_at }}</div>
          </div>
          <div>
            <div>Periode Selesai</div>
            <div class="title black--text">{{ outcome.end_at }}</div>
          </div>
          <div>
            <div>Karyawan</div>
            <div class="title black--text">{{ outcome.employee_count }}</div>
          </div>
          <div v-if="userRole === 'owner'">
            <div>Total Pengeluaran (HR Payslip)</div>
            <div class="title black--text">{{ outcome.nominal_per_period_hr }}</div>
          </div>
          <div v-else>
            <div>Total Pengeluaran Periode Ini</div>
            <div class="title black--text">{{ outcome.nominal_per_period_hr }}</div>
          </div>
          <div v-if="userRole === 'owner'">
            <div>Total Pengeluaran (Owner)</div>
            <div class="title black--text">{{ outcome.nominal_per_period_owner }}</div>
          </div>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-data-table
          sort-by="employee.name"
          :headers="userRole === 'owner' ? headersOwner : headers"
          :items="employeeOutcome"
          :items-per-page="20"
          :loading="loading"
          class="elevation-0"
        >
          <template v-slot:item.dari_owner="{ item }">
            <v-chip small dark color="green" v-if="item.dari_owner">Owner</v-chip>
            <v-chip small dark color="grey darken-1" v-else>Bukan Owner</v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" src="./detailReportOutcome.ts"></script>