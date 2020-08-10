
<template>
  <v-container class="pa-2" fluid>
    <v-card class="mb-3">
      <v-card-text>
        <!-- <div class="d-flex flex-row align-start justify-space-between mt-5">
          <img src="../../../src/assets/logo-payslip.svg" style="width: 10%;" />
        </div>-->
        <div class="d-flex flex-row align-center justify-space-between mb-10">
          <div class="flex-grow-1"></div>
          <v-col cols="8">
            <div class="text-center mt-5 mb-2">
              <div class="title black--text">Pilih kategori payslip</div>
              <div>Silahkan pilih departemen, tanggal mulai dan tanggal selesai untuk membuat payslip karyawan</div>
            </div>
          </v-col>
          <div class="flex-grow-1"></div>
        </div>

        <div class="d-flex flex-row align-center justify-space-between">
          <v-row align="start">
            <v-col cols="2"></v-col>
            <v-col cols="3">
              <div>Data departemen</div>
              <strong
                class="title black--text"
              >{{ choosenDepartment.name ? choosenDepartment.name : '-' }}</strong>
            </v-col>
            <v-col cols="3">
              <div>Tipe Payslip</div>
              <strong
                class="title black--text"
              >{{ payslipDuration === 1 ? 'Mingguan' : payslipDuration === 2 ? 'Bulanan' : '-' }}</strong>
            </v-col>
            <v-col cols="3"></v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="2"></v-col>
          <v-divider class="my-5"></v-divider>
          <v-col cols="2"></v-col>
        </v-row>
        <div class="d-flex flex-row align-center justify-space-between">
          <v-row align="start">
            <v-col cols="2"></v-col>
            <v-col cols="3">
              <div>Hari Kerja / Hari Libur</div>
              <strong class="title black--text">{{ totalDayWork }} hari / {{ holidays.length }} hari</strong>
            </v-col>
            <v-col cols="3">
              <div>Tanggal Mulai</div>
              <strong
                class="title black--text"
              >{{ dateStart ? formatDate(dateStart, 'short-date'): '-' }}</strong>
            </v-col>
            <v-col cols="3">
              <div>Tanggal Selesai</div>
              <strong
                class="title black--text"
              >{{ dateEnd ? formatDate(dateEnd, 'short-date'): '-' }}</strong>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <div class="text-center">
          <v-row class="text-center">
            <v-col cols="12" sm="10" style="margin: auto;">
              <div class="d-flex flex-row align-start">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                      <span>Pilih Departemen</span>
                      <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in listDepartments"
                      :key="index"
                      @click="selectDepartment(item.id)"
                    >
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div v-if="choosenDepartment.meta.payslip_type === '1'">
                  <v-menu
                    v-model="date"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                        <span>Pilih Tanggal</span>
                        <v-icon small class="ml-2">calendar_today</v-icon>
                      </v-btn>
                    </template>
                    <v-date-picker
                      :allowed-dates="allowedDates"
                      v-model="dateStart"
                      @input="date = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
                <div v-if="choosenDepartment.meta.payslip_type === '3'">
                  <v-menu
                    v-model="month"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                        <span>Pilih Bulan</span>
                        <v-icon small class="ml-2">calendar_today</v-icon>
                      </v-btn>
                    </template>
                    <v-date-picker v-model="monthStart" type="month" @input="month = false"></v-date-picker>
                  </v-menu>
                </div>
                <div v-if="choosenDepartment.meta.payslip_type === '2'">
                  <v-menu
                    v-if="payslipDuration === 1"
                    v-model="date"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                        <span>Pilih Tanggal</span>
                        <v-icon small class="ml-2">calendar_today</v-icon>
                      </v-btn>
                    </template>
                    <v-date-picker v-model="dateStart" @input="date = false"></v-date-picker>
                  </v-menu>
                  <v-menu
                    v-if="payslipDuration === 2"
                    v-model="month"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                        <span>Pilih Bulan</span>
                        <v-icon small class="ml-2">calendar_today</v-icon>
                      </v-btn>
                    </template>
                    <v-date-picker v-model="monthStart" type="month" @input="month = false" :max="dateNow"></v-date-picker>
                  </v-menu>
                </div>
                <v-menu
                  v-if="choosenDepartment.meta.payslip_type !== '0' && dateStart !== ''"
                  ref="menu"
                  v-model="isHoliday"
                  :close-on-content-click="false"
                  :return-value.sync="holidays"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="green" dark v-on="on" large class="elevation-0 mr-3">
                      <span>Pilih Hari Libur</span>
                      <v-icon small class="ml-2">calendar_today</v-icon>
                    </v-btn>
                  </template>
                  <v-date-picker
                    multiple
                    :show-current="dateStart"
                    color="green"
                    v-model="holidays"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      dark
                      class="eleavation-0 px-3"
                      color="grey"
                      @click="isHoliday = false"
                    >Cancel</v-btn>
                    <v-btn
                      dark
                      class="eleavation-0 px-3"
                      color="green"
                      @click="$refs.menu.save(holidays)"
                    >OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <div class="flex-grow-1"></div>
                <v-btn large class="elevation-0" dark color="blue" @click="saveFilter">
                  <span>Lanjutkan</span>
                  <v-icon small class="ml-2">keyboard_arrow_right</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script src="./choosePayslip.ts"></script>