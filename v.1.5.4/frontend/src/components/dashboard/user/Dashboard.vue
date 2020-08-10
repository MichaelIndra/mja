<template>
  <v-container class="pa-2" fluid>
    <div class="d-flex flex-row justify-space-between align-center">
      <div class="title d-flex flex-row">
        <v-icon color="grey" class="mr-2">home</v-icon>
        <div v-if="userRole && userRole[0] === 'owner'">Beranda Owner</div>
        <div v-else-if="userRole">Beranda</div>
        <div v-else>Beranda</div>
      </div>
      <div class="grey--text darken-2 subtitle">Terakhir diperbarui {{ newDateLong }}</div>
    </div>
    <v-row align="start">
      <v-col cols="4">
        <div>
          <v-col cols="12">
            <v-card @click="goToEmployee" dark class="elevation-0 round" color="blue">
              <v-card-text>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="display-2 font-weight-bold mb-3">
                      {{ totalEmployee.total_active_employee }}
                      <span class="font-lg">Orang</span>
                    </v-list-item-title>
                    <div class="d-flex flex-row align-center">
                      <v-icon class="mr-3 box-icon white lighten-5" color="blue">info</v-icon>
                      <div>
                        <div class="font-weight-medium subheading">Total Karyawan Aktif</div>
                        <div class="caption">
                          Terakhir diperbarui
                          <strong>{{ newDate }}</strong>
                        </div>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              :to="{ name: 'report-payslip-outcome' }"
              dark
              color="green"
              class="round elevation-0"
            >
              <v-card-text>
                <div class="pa-2">
                  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                    <v-icon class="mr-2" color="white" size="30">info</v-icon>
                    <div style="color: white;font-size: 16px;">
                      <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                        Pengeluaran Bulan
                        <strong>{{ thisMonth }}</strong>
                      </div>
                      <div>Periode ({{ currentMonthStartAndEndDate }})</div>
                    </div>
                  </div>
                  <div
                    style="font-size: 26px; color: white;"
                    class="font-weight-bold mb-3 ml-9"
                  >{{ formatPrice(totalExpense.current_total) }}</div>
                  <v-divider class="my-2"></v-divider>
                  <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                    <v-icon class="mr-2" color="white" size="30">info</v-icon>
                    <div style="color: white;font-size: 16px;" class="mb-2">
                      <div style="font-size: 16px; font-weight: bold;  margin-bottom: 5px;">
                        Pengeluaran Bulan
                        <strong>{{ previousMonth }}</strong>
                      </div>
                      <div>Periode ({{ previousMonthStartAndEndDate }})</div>
                    </div>
                  </div>
                  <div
                    style="font-size: 26px; color: white;"
                    class="font-weight-bold mb-1 ml-9"
                  >{{ formatPrice(totalExpense.before_total) }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              :to="{ name: 'report-payslip-overtime' }"
              dark
              color="primary"
              class="round elevation-0"
            >
              <v-card-text class="relative">
                <v-row justify="space-between">
                  <div class="pa-2" style="color: white;font-size: 16px; width: 100%;">
                    <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                      <v-icon class="mr-2" color="white" size="30">info</v-icon>
                      <div style="color: white;font-size: 16px;" class="mb-2">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                          Pengeluaran Lembur Bulan
                          <strong>{{ thisMonth }}</strong>
                        </div>
                        <div>Periode ({{ currentMonthStartAndEndDate }})</div>
                      </div>
                    </div>
                    <div
                      style="font-size: 26px; color: white;"
                      class="font-weight-bold mb-3 ml-9"
                    >{{ formatPrice(totalExpense.total_overtime_current) }}</div>
                    <v-divider class="my-3"></v-divider>
                    <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                      <v-icon class="mr-2" color="white" size="30">info</v-icon>
                      <div style="color: white;font-size: 16px;" class="mb-2">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                          Pengeluaran Lembur Bulan
                          <strong>{{ previousMonth }}</strong>
                        </div>
                        <div>Periode ({{ previousMonthStartAndEndDate }})</div>
                      </div>
                    </div>
                    <div
                      style="font-size: 26px; color: white;"
                      class="font-weight-bold mb-1 ml-9"
                    >{{ formatPrice(totalExpense.total_overtime_before) }}</div>
                  </div>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="round relative card-detail elevation-1">
              <v-card-text class="relative">
                <div class="d-flex flex-row mb-3">
                  <v-icon color="grey" class="mr-2" small>people</v-icon>
                  <div class="black--text">Ulang Tahun Paling Dekat</div>
                </div>
                <div v-for="(item, index) in listCurrentEmployeeBirthday" :key="index">
                  <div class="py-2 px-2">
                    <div class="d-flex flex-row align-start mb-2">
                      <div style="width: 100%;">
                        <div class="d-flex flex-row align-start justify-space-between">
                          <div>
                            <div style="color: black;">{{ item.employeeName }}</div>
                            <div class="font-sm">{{ item.dateOfBirth }}</div>
                          </div>
                          <div v-if="!item.isBirthday">{{ item.differenceFromNow }} hari lagi</div>
                          <div v-else>
                            <v-icon small>cake</v-icon>
                          </div>
                        </div>
                        <v-chip class="mt-2" dark color="primary" v-if="item.isBirthday">
                          <v-icon small class="mr-2">cake</v-icon>
                          {{ item.employeeName }} Ulang Tahun
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  <v-divider v-if="index !== listCurrentEmployeeBirthday.length - 1"></v-divider>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </div>
      </v-col>
      <v-col cols="8">
        <v-card class="round mt-3 relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-3">
              <v-icon color="grey" class="mr-2" small>people</v-icon>
              <div class="black--text">Karyawan Paling Terlambat Bulanan</div>
            </div>
            <v-row justify="space-between">
              <v-col>
                <v-menu
                  v-model="date"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="blue" dark v-on="on" class="elevation-0 mr-3">
                      <span>Pilih Bulan</span>
                    </v-btn>
                  </template>
                  <v-date-picker color="blue" v-model="dateStart" type="month" @input="inputFilter"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="black--text">
                <div>
                  Bulan:
                  <strong>{{ monthName }}</strong>
                </div>
              </v-col>
              <v-col class="black--text">
                <div>Total: {{ listEmployeeLateMonthly.length }} Karyawan</div>
              </v-col>
            </v-row>
            <v-simple-table max-height="400">
              <thead>
                <tr>
                  <td>
                    <strong>Nama Karyawan</strong>
                  </td>
                  <td>
                    <strong>Departemen</strong>
                  </td>
                  <td>
                    <strong>Total Izin</strong>
                  </td>
                  <td>
                    <strong>Total Terlambat</strong>
                  </td>
                </tr>
              </thead>
              <template v-if="listEmployeeLateMonthly.length > 0">
                <tbody>
                  <tr v-for="(item, index) in listEmployeeLateMonthly" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.department_name }}</td>
                    <td>{{ item.leave_duration }}</td>
                    <td>{{ item.late_duration }}</td>
                  </tr>
                </tbody>
              </template>
              <template v-else>
                <tbody>
                  <tr align="center">
                    <td colspan="4">Data tidak tersedia</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
        <v-card class="round mt-6 relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-3">
              <v-icon color="grey" class="mr-2" small>people</v-icon>
              <div class="black--text">Karyawan Paling Terlambat Mingguan</div>
            </div>
            <v-row justify="space-between">
              <v-col>
                <v-menu
                  v-model="date2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="blue" dark v-on="on" class="elevation-0 mr-3">
                      <span>Pilih Tanggal</span>
                    </v-btn>
                  </template>
                  <v-date-picker color="blue" v-model="dateStartWeekly" @input="inputFilterWeekly"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="black--text">
                <div>
                  Periode :
                  <strong>{{ readableDate(dateStartWeekly) +" - "+readableDate(dateEndWeekly) }}</strong>
                </div>
              </v-col>
              <v-col class="black--text">
                <div>Total: {{ listEmployeeLateWeekly.length }} Karyawan</div>
              </v-col>
            </v-row>
            <v-simple-table max-height="400">
              <thead>
                <tr>
                  <td>
                    <strong>Nama Karyawan</strong>
                  </td>
                  <td>
                    <strong>Departemen</strong>
                  </td>
                  <td>
                    <strong>Total Izin</strong>
                  </td>
                  <td>
                    <strong>Total Terlambat</strong>
                  </td>
                </tr>
              </thead>
              <template v-if="listEmployeeLateWeekly.length > 0">
                <tbody>
                  <tr v-for="(item, index) in listEmployeeLateWeekly" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.department_name }}</td>
                    <td>{{ item.leave_duration }}</td>
                    <td>{{ item.late_duration }}</td>
                  </tr>
                </tbody>
              </template>
              <template v-else>
                <tbody>
                  <tr align="center">
                    <td colspan="4">Data tidak tersedia</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
        <v-card class="round mt-3 relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-3">
              <v-icon color="grey" class="mr-2" small>alarm_on</v-icon>
              <div class="black--text">Karyawan Paling Rajin</div>
            </div>
            <v-row justify="space-between">
              <v-col>
                <v-menu
                  v-model="date3"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="blue" dark v-on="on" class="elevation-0 mr-3">
                      <span>Pilih Bulan</span>
                    </v-btn>
                  </template>
                  <v-date-picker
                    color="blue"
                    v-model="dateStartDiligent"
                    type="month"
                    @input="inputFilterDiligent"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="black--text">
                <div>
                  Bulan:
                  <strong>{{ monthNameDiligent }}</strong>
                </div>
              </v-col>
              <v-col class="black--text">
                <div>Total: {{ listEmployeeDiligentMonthly.length }} Karyawan</div>
              </v-col>
            </v-row>
            <v-simple-table max-height="400">
              <thead>
                <tr>
                  <td>
                    <strong>Nama Karyawan</strong>
                  </td>
                  <td>
                    <strong>Departemen</strong>
                  </td>
                  <td>
                    <strong>Total Terlambat</strong>
                  </td>
                  <td>
                    <strong>Total Izin</strong>
                  </td>
                  <td>
                    <strong>Total Jam Kerja</strong>
                  </td>
                </tr>
              </thead>
              <template v-if="listEmployeeDiligentMonthly.length > 0">
                <tbody>
                  <tr v-for="(item, index) in listEmployeeDiligentMonthly" :key="index">
                    <td>{{ item.employee_name }}</td>
                    <td>{{ item.department_name }}</td>
                    <td>{{ item.total_late }}</td>
                    <td>{{ item.total_leave }}</td>
                    <td>{{ item.total_work }}</td>
                  </tr>
                </tbody>
              </template>
              <template v-else>
                <tbody>
                  <tr align="center">
                    <td colspan="4">Data tidak tersedia</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="mt-0">
      <v-col cols="8" sm="8">
        <!-- <v-card class="round relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-3">
              <v-icon color="grey" class="mr-2" small>people</v-icon>
              <div class="black--text">
                Karyawan Paling Terlambat Mingguan
              </div>
            </div>
            <v-row justify="space-between">
              <v-col>
                <v-menu
                  v-model="date"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="blue" dark v-on="on" class="elevation-0 mr-3">
                      <span>Pilih Bulan</span>
                    </v-btn>
                  </template>
                  <v-date-picker
                    color="blue"
                    v-model="dateStart"
                    type="month"
                    @input="inputFilter"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="black--text">
                <div>
                  Bulan:
                  <strong>{{ monthName }}</strong>
                </div>
              </v-col>
              <v-col class="black--text">
                <div>Total: {{ listEmployeeLate.weekly.length }} Karyawan</div>
              </v-col>
            </v-row>
            <v-simple-table height="250">
              <thead>
                <tr>
                  <td>
                    <strong>Nama Karyawan</strong>
                  </td>
                  <td>
                    <strong>Departemen</strong>
                  </td>
                  <td>
                    <strong>Total Izin</strong>
                  </td>
                  <td>
                    <strong>Total Terlambat</strong>
                  </td>
                </tr>
              </thead>
              <template v-if="listEmployeeLate.weekly.length > 0">
                <tbody>
                  <tr
                    v-for="(item, index) in listEmployeeLate.weekly"
                    :key="index"
                  >
                    <td>{{ item.employee_name }}</td>
                    <td>{{ item.department }}</td>
                    <td>{{ item.leave_duration }}</td>
                    <td>{{ item.late_duration }}</td>
                  </tr>
                </tbody>
              </template>
              <template v-else>
                <tbody>
                  <tr align="center">
                    <td colspan="4">
                      Data tidak tersedia
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>-->
      </v-col>
    </div>
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
