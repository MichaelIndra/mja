
<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">assessment</v-icon>
          <div>Data Laporan Terlambat</div>
        </div>
      </v-col>
      <div class="flex-grow-1"></div>
      <v-col class="text-right py-0"></v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <!-- <v-row>
      <v-col cols="12" sm="6" md="12" class="text-right">
        <v-btn
          :outlined="!filter"
          class="elevation-0"
          :color="filter ? 'primary' : 'grey darken-1'"
          @click="showFilter"
        >
          <v-icon class="mr-2" small>filter_list</v-icon>
          <span>Filter</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider v-if="filter"></v-divider>-->
    <filters
      :options="filterOption"
      v-on:getListData="getListData($event)"
      v-on:checkFilter="checkFilter($event)"
      v-if="filter"
    ></filters>

    <v-card class="mb-3">
      <v-card-text>
        <v-data-table
          sort-by="employee.name"
          :headers="headers"
          :items="listPayslipReportLeaveAndLate"
          :options.sync="options"
          :server-items-length="totalData"
          :loading="isLoading"
          class="elevation-0"
          hide-default-footer
        >
          <!-- <template v-slot:item.total="{ item }">cuk</template> -->
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="blue"
              class="elevation-0"
              dark
              small
              v-if="item.employee_meta.department.meta.payslip_type === '1' || item.employee_meta.department.meta.payslip_type === '2' && item.employee_meta.department.meta.payslip_filter === 1"
              @click="showDetail(item.id, item.employee_meta.department.meta.payslip_type)"
            >Detail</v-btn>
            <v-btn v-else disabled small>Detail</v-btn>
          </template>
        </v-data-table>
        <pagination
          v-if="listPayslipReportLeaveAndLate.length > 0"
          v-on:getListData="getListReport($event)"
        ></pagination>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-container>
</template>

<script src="./reportPayslipDeduction.ts"></script>