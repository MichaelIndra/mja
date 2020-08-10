<template>
  <v-container class="pa-2 mb-10" fluid>
    <v-row class="mb-3">
      <div class="align-center justify-space-between d-flex flex-row px-3">
        <router-link class="subtitle" :to="{ name: 'employee' }">
          <v-icon small color="primary">home</v-icon>
        </router-link>
        <span class="grey--text darken-1 subtitle mx-4">/</span>
        <router-link class="subtitle" :to="{ name: 'employee' }">
          <span>Data Karyawan</span>
        </router-link>
        <span class="grey--text darken-1 subtitle mx-4">/</span>
        <span class="grey--text darken-1 subtitle">Detail karyawan</span>
      </div>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="round relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-3">
              <v-icon color="grey" class="mr-2" small>person</v-icon>
              <div class="black--text">Detail Karyawan</div>
            </div>
            <v-row align="start">
              <v-col cols="12" sm="3">
                <div>
                  <v-img
                    v-if="false"
                    src="https://picsum.photos/id/11/500/300"
                    aspect-ratio="1"
                    class="round blue lighten-2"
                    max-width="500"
                    max-height="300"
                  ></v-img>
                  <v-avatar tile color="indigo" size="100%" height="220" class="round">
                    <span class="white--text display-1">{{ employee.name.substr(0, 1) }}</span>
                  </v-avatar>
                </div>
              </v-col>
              <v-col cols="12" sm="9">
                <div class="mt-0 d-flex flex-row align-start">
                  <v-col cols="4" class="pa-0">
                    <div class="font-md">Nama Karyawan</div>
                    <div class="font-lg font-weight-regular black--text">{{ employee.name }}</div>
                  </v-col>
                  <v-col cols="4" class="pa-0">
                    <div class="font-md">Tanggal Masuk</div>
                    <div
                      class="font-lg font-weight-regular black--text"
                    >{{ formatDate(employee.active_date, 'medium') }}</div>
                  </v-col>
                  <v-col cols="4" class="pa-0">
                    <div class="font-md">Lama Kerja</div>
                    <div
                      class="font-lg font-weight-regular black--text"
                    >{{ employee.active_date_since }}</div>
                  </v-col>
                </div>
                <v-divider class="my-5"></v-divider>
                <v-row align="start">
                  <v-col cols="6">
                    <div>
                      <div class="py-0 mb-5 d-flex flex-row align-start">
                        <v-icon class="mr-3 box-icon green lighten-5" color="green lighten-2">person</v-icon>
                        <div>
                          <div>Tempat/Tanggal Lahir</div>
                          <div
                            class="font-16 font-weight-regular black--text"
                          >{{ employee.place_of_birth }}/{{ employee.date_of_birth }}</div>
                        </div>
                      </div>
                      <div class="py-0 mb-5 d-flex flex-row align-start">
                        <v-icon class="mr-3 box-icon blue lighten-5" color="blue lighten-2">phone</v-icon>
                        <div>
                          <div>Nomor Telepon</div>
                          <div
                            class="font-16 font-weight-regular black--text"
                          >{{ employee.phone_no }}</div>
                        </div>
                      </div>
                      <div class="py-0 mb-5 d-flex flex-row align-start">
                        <v-icon
                          class="mr-3 box-icon orange lighten-5"
                          color="primary lighten-2"
                        >home</v-icon>
                        <div>
                          <div>Alamat</div>
                          <div
                            class="font-16 font-weight-regular black--text"
                          >{{ employee.address }}</div>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div>
                      <div class="py-0 mb-5 d-flex flex-row align-start">
                        <v-icon
                          class="mr-3 box-icon green lighten-5"
                          color="green lighten-2"
                        >beenhere</v-icon>
                        <div>
                          <div>NIK</div>
                          <div class="font-16 font-weight-regular black--text">{{ employee.nik }}</div>
                        </div>
                      </div>
                      <div class="py-0 mb-5 d-flex flex-row align-start">
                        <v-icon
                          class="mr-3 box-icon blue lighten-5"
                          color="blue lighten-2"
                        >local_hospital</v-icon>
                        <div>
                          <div>ID BPJS</div>
                          <div
                            class="font-16 font-weight-regular black--text"
                          >{{ employee.bpjs_id }}</div>
                        </div>
                      </div>
                      <div class="py-0 mb-5 d-flex flex-row align-start">
                        <v-icon
                          class="mr-3 box-icon orange lighten-5"
                          color="primary lighten-2"
                        >work</v-icon>
                        <div>
                          <div>ID NPWP</div>
                          <div
                            class="font-16 font-weight-regular black--text"
                          >{{ employee.npwp_id }}</div>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="mb-5"></v-divider>
            <v-row align="center">
              <v-col cols="12" sm="3" class="py-0 d-flex flex-row align-start">
                <v-icon class="mr-3 box-icon green" color="white">info</v-icon>
                <div>
                  <div>Departemen</div>
                  <div
                    class="font-md font-weight-regular black--text"
                  >{{ employee.department ? employee.department.name : '-' }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="3" class="py-0 d-flex flex-row align-start">
                <v-icon class="mr-3 box-icon green" color="white">info</v-icon>
                <div>
                  <div>Golongan</div>
                  <div
                    class="font-md font-weight-regular black--text"
                  >{{ employee.group ? employee.group.name : '-' }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="3" class="py-0 d-flex flex-row align-start">
                <v-icon class="mr-3 box-icon green" color="white">info</v-icon>
                <div>
                  <div>Area</div>
                  <div
                    class="font-md font-weight-regular black--text"
                  >{{ employee.area ? employee.area.name : '-' }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="3" class="py-0 d-flex flex-row align-start">
                <v-icon class="mr-3 box-icon green" color="white">info</v-icon>
                <div>
                  <div>Posisi</div>
                  <div
                    class="font-md font-weight-regular black--text"
                  >{{ employee.position ? employee.position.name : '-' }}</div>
                </div>
              </v-col>
            </v-row>
            <v-divider v-if="userRole && userRole[0] !== 'general_hr_attendance'" class="my-5"></v-divider>
            <div v-if="userRole && userRole[0] !== 'general_hr_attendance'">
              <v-icon small class="mr-3">info</v-icon>
              <span>Data Komponen Pengajian</span>
            </div>
            <v-row v-if="userRole && userRole[0] !== 'general_hr_attendance'" flex="column">
              <v-col>
                <div class="mb-1">Nominal Insentif / Lembur Extra</div>
                <div class="black--text font-lg">{{ formatPrice(employee.meta.payslip.insentif) }}</div>
              </v-col>
              <v-col>
                <div class="mb-1">Nominal Potongan SPSI</div>
                <div
                  class="black--text font-lg"
                >{{ formatPrice(employee.meta.payslip.spsi_deduction) }}</div>
              </v-col>
              <v-col>
                <div class="mb-1">Nominal Pot.BPJS TK & Kesehatan</div>
                <div
                  class="black--text font-lg"
                >{{ formatPrice(employee.meta.payslip.astek_deduction) }}</div>
              </v-col>
            </v-row>
            <v-row v-if="userRole && userRole[0] === 'owner'" flex="column">
              <v-col>
                <div class="mb-1">Nominal Insentif Khusus</div>
                <div
                  class="black--text font-lg"
                >{{ formatPrice(employee.meta.payslip.owner_special_insentif) }}</div>
              </v-col>
              <v-col>
                <div class="mb-1">Nominal Tambahan</div>
                <div
                  class="black--text font-lg"
                >{{ formatPrice(employee.meta.payslip.owner_additional) }}</div>
              </v-col>
              <v-col>
                <div class="mb-1">Nominal Lembur</div>
                <div
                  class="black--text font-lg"
                >{{ formatPrice(employee.meta.payslip.owner_overtime) }}</div>
              </v-col>
            </v-row>
            <v-row v-if="userRole && userRole[0] === 'owner'" flex="column">
              <v-col>
                <div class="mb-1">Nominal Bonus Khusus</div>
                <div class="black--text font-lg">
                  {{formatPrice(employee.meta.payslip.nominal_bonus_khusus)}}
                </div>
              </v-col>
              <v-col>
                <div class="mb-1">Keterangan Nominal Tambahan</div>
                <div class="black--text font-lg">
                  {{employee.meta.payslip.ket_bonus_khusus}}
                </div>
              </v-col>
              <v-col>
                <div class="mb-1">Nominal Pot.BPJS TK & Kesehatan Khusus</div>
                <div class="black--text font-lg">
                  {{formatPrice(employee.meta.payslip.astek_deduction_owner)}}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="round relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row mb-6">
              <v-icon color="grey" class="mr-2" small>dashboard</v-icon>
              <div class="black--text">Detail Informasi Golongan</div>
            </div>
            <!-- group component -->
            <data-group :activeGroup="activeGroup"></data-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src="./detailEmployee.ts"></script>