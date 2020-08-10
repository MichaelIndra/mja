<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">equalizer</v-icon>
          <div>Data Laporan Pengeluran</div>
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
    <v-divider v-if="filter" class="mb-3"></v-divider>-->
    <filters :options="filterOption" @getListData="getListData" v-if="filter"></filters>

    <v-card class="mb-5">
      <v-card-text>
        <div class="d-flex mt-0 mb-4 flex-row align-center justify-space-between">
          <div style="width: 60%">
            <div class="black--text body-1">Rincian Pengeluaran Per Departemen</div>
            <div>Data pengeluaran berdasarkan data periode tanggal mulai dan tanggal selesai</div>
          </div>
          <!-- <div style="width: 40%" class="d-flex flex-row align-center justify-space-between">
            <div>
              <div>Filter Tanggal Mulai</div>
              <div class="black--text" style="font-size: 20px;">
                <strong>{{ dataFilter.start_at }}</strong>
              </div>
            </div>
            <v-divider vertical></v-divider>
            <div>
              <div>Filter Tanggal Selesai</div>
              <div class="black--text" style="font-size: 20px;">
                <strong>{{ dataFilter.end_at }}</strong>
              </div>
            </div>
          </div>-->
        </div>
        <v-divider></v-divider>
        <v-row v-if="outcomePerDepartment.length > 0">
          <v-col v-for="(item, index) in outcomePerDepartment" :key="index" cols="3">
            <div>
              <div>{{ item.department_name }}</div>
              <div class="black--text mt-3" style="font-size: 24px;">{{ formatPrice(item.total) }}</div>
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
          :headers="headers"
          :items="outcomes"
          :items-per-page="30"
          :loading="loading"
          :no-data-text="'Tidak ada data untuk filter ini, silahkan pilih \'TAMPILKAN SEMUA\' pada filter departemen untuk me-reset filter'"
          class="elevation-0"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn class="elevation-0" small disabled v-if="item.is_disabled">Detail Pengeluaran</v-btn>
            <v-btn
              v-else
              color="blue"
              class="elevation-0"
              dark
              small
              @click="showDetail(item.id)"
            >Detail Pengeluaran</v-btn>
          </template>
        </v-data-table>
        <!-- <pagination v-if="outcomes.length > 0" v-on:getListData="getListReport($event)"></pagination> -->
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-container>
</template>

<script lang="ts" src="./reportOutcome.ts"></script>