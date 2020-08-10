<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">person</v-icon>
                <div>Data Payslip Kantor</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
              <div class="grey--text font-sm">{{ convertDate(dateNow, 'long') }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <div
            v-if="userRole && userRole[0] === 'owner'"
            class="rounded-card py-3 px-5 green darken-2 white--text mb-3"
          >
            <v-icon color="white" class="mr-3">info</v-icon>
            <span>Data karyawan yang ditampilkan adalah data karyawan khusus</span>
          </div>
          <div class="d-flex flex-row align-start">
            <div
              @click="changeTabActive('process')"
              style="cursor:pointer; width: 50%;"
              :class="{
                'round-top white--text text-center py-3': true,
                'primary white--text': tabActive === 'process',
                'grey lighten-1 black--text': tabActive === 'saved',
              }"
            >
              <div>Payslip Sedang Diproses</div>
            </div>
            <div
              @click="changeTabActive('saved')"
              style="cursor:pointer; width: 50%;"
              :class="{
                'round-top white--text text-center py-3': true,
                'primary white--text': tabActive === 'saved',
                'grey lighten-1 black--text': tabActive === 'process',
              }"
            >
              <div>Payslip Disimpan</div>
            </div>
            <!--<div
              v-else
              style="cursor:pointer; width: 50%;"
              :class="{
                'round-top white&#45;&#45;text text-center py-3': true,
                'grey lighten-1 black&#45;&#45;text': true,
              }"
            >
              <div>Payslip Disimpan</div>
            </div>-->
          </div>
          <v-card v-if="isFilledOwner" class="round relative card-detail elevation-1 white--text">
            <v-card-text class="text-center py-10">
              <img src="../../../../src/assets/empty-state.png" class="mb-6" alt />
              <div class="title black--text my-2">Data karyawan tidak ditemukan</div>
              <div>Data karyawan tidak ada untuk parameter ini</div>
              <v-btn
                class="mt-5 elevation-0"
                color="primary"
                :to="{ name: 'choose-report-payslip' }"
              >Kembali ke filter payslip</v-btn>
            </v-card-text>
          </v-card>
          <v-card
            v-else-if="listEmployee.length > 0 && tabActive === 'process'"
            class="round-bottom relative card-detail elevation-1 white--text"
          >
            <v-card-text>
              <div>
                <div class="d-flex flex-row mb-4 align-center justify-space-between">
                  <!-- <div class="black--text">
                    <v-icon small class="mr-2">info</v-icon>Data payslip yang sedang diolah
                  </div>-->
                  <div>
                    <span>Jumlah yang disimpan</span>
                    <v-btn dark class="blue elevation-0 ml-4">
                      <span class="font-14 font-weight-regular">
                        <span>{{ currentSave }}</span>
                        <span class="mx-2">/</span>
                        <span>{{ listEmployee.length }}</span>
                      </span>
                      <v-icon class="ml-3" small>people</v-icon>
                    </v-btn>
                  </div>
                  <div class="py-0 px-0 d-flex flex-row align-center">
                    <div class="flex-grow-1"></div>
                    <div class="py-0 px-0 d-flex flex-row align-center">
                      <div v-if="userRole && userRole[0] === 'owner'">
                        <v-btn
                          v-if="isHasBeenGeneratedByOwner(employee)"
                          dark
                          color="grey"
                          class="elevation-0"
                        >
                          <span>Payslip Tersimpan</span>
                        </v-btn>
                        <v-btn
                          v-else
                          @click="checkConfirm"
                          dark
                          :color="
                            (employee.temp_payslip_data &&
                            employee.temp_payslip_data.owner_payslip) ||
                            listPayslipCount === listEmployee.length
                              ? 'green'
                              : 'primary'
                          "
                          class="elevation-0"
                        >
                          <span>
                            {{
                            (employee.temp_payslip_data && employee.temp_payslip_data.owner_payslip) || listPayslipCount === listEmployee.length
                            ? 'Ubah payslip'
                            : 'Simpan payslip'
                            }}
                          </span>
                        </v-btn>
                      </div>
                      <div v-else>
                        <v-btn
                          v-if="isHasBeenGenerated(employee)"
                          dark
                          color="grey"
                          class="elevation-0"
                        >
                          <span>Payslip Tersimpan</span>
                        </v-btn>
                        <!-- 
                          (employee.temp_payslip_data &&
                            employee.temp_payslip_data.owner_payslip) ||
                            listPayslipCount === listEmployee.length
                        -->
                        <v-btn
                          v-else
                          @click="checkConfirm"
                          dark
                          :color="
                            employee.temp_payslip_data ||
                            listPayslipCount === listEmployee.length
                              ? 'green'
                              : 'primary'
                          "
                          class="elevation-0"
                        >
                          <span>
                            {{
                            employee.temp_payslip_data || listPayslipCount === listEmployee.length
                            ? 'Ubah payslip'
                            : 'Simpan payslip'
                            }}
                          </span>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <v-divider class="mb-4" style="border-style: dashed; border-width: .5px;"></v-divider>
                <div class="d-flex flex-row align-center mb-0">
                  <v-col cols="3" class="py-0 px-0 mb-5 d-flex flex-row align-start">
                    <v-icon class="mr-3 box-icon green lighten-5" color="green lighten-2">dashboard</v-icon>
                    <div>
                      <div>Departemen</div>
                      <div
                        v-if="userRole && userRole[0] !== 'owner'"
                        class="font-16 font-weight-regular black--text"
                      >{{ employee.department ? employee.department.name : '-' }}</div>
                      <div
                        v-else
                        colspan="2"
                        class="font-16 font-weight-regular black--text"
                      >{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.department.name : '-' }}</div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="py-0 px-0 mb-5 d-flex flex-row align-start">
                    <v-icon class="mr-3 box-icon primary lighten-5" color="primary lighten-2">person</v-icon>
                    <div>
                      <div>Nama Karyawan</div>
                      <div
                        v-if="userRole && userRole[0] !== 'owner'"
                        class="font-16 font-weight-regular black--text"
                      >{{ employee.name ? employee.name : '-' }}</div>
                      <div
                        v-else
                        colspan="2"
                        class="font-16 font-weight-regular black--text"
                      >{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.name : '-' }}</div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="py-0 px-0 mb-5 d-flex flex-row align-start">
                    <v-icon
                      class="mr-3 box-icon blue lighten-5"
                      color="blue lighten-2"
                    >calendar_today</v-icon>
                    <div>
                      <div>Tipe Payslip</div>
                      <div class="font-16 font-weight-regular black--text">
                        {{
                        $route.params.payslipFilter === '1'
                        ? 'Mingguan'
                        : 'Bulanan'
                        }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="py-0 px-0 mb-5 d-flex flex-row align-start">
                    <v-icon
                      class="mr-3 box-icon blue lighten-5"
                      color="blue lighten-2"
                    >calendar_today</v-icon>
                    <div>
                      <div>Periode pembuatan payslip</div>
                      <div class="font-16 font-weight-regular black--text">
                        {{ convertDate($route.params.dateStart, 'medium') }} -
                        {{ convertDate($route.params.dateEnd, 'medium') }}
                      </div>
                    </div>
                  </v-col>
                </div>
                <div class="d-flex flex-row align-center mb-0"></div>
                <v-divider style="border-style: dashed; border-width: .5px;"></v-divider>
                <div class="d-flex flex-row justify-space-between align-center my-1">
                  <v-col class="px-0" v-if="userRole && userRole[0] !== 'owner'">
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
                  <v-col v-else class="px-0">
                    <v-btn
                      v-if="indexEmployee !== 0"
                      dark
                      @click="previousEmployeeOwner(employee.id)"
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
                  <v-col v-if="userRole && userRole[0] !== 'owner'" class="px-0 text-right">
                    <v-btn
                      v-if="indexEmployee !== listEmployee.length - 1"
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
                  <v-col v-else class="px-0 text-right">
                    <v-btn
                      v-if="indexEmployee !== listEmployee.length - 1"
                      @click="nextEmployeeOwner(employee.id)"
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
                  <table id="table-payslip" ref="tablePayslip">
                    <tbody>
                      <!-- <tr class="bo-t bo-l bo-r">
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
                      </tr>-->
                      <tr class="bo-l bo-r bo-t">
                        <td colspan="7" align="center">
                          <strong>SLIP GAJI KARYAWAN</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r bo-b">
                        <td colspan="7" align="center">
                          Periode
                          {{ convertPeriodDate($route.params.dateStart) }} -
                          {{ convertPeriodDate($route.params.dateEnd) }}
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="7" align="center"></td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Nama</td>
                        <td v-if="userRole && userRole[0] !== 'owner'" colspan="2">
                          <strong>{{ employee.name }}</strong>
                        </td>
                        <td v-else colspan="2">
                          <strong>{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.name : '-' }}</strong>
                        </td>
                        <td></td>
                        <td>Departemen</td>
                        <td v-if="userRole && userRole[0] !== 'owner'" colspan="2">
                          {{
                          employee.department ? employee.department.name : '-'
                          }}
                        </td>
                        <td v-else colspan="2">
                          <strong>{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.department.name : '-' }}</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>NIK</td>
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          colspan="2"
                        >{{ employee.nik }}</td>
                        <td v-else colspan="2">
                          <strong>{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.nik : '-' }}</strong>
                        </td>
                        <td></td>
                        <td>Area Skill/Jabatan</td>
                        <td v-if="userRole && userRole[0] !== 'owner'" colspan="2">
                          {{ employee.area ? employee.area.name : '-' }} /
                          {{ employee.position ? employee.position.name : '-' }}
                        </td>
                        <td v-else colspan="2">
                          <strong>{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.area.name : '-' }} / {{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.position.name : '-' }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="7"></td>
                      </tr>
                      <tr class="bo-1 bo-r">
                        <td>Hari Kerja Efektif</td>
                        <td v-if="userRole && userRole[0] !== 'owner'" colspan="2">
                          <span class="mr-3">{{ totalWorkDuration.totalWorkDays }} hari</span>
                        </td>
                        <td
                          v-else
                          colspan="2"
                        >{{ employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_kerja : 0 }} hari</td>
                        <td></td>
                        <td>Total Hari Tidak Masuk</td>
                        <td colspan="2" v-if="userRole && userRole[0] !== 'owner'">
                          {{ totalDayAbsent.dayLeave > 0 ? `${totalDayAbsent.dayLeave} hari` : '' }}
                          {{ totalDayAbsent.hourLeave > 0 ? `${totalDayAbsent.hourLeave} jam` : '' }}
                        </td>
                        <td colspan="2" v-else>
                          <!--<span
                            v-if="totalWorkNett.currentWorkDays > totalWorkDuration.totalWorkDays"
                          >{{ employee.temp_payslip_data ? 0 : employee.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_tidak_masuk }}</span>-->
                          <span>
                            {{ employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_hari : '-' }} Hari
                            {{ employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_izin : '-' }} Jam
                          </span>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Total Hari Masuk</td>
                        <td colspan="2" v-if="userRole && userRole[0] !== 'owner'">
                          {{ `${totalWorkNett.currentWorkDays} hari
                          ${totalWorkNett.currentWorkHours} jam` }}
                        </td>
                        <td colspan="2" v-else>
                          {{
                          `${employee.temp_payslip_data
                          ? employee.temp_payslip_data.payslip_meta
                          .attendance_calculation.workDuration.currentWorkDays
                          : '-'} hari`
                          }}{{` ${employee.temp_payslip_data
                          ? employee.temp_payslip_data.payslip_meta
                          .attendance_calculation.workDuration.currentWorkHours
                          : '-'} jam`}}
                        </td>
                        <td></td>
                        <td>Total Hari Libur</td>
                        <td
                          v-if="userRole && userRole[0]!== 'owner'"
                          colspan="2"
                        >{{totalWorkDuration.totalHolidays}} hari</td>
                        <td v-else colspan="2">
                          {{employee.temp_payslip_data
                          ? employee.temp_payslip_data.payslip_meta
                          .attendance_calculation.total_hari_libur
                          : '-'}} hari
                        </td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td colspan="4"></td>
                        <td>Total Lembur:</td>
                        <td colspan="2">
                          {{`${totalOvertimeDuration.daysOvertime} hari
                          ${totalOvertimeDuration.hoursOvertime} jam` }}
                        </td>
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
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          align="right"
                        >{{ formatPrice(UMRDaily) }}</td>
                        <td
                          v-else
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.base.gaji_pokok : 0) }}</td>
                        <td></td>
                        <td v-if="userRole && userRole[0] !== 'owner'">
                          Potongan Hari Kerja (
                          {{ totalWorkNett.leaveDays > 0 ? `${totalWorkNett.leaveDays} hari` : '' }}
                          {{ totalWorkNett.leaveHours > 0 ? `${totalWorkNett.leaveHours} jam` : '' }} )
                        </td>
                        <td v-else>
                          <span class="mr-2">
                            Potongan hari kerja
                            ({{ employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_hari : '-' }} Hari
                            {{ employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_izin : '-' }} Jam)
                          </span>
                        </td>
                        <td>Rp</td>
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          align="right"
                        >{{ formatPrice(monthlyDayOffDeduction) }}</td>
                        <td
                          align="right"
                          v-else
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.potongan_hari_kerja : 0) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td>Tunjangan jabatan</td>
                        <td class="bo-b">Rp</td>
                        <td
                          class="bo-b"
                          align="right"
                          v-if="userRole && userRole[0] !== 'owner'"
                        >{{ formatPrice(positionBonus) }}</td>
                        <td
                          v-else
                          class="bo-b"
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.base.tunjangan_jabatan : 0) }}</td>
                        <td></td>
                        <td v-if="userRole && userRole[0] !== 'owner'">
                          Potongan terlambat (
                          {{
                          monthlyLateDuration > 0
                          ? `${monthlyLateDuration / 60} menit`
                          : ''
                          }}
                          )
                        </td>
                        <td
                          v-else
                        >Potongan terlambat ({{ employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_bulanan / 60 : '-' }} Menit)</td>
                        <td>Rp</td>
                        <td
                          align="right"
                          v-if="userRole && userRole[0] !== 'owner'"
                        >
                          {{ formatPrice(monthlyLateDeduction) }}
                          <!--{{ formatPrice(0) }}--><!-- set 0 if late calculated as leave-->
                        </td>
                        <td
                          v-else
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.potongan_terlambat : 0) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td></td>
                        <td>Rp</td>
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          align="right"
                        >{{ formatPrice(positionBonus + UMRDaily) }}</td>
                        <td
                          v-else
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.base.gaji_pokok+employee.temp_payslip_data.payslip_meta.base.tunjangan_jabatan : 0) }}</td>
                        <td></td>
                        <td>Pot.BPJS TK & Kesehatan</td>
                        <td>Rp</td>
                        <td align="right">
                          {{
                          formatPrice(employee.meta.payslip.astek_deduction)
                          }}
                        </td>
                      </tr>
                      <tr v-if="userRole && userRole[0] !== 'owner'" class="bo-l bo-r">
                        <td v-if="userRole && userRole[0] !== 'owner'">
                          <strong>Upah 1 hari</strong>
                        </td>
                        <td v-else>
                          <strong>Upah 1 hari</strong>
                        </td>
                        <td>
                          <strong>Rp</strong>
                        </td>
                        <td align="right" v-if="userRole && userRole[0] !== 'owner'">
                          <strong>{{ formatPrice(totalDailyPayslip) }}</strong>
                        </td>
                        <td
                          v-else
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.base.upah_1_hari : 0) }}</td>
                        <td></td>
                        <td colspan="3"></td>
                        <td
                          v-if="userRole && userRole[0] === 'owner'"
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.deductions.potongan_astek : 0) }}</td>
                      </tr>
                      <tr class="bo-l bo-r">
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                        >Insentif {{ insentifDuration }}</td>
                        <td v-else>
                          <span
                            v-if="employee.temp_payslip_data && employee.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_kerja
                            <= employee.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_masuk"
                          >
                            Insentif
                            {{`( ${employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_kerja : 0} hari x
                            ${ formatPrice(employee.temp_payslip_data ? employee.meta.payslip.insentif : 0)})`}}
                          </span>
                          <span v-else>
                            Insentif
                            {{`( ${employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_masuk : 0} hari x
                             ${employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.attendance_calculation.workDuration.currentWorkHours : 0} jam
                            ${ formatPrice(employee.temp_payslip_data ? employee.meta.payslip.insentif : 0)})`}}
                          </span>
                        </td>
                        <td :class="userRole && userRole[0] !== 'owner' ? 'bo-b' : ''">Rp</td>
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          :class="userRole && userRole[0] !== 'owner' ? 'bo-b': ''"
                          align="right"
                        >{{ formatPrice(currentInsentif) }}</td>
                        <td
                          v-else
                          :class="userRole && userRole[0] !== 'owner' ? 'bo-b': ''"
                          align="right"
                        >{{ formatPrice(employee.temp_payslip_data ? employee.temp_payslip_data.payslip_meta.base.insentif : 0) }}</td>
                        <td></td>
                        <td></td>
                        <td :class="userRole && userRole[0] !== 'owner' ? 'bo-b' : ''"></td>
                        <td :class="userRole && userRole[0] !== 'owner' ? 'bo-b' : ''"></td>
                      </tr>
                      <tr v-if="userRole && userRole[0] === 'owner'">
                        <td>
                          <strong>Total Buku 1</strong>
                        </td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(totalBookOne) }}</td>
                        <td></td>
                        <td>
                          <strong>Total Potongan 1</strong>
                        </td>
                        <td>Rp</td>
                        <td align="right">{{ formatPrice(totalDeductionBookOne) }}</td>
                      </tr>
                      <tr v-if="userRole && userRole[0] === 'owner'">
                        <td colspan="7"></td>
                      </tr>
                      <tr v-if="userRole && userRole[0] === 'owner'">
                        <td class="orange lighten-4">
                          Insentif Khusus
                          ({{ employee.temp_payslip_data && employee.meta.payslip.owner_special_insentif
                          ? ownerCurrentInsentifDuration
                          + ' x '+ formatPrice(employee.meta.payslip.owner_special_insentif)
                          : 0
                          }})
                        </td>
                        <td class="orange lighten-4">Rp</td>
                        <td class="orange lighten-4" align="right">
                          {{ employee.temp_payslip_data && employee.meta.payslip.owner_special_insentif>0
                          ? formatPrice(ownerCurrentInsentif)
                          : 0
                          }}
                        </td>
                        <td></td>

                        <td
                          v-if="userRole && userRole[0] === 'owner'"
                          class="orange lighten-4"
                        >Potongan Bon</td>
                        <td v-else colspan="3" class="bo-b"></td>
                        <td v-if="userRole && userRole[0] === 'owner'" class="orange lighten-4">Rp</td>
                        <td v-if="userRole && userRole[0] === 'owner'" class="orange lighten-4">
                          <div v-if="isHasBeenGeneratedByOwner(employee)" class="d-flex flex-row align-start" style="float: right;">
                            <span>
                              {{
                              formatPrice(
                              employee.meta.payslip.value_bon_deduction,
                              )
                              }}
                            </span>
                          </div>
                          <div v-else-if="bonDeduction" class="d-flex flex-row align-start">
                            <v-currency-field
                              color="grey darken-2"
                              v-bind="currency_config"
                              v-model="
                                employee.meta.payslip.value_bon_deduction
                              "
                              dense
                              class="currency-input pa-0 ma-0 font-md"
                              hide-details
                              :error="errorBonDeduction"
                              filled
                              singleLine
                            ></v-currency-field>
                            <div class="d-flex flex-row">
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="saveBonDeduction"
                                    color="green"
                                    v-on="on"
                                  >check_circle</v-icon>
                                </template>
                                <span>Simpan data</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="
                                      bonDeduction = !bonDeduction;
                                      errorBonDeduction = false;
                                      employee.meta.payslip.value_bon_deduction = 0;
                                      totalBonDeductionValueNow = totalBonDeductionValue
                                    "
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
                            v-else-if="totalBonDeductionValue > 0 && !bonDeduction"
                            class="d-flex flex-row align-center justify-space-between"
                            style="float: right;"
                          >
                            <span>
                              {{
                              formatPrice(
                              employee.meta.payslip.value_bon_deduction,
                              )
                              }}
                            </span>
                            <template>
                              <v-icon color="green" @click="changeBonDeduction">info</v-icon>
                            </template>
                          </div>
                          <div
                            v-else
                            class="d-flex flex-row align-center justify-space-between"
                            style="float: right;"
                          >
                            <span>
                              {{
                              formatPrice(
                              employee.meta.payslip.value_bon_deduction,
                              )
                              }}
                            </span>
                            <v-tooltip
                              class="ml-3"
                              bottom
                              v-if="isEdited && !isHasBeenGenerated(employee)"
                            >
                              <template v-slot:activator="{ on }">
                                <v-icon v-on="on" color="grey">info</v-icon>
                              </template>
                              <span>Karyawan tidak punya pinjaman</span>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="userRole && userRole[0] === 'owner'">
                        <td
                          class="orange lighten-4"
                        >Tambahan ({{employee.temp_payslip_data && employee.meta.payslip.status_tambahan ? 'KHUSUS' : 'REGULER'}})</td>
                        <td class="orange lighten-4">Rp</td>
                        <td class="orange lighten-4" align="right">
                          {{employee.temp_payslip_data && employee.meta.payslip.owner_additional>0
                          ? formatPrice(ownerAdditional)
                          : 0
                          }}
                        </td>
                        <td></td>
                        <td class="orange lighten-4">Pot.BPJS TK & Kesehatan Khusus</td>
                        <td class="orange lighten-4">Rp</td>
                        <td class="orange lighten-4" align="right">
                          {{
                          formatPrice(employee.temp_payslip_data ? employee.meta.payslip.astek_deduction_owner : 0)
                          }}
                        </td>
                      </tr>
                      <tr v-if="userRole && userRole[0] === 'owner'">
                        <td class="orange lighten-4">Lembur ({{ convertOwnerOvertimeDuration }})</td>
                        <td class="orange lighten-4">Rp</td>
                        <td class="orange lighten-4" align="right">
                          {{employee.temp_payslip_data
                          ? formatPrice(ownerOvertimeCalculation)
                          : 0
                          }}
                        </td>
                        <td colspan="4"></td>
                      </tr>
                      <tr v-if="userRole && userRole[0] === 'owner'">
                        <td class="orange lighten-4">
                          Bonus Khusus
                          ({{employee.meta.payslip.ket_bonus_khusus}})
                        </td>
                        <td
                          class="orange lighten-4"
                          :style="userRole && userRole[0] === 'owner' ? 'border-bottom: 1px solid #000 !important;' : ''"
                        >Rp</td>
                        <td
                          class="orange lighten-4"
                          :style="userRole && userRole[0] === 'owner' ? 'border-bottom: 1px solid #000 !important;' : ''"
                        >
                          <div
                            v-if="isExtraFromOwner && employee.temp_payslip_data"
                            class="d-flex flex-row align-start"
                          >
                            <v-currency-field
                              color="grey darken-2"
                              v-bind="currency_config"
                              v-model="employee.meta.payslip.nominal_bonus_khusus"
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
                                    @click="isExtraFromOwner = !isExtraFromOwner"
                                    color="green"
                                    v-on="on"
                                  >check_circle</v-icon>
                                </template>
                                <span>Simpan data</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="isEdited">
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    @click="
                                      isExtraFromOwner = !isExtraFromOwner;
                                      employee.temp_payslip_data && employee.temp_payslip_data.payslip_meta.owner_rewards.extra_from_owner > 0
                                        ? employee.temp_payslip_data.payslip_meta.owner_rewards.extra_from_owner
                                        : (employee.temp_payslip_data.payslip_meta.owner_rewards.extra_from_owner = 0);
                                    "
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
                            <span>
                              {{employee.meta.payslip.nominal_bonus_khusus ?
                              formatPrice(employee.meta.payslip.nominal_bonus_khusus)
                              : 0
                              }}
                            </span>
                            <v-icon
                              v-if="isEdited && isHasBeenGenerated(employee)"
                              @click="isExtraFromOwner = !isExtraFromOwner"
                              color="green"
                            >info</v-icon>
                          </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td colspan="2" class="bo-b"></td>
                      </tr>
                      <tr v-if="userRole && userRole[0] !== 'owner'" class="bo-l bo-r">
                        <td>
                          <strong class="mr-3">Total Pendapatan</strong>
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
                      <tr v-else>
                        <td>
                          <strong class="mr-2">Total Buku 2</strong>
                        </td>
                        <td>
                          <strong>Rp</strong>
                        </td>
                        <td align="right">
                          <strong>{{ formatPrice(totalBookTwo) }}</strong>
                        </td>
                        <td></td>
                        <td>
                          <strong>Total Potongan 2</strong>
                        </td>
                        <td>
                          <strong>Rp</strong>
                        </td>
                        <td align="right">
                          <strong>{{ formatPrice(totalDeductionBookTwo) }}</strong>
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
                      <tr v-if="userRole && userRole[0] === 'owner'" class="bo-l bo-r">
                        <td><strong>Total Bersih Buku 1</strong></td>
                        <td><strong>Rp</strong></td>
                        <td align="right"><strong>{{formatPrice(totalBookOne-totalDeductionBookOne)}}</strong></td>
                        <td width="20"></td>
                        <td><strong>Total Bersih Buku 2</strong></td>
                        <td><strong>Rp</strong></td>
                        <td align="right"><strong>{{formatPrice(totalBookTwo-totalDeductionBookTwo)}}</strong></td>
                      </tr>
                      <tr class="bo-l bo-r bo-t bo-b">
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          colspan="7"
                          align="center"
                          style="background: rgb(225, 225, 225);"
                        >
                          <strong>
                            PENDAPATAN GAJI =
                            {{ formatPrice(totalIncomeCleanNumber) }}
                          </strong>
                        </td>
                        <td
                          v-else
                          colspan="7"
                          align="center"
                          style="background: rgb(225, 225, 225);"
                        >
                          <strong>
                            PENDAPATAN GAJI =
                            {{ formatPrice(totalIncomeCleanNumberOwnerTwo) }}
                          </strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r bo-t bo-b">
                        <td
                          v-if="userRole && userRole[0] !== 'owner'"
                          colspan="7"
                          align="center"
                          style="background: rgb(225, 225, 225);"
                        >
                          <strong>{{ totalIncomeCleanValue }}</strong>
                        </td>
                        <td
                          v-else
                          colspan="7"
                          align="center"
                          style="background: rgb(225, 225, 225);"
                        >
                          <strong>{{ totalIncomeCleanValue }}</strong>
                        </td>
                      </tr>
                      <tr class="bo-l bo-r bo-t bo-b">
                        <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
                          <strong>SISA PINJAMAN = Rp{{ formatPrice(totalBonDeductionValueNow) }}</strong>
                        </td>
                      </tr>
                      <!-- <tr class="bo-l bo-r">
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
                      </tr>-->
                    </tbody>
                  </table>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card v-else-if="tabActive === 'saved'">
            <v-card-text>
              <v-row align="center" justify="space-between">
                <v-col class="py-0">
                  <span>Jumlah yang disimpan</span>
                  <v-btn dark class="blue elevation-0 ml-4">
                    <span class="font-14 font-weight-regular">
                      <span>{{ currentSave }}</span>
                      <span class="mx-2">/</span>
                      <span>{{ listEmployee.length }}</span>
                    </span>
                    <v-icon class="ml-3" small>people</v-icon>
                  </v-btn>
                </v-col>
                <v-col class="py-0 text-right">
                  <v-btn
                    v-if="userRole && userRole[0] !== 'owner'"
                    dark
                    color="green"
                    class="elevation-0 ml-3"
                    @click="generatePayslip"
                  >Cetak Payslip Tersimpan</v-btn>
                  <v-btn
                    v-else
                    dark
                    color="green"
                    class="elevation-0 ml-3"
                    @click="generatePayslip"
                  >Cetak Payslip Tersimpan</v-btn>
                  <h2 v-if="loadingPayslip">Loading</h2>
                </v-col>
              </v-row>
              <v-divider class="mt-4 mb-3" style="border-style: dashed; border-width: .5px;"></v-divider>
              <div v-if="listPayslip.length <= 0" class="text-center">
                <div class="d-flex flex-row align-start justify-space-between my-10">
                  <img src="../../../assets/logo-payslip.svg" style="width: 12%;" />
                </div>
                <div class="title black--text mb-3">Data masih kosong</div>
                <div class="mb-10">
                  Data payslip yang sedang diproses masih kosong, silahkan
                  tambahkan data dengan menyimpan payslip
                </div>
              </div>
              <div v-else>
                <div>
                  <div v-for="(item, index) in listPayslip" :key="index">
                    <div class="d-flex flex-row align-center justify-space-between py-3">
                      <div v-if="userRole && userRole[0] === 'owner'">
                        <v-icon class="mr-2">person</v-icon>
                        <span class="black--text">{{ item.name }}</span>
                        <span>
                          <v-tooltip right v-if="item.temp_payslip_data.owner_payslip || item.temp_payslip_data.payslip_meta.owner_payslip">
                            <template v-slot:activator="{ on }">
                              <v-icon class="ml-3" v-on="on" color="green">check_circle</v-icon>
                            </template>
                            <span>Data telah disimpan</span>
                          </v-tooltip>
                          <v-tooltip right v-else>
                            <template v-slot:activator="{ on }">
                              <v-icon class="ml-3" v-on="on" color="grey">cancel</v-icon>
                            </template>
                            <span>Data belum disimpan</span>
                          </v-tooltip>
                        </span>
                      </div>
                      <div v-else>
                        <v-icon class="mr-2">person</v-icon>
                        <span class="black--text">{{ item.name }}</span>
                        <span>
                          <v-tooltip right v-if="item.temp_payslip_data">
                            <template v-slot:activator="{ on }">
                              <v-icon class="ml-3" v-on="on" color="green">check_circle</v-icon>
                            </template>
                            <span>Data telah disimpan</span>
                          </v-tooltip>
                          <v-tooltip right v-else>
                            <template v-slot:activator="{ on }">
                              <v-icon class="ml-3" v-on="on" color="grey">cancel</v-icon>
                            </template>
                            <span>Data belum disimpan</span>
                          </v-tooltip>
                        </span>
                      </div>
                      <div>
                        <v-btn
                          color="primary"
                          small
                          class="elevation-0"
                          @click="selectDetailPayslip(item.id, index)"
                        >Lihat Data Payslip</v-btn>
                      </div>
                    </div>
                    <v-divider v-if="index < listPayslip.length - 1"></v-divider>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card v-else-if="isLoadingEmployee || isLoadingAttendance || isLoadingPayslip">
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
              <img src="../../../../src/assets/empty-state.png" class="mb-6" alt />
              <div class="title black--text my-2">Data karyawan tidak ditemukan</div>
              <div>Data karyawan tidak ada untuk parameter ini</div>
              <v-btn
                class="mt-5 elevation-0"
                color="primary"
                :to="{ name: 'choose-report-payslip' }"
              >Kembali ke filter payslip</v-btn>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmSetPayslip" persistent width="500">
      <v-card class="custom-modal text-center">
        <v-card-text
          class="py-5"
          v-if="employee.temp_payslip_data && userRole && userRole[0] !== 'owner'"
        >
          <div class="title black--text my-2">Informasi Perubahan Data Payslip</div>
          <div>Apakah anda ingin mengubah data payslip ini?</div>
          <div
            class="font-lg my-2 black--text"
            style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
          >
            <strong>{{ employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.name : '' }}</strong>
          </div>
        </v-card-text>
        <v-card-text class="py-5" v-else>
          <div class="title black--text my-2">Konfirmasi Pembuatan Payslip</div>
          <div>Apakah anda yakin ingin menyimpan data payslip karyawan ini?</div>
          <div
            class="font-lg my-2 black--text"
            style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
          >
            <strong>{{ employee.name ? employee.name : employee.temp_payslip_data ? employee.temp_payslip_data.employee_meta.name : '' }}</strong>
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
              <span
                v-if="employee.temp_payslip_data && userRole && userRole[0] !== 'owner'"
              >Ubah data</span>
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
          <div>Anda belum menyimpan data payslip untuk karyawan ini</div>
          <div
            class="font-lg my-2 black--text"
            style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
          >
            <strong>{{ employee.name }}</strong>
          </div>
          <div>
            Silahkan buat payslip terlebih dahulu sebelum melanjukan ke karyawan
            selanjutnya
          </div>
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
              <img src="../../../assets/logo-payslip.svg" style="width: 12%;" />
            </div>
            <div class="title black--text mb-3">Data masih kosong</div>
            <div class="mb-10">
              Data payslip yang sedang diproses masih kosong, silahkan tambahkan
              data dengan menyimpan payslip
            </div>
          </div>
          <div v-else class="mt-5">
            <div v-for="(item, index) in listPayslip" :key="index">
              <div class="d-flex flex-row align-center justify-space-between py-3">
                <div>
                  <v-icon class="mr-2">person</v-icon>
                  <span class="black--text">{{ item.name }}</span>
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

<script src="./payslipOffice.ts"></script>

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
