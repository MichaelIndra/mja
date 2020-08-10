
<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">person</v-icon>
          <div>Detail Laporan Payslip {{ type === 'overtime' ? '(Lembur)' : '(Potongan Terlambat dan Izin)' }}</div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-btn
      :to="{ name: type === 'overtime' ? 'report-payslip-overtime' : 'report-payslip-deduction' }"
      color="blue"
      dark
      class="mb-3 elevation-0"
    >Kembali</v-btn>
    <!-- <v-breadcrumbs class="pa-0 py-4" :items="items" divider=">"></v-breadcrumbs> -->
    <v-card class="mb-3">
      <v-card-text>
        <v-row align="start">
          <v-col cols="10" class="py-0">
            <div class="d-flex flex-row align-center justify-space-between">
              <div>
                <div>Nama</div>
                <strong class="title black--text">{{ detailPayslip.name }}</strong>
              </div>
              <div>
                <div>Departemen</div>
                <strong class="title black--text">{{ detailPayslip.department }}</strong>
              </div>
              <div>
                <div>Periode</div>
                <strong class="title black--text">{{ detailPayslip.periode }}</strong>
              </div>
              <!-- <div>
                <div>Total {{ type === 'overtime' ? 'Biaya Lembur' : 'Potongan' }}</div>
                <strong class="title black--text">{{ totalNominal }}</strong>
              </div>-->
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-data-table
          :headers="type === 'overtime' ? headerOvertime : headerDeduction"
          :items="detailPayslipReport"
          class="elevation-0"
          hide-default-footer
        ></v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script src="./detailReportPayslip.ts"></script>