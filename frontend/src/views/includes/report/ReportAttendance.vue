<template>
  <div>
    <v-card v-if="isShown" class="mb-3">
      <v-card-text>
        <div class="d-flex flex-row align-center justify-space-between">
          <div class="flex-grow-1"></div>
          <v-col cols="8">
            <div class="text-center mt-5 mb-2">
              <div class="title black--text">Laporan Keterlambatan Karyawan</div>
              <div>Pilih data departemen, periode dan tanggal untuk mendapatkan data keterlambatan karyawan</div>
            </div>
          </v-col>
          <div class="flex-grow-1"></div>
        </div>
        <div class="d-flex flex-row align-center justify-space-between">
          <div class="flex-grow-1"></div>
          <v-col cols="10">
            <div class="d-flex flex-row align-center justify-space-between">
              <div>
                <div>Data departemen</div>
                <strong class="title black--text">
                  {{
                  choosenDepartment.name ? choosenDepartment.name : '-'
                  }}
                </strong>
              </div>
              <div>
                <div>Tipe Periode</div>
                <strong class="title black--text">
                  {{
                  choosenPeriod.name ? choosenPeriod.name : '-'
                  }}
                </strong>
              </div>
              <div>
                <div>Tanggal Mulai</div>
                <strong class="title black--text">
                  {{
                  dateStart ? formatDate(dateStart, 'short-date') : '-'
                  }}
                </strong>
              </div>
              <div>
                <div>Tanggal Selesai</div>
                <strong class="title black--text">
                  {{
                  dateEnd ? formatDate(dateEnd, 'short-date') : '-'
                  }}
                </strong>
              </div>
            </div>
          </v-col>
          <div class="flex-grow-1"></div>
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
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                      <span>Pilih Periode</span>
                      <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in listPeriod"
                      :key="index"
                      @click="selectPeriode(item.id)"
                    >
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-menu
                  v-if="choosenPeriod.id === 1"
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
                  <v-date-picker v-model="weekStart" @input="date = false"></v-date-picker>
                </v-menu>
                <v-menu
                  v-if="choosenPeriod.id === 2"
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
                <!-- <v-menu
                  v-if="choosenPeriod.id === 3"
                  v-model="year"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on" large class="elevation-0 mr-3">
                      <span>Pilih Tahun</span>
                      <v-icon small class="ml-2">calendar_today</v-icon>
                    </v-btn>
                  </template>
                  <v-date-picker v-model="yearStart" no-title @input="year = false"></v-date-picker>
                </v-menu>-->
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
    <v-card v-else class="mb-3">
      <v-card-text>
        <div class="d-flex flex-row align-center">
          <v-btn @click="clearFilter" dark class="elevation-0 mr-3" color="blue">Kembali</v-btn>
          <div class="title black--text">Data keterlambatan karyawan</div>
        </div>
        <v-data-table
          sort-by="employee.name"
          :headers="headers"
          :items="listPayslipReport"
          class="elevation-0"
          hide-default-footer
        ></v-data-table>
        <template></template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script src="./reportAttendance.ts"></script>
