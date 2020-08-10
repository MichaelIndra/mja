<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">person</v-icon>
                <div>Data Payslip</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
              <div class="grey--text font-sm">{{ convertDate(dateNow, 'long') }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <div class="d-flex flex-row align-start">
            <div
              @click="changeTabActive('process')"
              style="cursor:pointer; width: 50%;"
              :class="{ 'round-top white--text text-center py-3' : true, 'primary white--text': tabActive === 'process', 'grey lighten-1 black--text': tabActive === 'saved' }"
            >
              <div>Payslip Sedang Diproses</div>
            </div>
            <div
              @click="changeTabActive('saved')"
              style="cursor:pointer; width: 50%;"
              :class="{ 'round-top white--text text-center py-3' : true, 'primary white--text': tabActive === 'saved', 'grey lighten-1 black--text': tabActive === 'process' }"
            >
              <div>Payslip Disimpan</div>
            </div>
          </div>
          <v-card
            v-if="listEmployee.length > 0 && tabActive === 'process'"
            class="round-bottom relative card-detail elevation-1 white--text"
          >
            <v-card-text>
              <div>
                <div class="d-flex flex-row mb-4 align-center justify-space-between">
                  <div class="black--text">
                    <v-icon small class="mr-2">info</v-icon>Data payslip yang sedang diolah
                  </div>
                  <div>
                    <span>Jumlah yang disimpan</span>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          @click="showProcess = true"
                          dark
                          small
                          class="blue elevation-0 ml-4"
                        >
                          <span class="font-14 font-weight-regular">
                            <span>{{ listPayslip.length }}</span>
                            <span class="mx-2">/</span>
                            <span>{{ listEmployee.length }}</span>
                          </span>
                          <v-icon class="ml-3" small>people</v-icon>
                        </v-btn>
                      </template>
                      <span>Lihat detail payslip yang telah disimpan</span>
                    </v-tooltip>
                  </div>
                </div>
                <v-divider class="mb-4" style="border-style: dashed; border-width: .5px;"></v-divider>
                <div class="d-flex flex-row justify-space-between align-center mb-0">
                  <div class="py-0 mb-5 d-flex flex-row align-start">
                    <v-icon class="mr-3 box-icon green lighten-5" color="green lighten-2">dashboard</v-icon>
                    <div>
                      <div>Departemen</div>
                      <div
                        class="font-16 font-weight-regular black--text"
                      >{{ employee.department ? employee.department.name : '-' }}</div>
                    </div>
                  </div>
                  <div class="py-0 mb-5 d-flex flex-row align-start">
                    <v-icon class="mr-3 box-icon primary lighten-5" color="primary lighten-2">person</v-icon>
                    <div>
                      <div>Nama Karyawan</div>
                      <div
                        class="font-16 font-weight-regular black--text"
                      >{{ employee.name ? employee.name : '-' }}</div>
                    </div>
                  </div>
                  <div class="py-0 mb-5 d-flex flex-row align-start">
                    <v-icon
                      class="mr-3 box-icon blue lighten-5"
                      color="blue lighten-2"
                    >calendar_today</v-icon>
                    <div>
                      <div>Periode pembuatan payslip</div>
                      <div
                        class="font-16 font-weight-regular black--text"
                      >{{ convertDate($route.params.dateStart, 'medium') }} - {{ convertDate($route.params.dateEnd, 'medium') }}</div>
                    </div>
                  </div>
                  <div class="py-0 mb-5 d-flex flex-row align-center">
                    <v-btn @click="checkConfirm" dark color="primary" class="elevation-0">
                      <span>{{ employee.temp_payslip_data ? 'Ubah' : 'Simpan' }} payslip</span>
                    </v-btn>
                    <v-icon
                      v-if="employee.temp_payslip_data"
                      class="ml-2"
                      color="green"
                    >check_circle</v-icon>
                  </div>
                </div>
                <v-divider style="border-style: dashed; border-width: .5px;"></v-divider>
                <div class="d-flex flex-row justify-space-between align-center my-1">
                  <v-col class="px-0">
                    <v-btn
                      v-if="indexEmployee !== 0"
                      dark
                      @click="previousEmployee(employee.id)"
                      outlined
                      color="grey darken-4"
                      class="elevation-0"
                    >
                      <v-icon>keyboard_arrow_left</v-icon>
                      <span>Data sebelumnya</span>
                    </v-btn>
                    <v-btn v-else disabled color="grey darken-4" class="elevation-0">
                      <v-icon>keyboard_arrow_left</v-icon>
                      <span>Data sebelumnya</span>
                    </v-btn>
                  </v-col>
                  <div class="flex-grow-1"></div>
                  <v-btn outlined color="grey">
                    <span class="mr-2 black--text">Halaman</span>
                    <!-- <v-icon small class="mr-2" color="grey">person</v-icon> -->
                    <span class="black--text">{{ indexEmployee + 1 }}</span>
                    <span class="mx-2 black--text">/</span>
                    <span class="black--text">{{ listEmployee.length }}</span>
                  </v-btn>
                  <div class="flex-grow-1"></div>
                  <v-col class="px-0 text-right">
                    <v-btn
                      v-if="indexEmployee !== listEmployee.length -1"
                      @click="nextEmployee(employee.id)"
                      dark
                      outlined
                      color="grey darken-4"
                      class="elevation-0"
                    >
                      <span>Data selanjutnya</span>
                      <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                    <v-btn v-else disabled color="grey darken-4" class="elevation-0">
                      <span>Data selanjutnya</span>
                      <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                  </v-col>
                </div>
                <div class="grid-payslip" v-if="employee">
                  <table v-if="payslipType === '1'" id="table-payslip" ref="tablePayslip">
                    <tbody>
                      <tr class="bo-t bo-l bo-r">
                        <td colspan="2"></td>
                        <td colspan="1" class="bi-l"></td>
                        <td colspan="2">Tanggal Cetak</td>
                        <td colspan="2">{{ formatDate(dateNow, 'long') }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="2">
                          <strong>CV. Makmur Jaya Abadi</strong>
                          <div>Jl. Jend. Sudirman No.168 A, Kudus</div>
                        </td>
                        <td colspan="1" class="bi-l">Cabang : Pusat</td>
                        <td colspan="2">Kode Karyawan</td>
                        <td colspan="2"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="2"></td>
                        <td colspan="5" class="bi-l"></td>
                      </tr>
                      <tr class="bo-l bo-r bo-t">
                        <td colspan="7" align="center">
                          <strong>SLIP GAJI KARYAWAN</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r bo-b">
                        <td
                          colspan="7"
                          align="center"
                        >Periode {{ convertPeriodDate($route.params.dateStart) }} - {{ convertPeriodDate($route.params.dateEnd) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="7" align="center"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Nama</td>
                        <td colspan="2">
                          <strong>{{ employee.name }}</strong>
                        </td>
                        <td></td>
                        <td>Departemen</td>
                        <td colspan="2">{{ employee.department ? employee.department.name : '-' }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>NIK</td>
                        <td colspan="2">{{ employee.nik }}</td>
                        <td></td>
                        <td>Area Skill/Jabatan</td>
                        <td colspan="2">{{ employee.area.name }} / {{ employee.position.name }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="7"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="3" align="center" class="bo-t bo-b">
                          <strong>PENDAPATAN</strong>
                        </td>
                        <td></td>
                        <td colspan="3" align="center" class="bo-t bo-b bo-l">
                          <strong>POTONGAN</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Gaji Pokok</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(UMRDaily) }}</td>
                        <td></td>
                        <td>Pot.BPJS TK & Kesehatan</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(employee.meta.payslip.astek_deduction) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Lama Kerja</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(workDurationBonus) }}</td>
                        <td></td>
                        <td>Potongan SPSI</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(employee.meta.payslip.spsi_deduction) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Tunjangan Jabatan</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(positionBonus) }}</td>
                        <td></td>
                        <td>Potongan Uang Makan</td>
                        <td>Rp</td>
                        <td align="right">
                          <div v-if="foodDeduction" class="d-flex flex-row align-start">
                            <v-currency-field
                              color="grey darken-2"
                              v-bind="currency_config"
                              v-model="employee.meta.payslip.value_food_deduction"
                              dense
                              class="currency-input pa-0 ma-0 font-md"
                              hide-details
                              filled
                              singleLine
                            ></v-currency-field>
                            <div class="d-flex flex-row">
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="foodDeduction = !foodDeduction"
                                    color="green"
                                    v-on="on"
                                  >check_circle</v-icon>
                                </template>
                                <span>Simpan data</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="foodDeduction = !foodDeduction; employee.meta.payslip.value_food_deduction > 0 ? employee.meta.payslip.value_food_deduction : employee.meta.payslip.value_food_deduction = 0;"
                                    v-on="on"
                                    color="red"
                                    class="mr-1"
                                  >cancel</v-icon>
                                </template>
                                <span>Batal edit</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div
                            v-else
                            class="d-flex flex-row align-center justify-space-between"
                            style="float: right;"
                          >
                            <span
                              class="mr-3"
                            >{{ formatPrice(employee.meta.payslip.value_food_deduction) }}</span>
                            <v-tooltip bottom v-if="isEdited">
                              <template v-slot:activator="{ on }">
                                <v-icon
                                  v-on="on"
                                  @click="foodDeduction = !foodDeduction;"
                                  color="green"
                                >info</v-icon>
                              </template>
                              <span>Edit data</span>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Tunjangan Skill</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(skillBonus) }}</td>
                        <td></td>
                        <td>Potongan Jam Masuk</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(deductionLateCheckin) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Insentif</td>
                        <td style="border-bottom: 1px solid #000;">Rp</td>
                        <td align="right" style="border-bottom: 1px solid #000;">
                          <span>{{ formatPrice(employee.meta.payslip.insentif) }}</span>
                        </td>
                        <td></td>
                        <td>Potongan Bon</td>
                        <td>Rp</td>
                        <td>
                          <div v-if="bonDeduction" class="d-flex flex-row align-start">
                            <v-currency-field
                              color="grey darken-2"
                              v-bind="currency_config"
                              v-model="employee.meta.payslip.value_bon_deduction"
                              dense
                              class="currency-input pa-0 ma-0 font-md"
                              hide-details
                              filled
                              singleLine
                            ></v-currency-field>
                            <div class="d-flex flex-row">
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="bonDeduction = !bonDeduction"
                                    color="green"
                                    v-on="on"
                                  >check_circle</v-icon>
                                </template>
                                <span>Simpan data</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="bonDeduction = !bonDeduction; employee.meta.payslip.value_bon_deduction > 0 ? employee.meta.payslip.value_bon_deduction : employee.meta.payslip.value_bon_deduction = 0;"
                                    v-on="on"
                                    color="red"
                                    class="mr-1"
                                  >cancel</v-icon>
                                </template>
                                <span>Batal edit</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div
                            v-else
                            class="d-flex flex-row align-center justify-space-between"
                            style="float: right;"
                          >
                            <span
                              class="mr-3"
                            >{{ formatPrice(employee.meta.payslip.value_bon_deduction) }}</span>
                            <v-tooltip bottom v-if="isEdited">
                              <template v-slot:activator="{ on }">
                                <v-icon
                                  v-on="on"
                                  @click="bonDeduction = !bonDeduction;"
                                  color="green"
                                >info</v-icon>
                              </template>
                              <span>Edit data</span>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>
                          <strong>Upah 1 hari</strong>
                        </td>
                        <td>
                          <strong>Rp</strong>
                        </td>
                        <td align="right">
                          <strong>{{ formatPrice(totalDailyPayslip) }}</strong>
                        </td>
                        <td></td>
                        <td colspan="3"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>
                          <span>Upah 1 hari x {{ this.totalWorkDuration.currentWorkDays }} Hari</span>
                        </td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(currentWorkDaysPlusDaily) }}</td>
                        <td></td>
                        <td colspan="3"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Extra Full</td>
                        <td>Rp</td>
                        <td align="right">
                          <div v-if="extraFull" class="d-flex flex-row align-start">
                            <v-currency-field
                              color="grey darken-2"
                              v-bind="currency_config"
                              v-model="employee.meta.payslip.value_extra_full"
                              dense
                              class="currency-input pa-0 ma-0 font-md"
                              hide-details
                              filled
                              singleLine
                            ></v-currency-field>
                            <div class="d-flex flex-row">
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="extraFull = !extraFull"
                                    color="green"
                                    v-on="on"
                                  >check_circle</v-icon>
                                </template>
                                <span>Simpan data</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="extraFull = !extraFull; employee.meta.payslip.value_extra_full > 0 ? employee.meta.payslip.value_extra_full : employee.meta.payslip.value_extra_full = 0;"
                                    v-on="on"
                                    color="red"
                                    class="mr-1"
                                  >cancel</v-icon>
                                </template>
                                <span>Batal edit</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div v-else class="d-flex flex-row align-center" style="float: right;">
                            <span
                              class="mr-3"
                            >{{ formatPrice(employee.meta.payslip.value_extra_full) }}</span>
                            <v-tooltip bottom v-if="isEdited">
                              <template v-slot:activator="{ on }">
                                <v-icon
                                  v-on="on"
                                  @click="extraFull = !extraFull;"
                                  color="green"
                                >info</v-icon>
                              </template>
                              <span>Edit data</span>
                            </v-tooltip>
                          </div>
                        </td>
                        <td></td>
                        <td colspan="3"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Lembur</td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(dailyOvertimeReward) }}</td>
                        <td></td>
                        <td colspan="3"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Premi Hari Besar</td>
                        <td class="bi-b" style="border-bottom: 1px solid #000;">Rp</td>
                        <td align="right" class="bi-b" style="border-bottom: 1px solid #000;">
                          <div v-if="holiday" class="d-flex flex-row align-start">
                            <v-currency-field
                              color="grey darken-2"
                              v-bind="currency_config"
                              v-model="employee.meta.payslip.value_holiday"
                              dense
                              class="currency-input pa-0 ma-0 font-md"
                              hide-details
                              filled
                              singleLine
                            ></v-currency-field>
                            <div class="d-flex flex-row">
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="holiday = !holiday"
                                    color="green"
                                    v-on="on"
                                  >check_circle</v-icon>
                                </template>
                                <span>Simpan data</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="holiday = !holiday; employee.meta.payslip.value_holiday > 0 ? employee.meta.payslip.value_holiday : employee.meta.payslip.value_holiday = 0;"
                                    v-on="on"
                                    color="red"
                                    class="mr-1"
                                  >cancel</v-icon>
                                </template>
                                <span>Batal edit</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div v-else class="d-flex flex-row align-center" style="float: right;">
                            <span
                              class="mr-3"
                            >{{ formatPrice(employee.meta.payslip.value_holiday) }}</span>
                            <v-tooltip bottom v-if="isEdited">
                              <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click="holiday = !holiday;" color="green">info</v-icon>
                              </template>
                              <span>Edit data</span>
                            </v-tooltip>
                          </div>
                        </td>
                        <td style="border-bottom: none !important;"></td>
                        <td></td>
                        <td colspan="2" style="border-bottom: 1px solid #000; color: white;">ko</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>
                          <strong>Total Pendapatan</strong>
                        </td>
                        <td>
                          <strong>Rp</strong>
                        </td>
                        <td align="right">
                          <strong>{{ formatPrice(totalIncome) }}</strong>
                        </td>
                        <td></td>
                        <td>
                          <strong>Total Potongan</strong>
                        </td>
                        <td>
                          <strong>Rp</strong>
                        </td>
                        <td align="right">
                          <strong>{{ formatPrice(totalDeduction) }}</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td width="20"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr class="bo-l bo-r bo-t bo-b">
                        <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
                          <strong>PENDAPATAN GAJI = {{ formatPrice(totalIncomeCleanNumber) }}</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r bo-t bo-b">
                        <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
                          <strong>{{ totalIncomeCleanValue }}</strong>
                        </td>
                      </tr>
                      <!-- <tr class="bo-l bo-r bo-t bo-b">
                        <td colspan="7" align="center">SISA SIMPANAN = Rp</td>
                      </tr>-->
                      <tr class="bo-l bo-r">
                        <td colspan="7"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="5"></td>
                        <td colspan="2">Kudus, {{ formatDate(dateNow, 'long') }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="5"></td>
                        <td colspan="2">Disetujui Oleh</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="5"></td>
                        <td colspan="2"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="5"></td>
                        <td colspan="2"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="5"></td>
                        <td colspan="2">{{ userFullName }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="5"></td>
                        <td colspan="2">HR Manager</td>
                      </tr>
                      <tr class="bo-l bo-r bo-b">
                        <td colspan="7"></td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else-if="payslipType === '2'">Toko</div>
                  <div v-else-if="payslipType === '3'">kantor</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card v-else-if="tabActive === 'saved'">
            <v-card-text>
              <v-btn
                v-if="listPayslip.length === listEmployee.length"
                @click="generatePayslip"
                dark
                color="green"
                class="elevation-0 ml-3"
              >Buat Payslip</v-btn>
              <v-btn v-else disabled class="elevation-0 ml-3">Buat Payslip</v-btn>
              <v-row align="center" justify="space-between">
                <v-col class="py-0">
                  <div class="title d-flex flex-row black--text">
                    <v-icon color="grey" class="mr-2">people</v-icon>
                    <div>Daftar payslip yang telah diproses</div>
                  </div>
                </v-col>
              </v-row>
              <div v-if="listPayslip.length <= 0" class="text-center">
                <div class="d-flex flex-row align-start justify-space-between my-10">
                  <img src="../../assets/logo-payslip.svg" style="width: 20%;" />
                </div>
                <div class="title black--text mb-3">Data masih kosong</div>
                <div
                  class="mb-10"
                >Data payslip yang sedang diproses masih kosong, silahkan tambahkan data dengan menyimpan payslip</div>
              </div>
              <div v-else class="mt-5">
                <div v-for="(item, index) in listPayslip" :key="index">
                  <div class="d-flex flex-row align-center justify-space-between py-3">
                    <div>
                      <v-icon class="mr-2">person</v-icon>
                      <span class="black--text">{{item.name}}</span>
                    </div>
                    <v-btn
                      color="primary"
                      small
                      class="elevation-0"
                      @click="selectDetailPayslip(item.id, index)"
                    >Lihat Data Payslip</v-btn>
                  </div>
                  <v-divider v-if="index < listPayslip.length - 1"></v-divider>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card v-else-if="isLoadingEmployee">
            <v-card-text>
              <div class="d-flex flex-column align-center justify-space-between">
                <div class="text-center ma-12">
                  <v-progress-circular indeterminate size="120" width="21" color="orange"></v-progress-circular>
                </div>
                <div class="text-center ma-12">
                  <div class="title">Loading data payslip</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card v-else class="round relative card-detail elevation-1 white--text">
            <v-card-text class="text-center py-10">
              <img src="../../../src/assets/empty-state.png" class="mb-6" alt />
              <div class="title black--text my-2">Data karyawan tidak ditemukan</div>
              <div>Data karyawan tidak ada untuk parameter ini</div>
              <v-btn
                class="mt-5 elevation-0"
                color="primary"
                :to="{name: 'choose-report-payslip'}"
              >Kembali ke filter payslip</v-btn>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmSetPayslip" persistent width="500">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5" v-if="employee.temp_payslip_data">
          <div class="title black--text my-2">Informasi Perubahan Data Payslip</div>
          <div>Apakah anda ingin mengubah data payslip ini?</div>
          <div
            class="font-lg my-2 black--text"
            style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
          >
            <strong>{{ employee.name }}</strong>
          </div>
        </v-card-text>
        <v-card-text class="py-5" v-else>
          <div class="title black--text my-2">Konfirmasi Pembuatan Payslip</div>
          <div>Apakah anda yakin ingin menyimpan data payslip karyawan ini?</div>
          <div
            class="font-lg my-2 black--text"
            style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
          >
            <strong>{{ employee.name }}</strong>
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="6" class="py-0 px-0 pl-2">
            <v-btn
              block
              large
              dark
              class="elevation-0"
              color="grey darken-2"
              @click="confirmSetPayslip = false"
            >Batal</v-btn>
          </v-col>
          <v-col cols="6" class="py-0 px-0 pl-2">
            <v-btn
              block
              large
              dark
              class="elevation-0"
              color="primary"
              @click="savePayslipTemporary"
            >
              <span v-if="employee.temp_payslip_data">Ubah data</span>
              <span v-else>Simpan</span>
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmGeneratePayslip" persistent width="500">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5">
          <!-- <img src="../../../src/assets/power.png" class="my-6" alt /> -->
          <div class="title black--text my-2 mb-5">Konfirmasi Pembuatan Payslip</div>
          <div>Anda belum menyimpan data payslip untuk karyawan ini:</div>
          <div
            class="font-lg my-2 black--text"
            style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
          >
            <strong>{{ employee.name }}</strong>
          </div>
          <div>Silahkan buat payslip terlebih dahulu sebelum melanjukan ke karyawan selanjutnya</div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="12" class="py-0 px-0 pl-2">
            <v-btn
              block
              large
              dark
              class="elevation-0"
              color="primary"
              @click="confirmGeneratePayslip = false"
            >Tutup</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showProcess" persistent width="650">
      <v-card>
        <v-card-text class="py-5">
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row black--text">
                <v-icon color="grey" class="mr-2">people</v-icon>
                <div>Daftar payslip yang telah diproses</div>
              </div>
            </v-col>
            <v-icon @click="showProcess = false">close</v-icon>
          </v-row>
          <div v-if="listPayslip.length <= 0" class="text-center">
            <div class="d-flex flex-row align-start justify-space-between my-10">
              <img src="../../assets/logo-payslip.svg" style="width: 20%;" />
            </div>
            <div class="title black--text mb-3">Data masih kosong</div>
            <div
              class="mb-10"
            >Data payslip yang sedang diproses masih kosong, silahkan tambahkan data dengan menyimpan payslip</div>
          </div>
          <div v-else class="mt-5">
            <div v-for="(item, index) in listPayslip" :key="index">
              <div class="d-flex flex-row align-center justify-space-between py-3">
                <div>
                  <v-icon class="mr-2">person</v-icon>
                  <span class="black--text">{{item.name}}</span>
                </div>
                <v-btn
                  color="primary"
                  small
                  class="elevation-0"
                  @click="selectDetailPayslip(item.id, index)"
                >Lihat Data Payslip</v-btn>
              </div>
              <v-divider v-if="index < listPayslip.length - 1"></v-divider>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./payslip.ts"></script>

<style lang="css" scoped>
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