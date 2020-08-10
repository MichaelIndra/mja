<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">person</v-icon>
                <div>Cetak Payslip Tersimpan Karyawan</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
              <!--              <div class="grey&#45;&#45;text font-sm">Total Karyawan : 100</div>-->
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
        </div>
      </v-col>
    </v-row>
    <div>
      <v-card>
        <v-card-text>
          <v-row align="center" class="mb-5">
            <v-col cols="4" class="py-0">
              <div>Departemen</div>
              <div class="black--text mt-3" style="font-size: 24px;">{{ department.name }}</div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div>Jenis Payslip</div>
              <div
                class="black--text mt-3"
                style="font-size: 24px;"
              >{{ $route.params.payslipFilter === '1' ? 'Mingguan' : $route.params.payslipFilter === '2' ? 'Bulanan' : '-' }}</div>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="4" class="py-0">
              <div>Jumlah Karyawan</div>
              <div class="black--text mt-3" style="font-size: 24px;">{{ listPayslip.length }} Orang</div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div>Periode</div>
              <div class="black--text mt-3" style="font-size: 24px;">{{ periodePayslip }}</div>
            </v-col>
          </v-row>
          <v-row align="center" class="mt-5">
            <v-col v-if="userRole && userRole[0] === 'owner'" cols="10" class="py-0">
              <div>Total Pengeluaran Owner Periode Ini</div>
              <div
                class="black--text mt-3"
                style="font-size: 24px;"
              >{{ convertFormatPrice(totalEmployeeSalaryOfCurrentPeriodByOwner) }}</div>
            </v-col>
            <v-col v-else cols="10" class="py-0">
              <div>Total Pengeluaran Periode Ini</div>
              <div
                class="black--text mt-3"
                style="font-size: 24px;"
              >{{ convertFormatPrice(totalEmployeeSalaryOfCurrentPeriod) }}</div>
            </v-col>
          </v-row>
          <v-divider class="mt-5" style="border-style: dashed; border-width: .5px;"></v-divider>
          <!-- <v-btn
            v-if="listPayslip.length > 0"
            color="primary"
            class="elevation-0 mr-5"
            dark
            @click="printPayslip"
          >
            <v-icon class="mr-2">print</v-icon>
            <span>Cetak Payslip Tersimpan</span>
          </v-btn>-->
          <v-row
            align="center"
            v-if="!printLoading && !isPayslipGenerated && statusPrint === 'not-done'"
          >
            <v-col cols="12">
              <v-alert
                type="warning"
              >Data yang telah dicetak tidak dapat di ubah kembali, pastikan data yang akan dicetak telah sesuai</v-alert>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-divider class="mt-0 mb-3" style="border-style: dashed; border-width: .5px;"></v-divider>
            </v-col>
            <v-col cols="12">
              <!-- <v-btn color="grey darken-1" class="elevation-0 mr-5" dark @click="cancelPrint">
                <v-icon class="mr-2">chevron_left</v-icon>
                <span>Batal</span>
              </v-btn>-->
              <v-btn
                v-if="listPayslip.length > 0"
                color="primary"
                class="elevation-0 mr-5"
                dark
                @click.prevent.stop="printPayslip"
              >
                <v-icon class="mr-2">print</v-icon>
                <span>Cetak Payslip Tersimpan</span>
              </v-btn>
              <span v-else>
                <v-btn color="primary" disabled>
                  <v-icon class="mr-2">print</v-icon>
                  <span>Cetak Payslip Tersimpan</span>
                </v-btn>
                <span class="ml-3">Payslip tidak dapat dicetak, karena data kosong</span>
              </span>
            </v-col>
          </v-row>
          <div class="d-flex flex-row align-center pt-4" v-else-if="statusPrint === 'done'">
            <v-btn color="primary darken-1" class="elevation-0 mr-3" dark @click="finishPrint">
              <span>Selesai</span>
            </v-btn>
            <span>Proses pencetakan payslip selesai</span>
          </div>
          <!-- loading push bulk and generate pdf -->
          <v-row v-if="printLoading" align="center">
            <v-col cols="12">
              <v-progress-linear
                background-color="grey lighten-3"
                color="primary"
                height="8"
                indeterminate
              ></v-progress-linear>
              <div class="mt-3">Mohon menunggu, proses pencetakan payslip...</div>
            </v-col>
          </v-row>
          <!-- loading push bulk and generate pdf -->
        </v-card-text>
      </v-card>
      <!-- paylsip toko mingguan -->
      <div
        class="hide-table"
        v-if="$route.params.payslipType === '2' &&
      $route.params.payslipFilter === '1'"
      >
        <table
          class="mb-10"
          :id="`table-payslip-toko-weekly${index}`"
          v-for="(data, index) in listPayslip"
          :key="index"
        >
          <toko-weekly :data="data"></toko-weekly>
        </table>
      </div>
      <!-- payslip toko bulanan -->
      <div
        class="hide-table"
        v-if="$route.params.payslipType === '2' &&
      $route.params.payslipFilter === '2'"
      >
        <table
          class="mb-10"
          :id="`table-payslip-toko-monthly${index}`"
          v-for="(data, index) in listPayslip"
          :key="index"
        >
          <toko-monthly :data="data"></toko-monthly>
        </table>
      </div>
      <!-- payslip produksi mingguan -->
      <div
        class="hide-table"
        v-if="$route.params.payslipType === '1' &&
      $route.params.payslipFilter === '1'"
      >
        <table
          class="mb-10"
          :id="`table-payslip-produksi${index}`"
          v-for="(data, index) in listPayslip"
          :key="index"
        >
          <produksi-weekly :data="data"></produksi-weekly>
        </table>
      </div>
      <!-- payslip office bulanan -->
      <div
        class="hide-table"
        v-if="$route.params.payslipType === '3' &&
      $route.params.payslipFilter === '2' && userRole[0] !== 'owner'"
      >
        <table
          class="mb-10"
          :id="`table-payslip-office${index}`"
          v-for="(data, index) in listPayslip"
          :key="index"
        >
          <office-monthly :data="data"></office-monthly>
        </table>
      </div>
      <!-- payslip office-bulanan owner -->
      <div
        class="hide-table"
        v-if="$route.params.payslipType === '3' &&
      $route.params.payslipFilter === '2' && userRole[0] === 'owner'"
      >
        <table
          class="mb-10"
          :id="`table-payslip-office-owner${index}`"
          v-for="(data, index) in listPayslip"
          :key="index"
        >
          <office-owner :data="data"></office-owner>
        </table>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" src="./printPayslip.ts"></script>

