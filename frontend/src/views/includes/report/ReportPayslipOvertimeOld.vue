<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">assessment</v-icon>
          <div>Data Laporan Lembur</div>
        </div>
      </v-col>
      <div class="flex-grow-1"></div>
      <v-col class="text-right py-0"></v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <filters
      :options="filterOption"
      v-on:getListData="getListData"
      v-on:checkFilter="checkFilter($event)"
      v-if="filter"
    ></filters>
    <v-card class="mb-5">
      <v-card-text>
        <div class="d-flex mt-0 mb-4 flex-row align-center justify-space-between">
          <div style="width: 60%">
            <div class="black--text body-1">Rincian Pengeluaran Per Departemen</div>
            <div>Data pengeluaran lembur berdasarkan data periode tanggal mulai dan tanggal selesai</div>
          </div>
        </div>
        <v-divider></v-divider>
        <v-row v-if="departmentList">
          <v-col v-for="(item, index) in departmentList" :key="index" cols="3">
            <div>
              <div>{{ item.name }}</div>
              <div
                class="black--text mt-3"
                style="font-size: 24px;"
              >{{ formatPrice(item.overtime_total ? item.overtime_total : 0) }}</div>
            </div>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">Tidak ada data</v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-3">
      <v-card-text>
        <v-data-table
          sort-by="employee.name"
          :headers="headers"
          :items="listPayslipReportOvertime"
          :no-data-text="'Tidak ada data untuk filter ini, silahkan pilih \'TAMPILKAN SEMUA\' pada filter departemen untuk me-reset filter'"
          :loading="isLoading"
          class="elevation-0"
        >
          <template v-slot:item.periode="{item}">
            <span
              v-if="
                item.employee_meta.department.meta.payslip_type === '1' ||
                  (item.employee_meta.department.meta.payslip_type === '2' &&
                    item.employee_meta.department.meta.payslip_filter === 1)
              "
            >{{ item.periode }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:item.salary="{item}">
            <span
              v-if="
                item.employee_meta.department.meta.payslip_type === '1' ||
                  (item.employee_meta.department.meta.payslip_type === '2' &&
                    item.employee_meta.department.meta.payslip_filter === 1)
              "
            >{{ item.salary }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:item.overtime_duration="{item}">
            <span
              v-if="
                item.employee_meta.department.meta.payslip_type === '1' ||
                  (item.employee_meta.department.meta.payslip_type === '2' &&
                    item.employee_meta.department.meta.payslip_filter === 1)
              "
            >{{ item.overtime_duration }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:item.overtime_value="{item}">
            <span
              v-if="
                item.employee_meta.department.meta.payslip_type === '1' ||
                  (item.employee_meta.department.meta.payslip_type === '2' &&
                    item.employee_meta.department.meta.payslip_filter === 1)
              "
            >{{ item.overtime_value }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="blue"
              class="elevation-0"
              dark
              small
              v-if="
                item.employee_meta.department.meta.payslip_type === '1' ||
                  (item.employee_meta.department.meta.payslip_type === '2' &&
                    item.employee_meta.department.meta.payslip_filter === 1)
              "
              @click="
                showDetail(
                  item.id,
                  item.employee_meta.department.meta.payslip_type,
                )
              "
            >Detail</v-btn>
            <v-btn v-else disabled small>Detail</v-btn>
          </template>
        </v-data-table>
        <pagination
          v-if="listPayslipReportOvertime.length > 0"
          v-on:getListData="getListReport($event)"
        ></pagination>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-container>
</template>

<script src="./reportPayslipOvertime.ts"></script>