<style lang="css">
.hide-table {
  display: none;
}
table {
  border-collapse: collapse;
  width: 100%;
}
.print-table td,
.print-table th {
  border: 1px solid #595959;
  padding: 3px;
  min-width: 50px;
  height: 25px;
}
.new-row {
  border: 1px solid #eeeeee;
  border-left: 2px solid #000;
  border-right: 2px solid #000;
}
.new-row td {
  padding: 3px;
  width: 30px;
  height: 25px;
  border-collapse: collapse;
}
.bo-l {
  border-left: 2px solid #000;
}
.bo-r {
  border-right: 2px solid #000;
}
.bo-t {
  border-top: 2px solid #000 !important;
}
.bo-b {
  border-bottom: 2px solid #000 !important;
}
.bi-l {
  border-left: 1px solid #000;
}
.bi-r {
  border-right: 1px solid #000;
}
.bi-t {
  border-top: 1px solid #000;
}
.bi-b {
  border-bottom: 1px solid #000;
}
.grid-payslip tr {
  padding: 3px;
  width: 30px;
  height: 25px;
  border-collapse: collapse;
  border-right: 2px solid #000;
  border-left: 2px solid #000;
}
.grid-payslip table,
.grid-payslip td,
.grid-payslip th {
  color: #000;
  width: 100%;
  border: 1px solid #eeeeee;
  border-collapse: collapse;
}
.grid-payslip td,
.grid-payslip th {
  padding: 3px;
  width: 30px;
  height: 25px;
  border-collapse: collapse;
}
.grid-payslip th {
  border-collapse: collapse;
  /* background: #f0e6cc; */
}
.grid-payslip .even {
  background: #fbf8f0;
  border-collapse: collapse;
}
.grid-payslip .odd {
  background: #fefcf9;
  border-collapse: collapse;
}
</style>