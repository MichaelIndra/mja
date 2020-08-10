<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">person</v-icon>
                <div>Data Karyawan</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
<!--              <div class="grey&#45;&#45;text font-sm">Total Karyawan : {{ listEmployee.length }}</div>-->
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row align="center" justify="space-between" class="mb-3" v-if="!importData">
            <v-col v-if="addPermission" cols="12" sm="6" md="4">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="primary elevation-0"
                    class="mr-2 icon-box"
                    @click="showForm()"
                  >
                    <v-icon small>add</v-icon>Tambah
                  </v-btn>
                </template>
                <span>Tambah data karyawan</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="indigo elevation-0"
                    class="mr-2 icon-box"
                    dark
                    @click="importEmployee()"
                  >
                    <v-icon small>cloud_upload</v-icon>
                  </v-btn>
                </template>
                <span>Import data karyawan</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    class="mr-2 icon-box v-btn v-btn--contained theme--dark v-size--default green elevation-0"
                    v-on="on"
                    href="/files/Employees_Master.xlsx"
                  >
                    <span class="v-btn__content">
                      <v-icon small>cloud_download</v-icon>
                    </span>
                  </a>
                </template>
                <span>Download template import</span>
              </v-tooltip>
            </v-col>
            <!-- <v-col v-else></v-col> -->
            <v-col
              cols="12"
              sm="6"
              :md="addPermission ? 2 : 4"
              :class="addPermission ? 'text-right' : ''"
            >
              <v-btn
                :outlined="!filter"
                class="elevation-0"
                :color="filter ? 'primary' : 'grey darken-1'"
                @click="showFilter"
              >
                <!-- <v-badge
                  v-if="filterCount !== 0"
                  class="mr-7"
                  :color="
                    filter ? 'white primary--text' : 'primary white--text'
                  "
                >
                  <template v-slot:badge>{{ filterCount }}</template>
                </v-badge>-->
                <v-icon class="mr-2" small>filter_list</v-icon>
                <span>{{ addPermission ? 'Filter' : 'Filter data karyawan' }}</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="filter" class="mt-3"></v-divider>
          <filters
            :options="filterOption"
            v-on:getListData="getListData($event)"
            v-on:checkFilter="checkFilter($event)"
            v-show="filter && !importData"
          ></filters>
          <v-card class="round relative card-detail elevation-1 white--text">
            <v-card-text class="relative">
              <v-row v-if="importData">
                <v-col>
                  <import-employee
                    v-on:cancelUpload="importEmployee()"
                    v-on:successUpload="successImport()"
                  ></import-employee>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <v-data-table
                    sort-by="name"
                    :headers="headers"
                    :items="listEmployee"
                    :options.sync="options"
                    :server-items-length="totalData"
                    :loading="isLoading"
                    class="elevation-0"
                    hide-default-footer
                  >
                    <template v-slot:item="{ item }">
                      <v-menu
                        bottom
                        origin="center center"
                        :open-on-hover="false"
                        transition="slide-y-transition"
                        offset-y
                        :nudge-right="80"
                        max-width="190px"
                      >
                        <template v-slot:activator="{ on }">
                          <tr v-on="on" class="cursor-pointer">
                            <td>{{ item.nik }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.department ? item.department.name : '-' }}</td>
                            <td>{{ item.group ? item.group.name : '-' }}</td>
                            <td>{{ item.date_of_birth }}</td>
                            <td>
                              <v-chip
                                class="ma-2"
                                dark
                                small
                                :color="item.status_active === 'Aktif' ? 'green' : 'grey darken-1'"
                              >
                                <v-icon
                                  v-if="item.status_active === 'Aktif'"
                                  left
                                  small
                                >check_circle</v-icon>
                                <v-icon v-else left small>cancel</v-icon>
                                {{ item.status_active === 'Aktif' ? 'Aktif' : 'Tidak Aktif' }}
                              </v-chip>
                            </td>
                            <td>{{ item.active_date_since }}</td>
                            <td>{{ item.status }}</td>
                          </tr>
                        </template>
                        <v-list dense class="py-0">
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                <span class="font-sm">{{ item.name }}</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item @click="goToDetail(item.id)">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon small color="blue" class="mr-2">notes</v-icon>
                                <span class="font-sm">Detail Karyawan</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="showForm(item.id)">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon small color="green" class="mr-2">edit</v-icon>
                                <span class="font-sm">Edit Data</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <!--<v-list-item @click="showConfirmDelete(item.id)">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon small color="red" class="mr-2">cancel</v-icon>
                                <span class="font-sm">Nonaktifkan</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>-->
                        </v-list>
                      </v-menu>
                    </template>
                  </v-data-table>
                  <pagination
                    :loading="isLoading"
                    v-if="listEmployee.length > 0"
                    v-on:getListData="getListData($event)"
                  ></pagination>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="1200">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ employee.id ? 'assessment' : 'add_circle' }}</v-icon>
              {{ employee.id ? 'Edit' : 'Tambah' }} Karyawan
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ employee.id ? 'mengubah' : 'menambahkan' }} data karyawan</div>
          </div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="5" md="5">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <div class="font-sm grey--text grey lighten-4 px-3 py-1 mb-3 round">Data Pribadi</div>
                  <v-row v-if="userRole && userRole[0] !== 'admin'">
                    <v-col class="py-0" cols="7">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.name.$model"
                        label="Nama Lengkap*"
                        required
                        :error="$v.employee.name.$error"
                        :error-messages="
                          $v.employee.name.$error ? `Nama wajib diisi` : ''
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="5">
                      <v-select
                        :items="employeeStatus"
                        v-model.trim="$v.employee.status.$model"
                        :error="$v.employee.status.$error"
                        :error-messages="
                          $v.employee.status.$error ? `Nama wajib diisi` : ''
                        "
                        label="Status Karyawan"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.name.$model"
                        label="Nama Lengkap*"
                        required
                        :error="$v.employee.name.$error"
                        :error-messages="
                          $v.employee.name.$error ? `Nama wajib diisi` : ''
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.nik.$model"
                        label="NIK*"
                        :counter="20"
                        required
                        :error="$v.employee.nik.$error"
                        :error-messages="
                          !$v.employee.nik.numeric
                            ? 'NIK harus angka'
                            : !$v.employee.nik.maxLength
                            ? 'Panjang nik maksimal harus 20 karakter'
                            : !$v.employee.nik.required & $v.employee.nik.$error
                            ? 'NIK wajib diisi'
                            : ''
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="12" md="6">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.bpjs_id.$model"
                        label="ID BPJS*"
                        :counter="20"
                        required
                        :error="$v.employee.bpjs_id.$error"
                        :error-messages="
                          !$v.employee.bpjs_id.maxLength
                            ? 'Panjang ID BPJS maksimal harus 20 karakter'
                            : !$v.employee.bpjs_id.required &
                              $v.employee.bpjs_id.$error
                            ? 'ID BPJS wajib diisi'
                            : ''
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="12" md="6">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.npwp_id.$model"
                        label="ID NPWP*"
                        :counter="20"
                        required
                        :error="$v.employee.npwp_id.$error"
                        :error-messages="
                          !$v.employee.npwp_id.maxLength
                            ? 'Panjang ID NPWP maksimal harus 20 karakter'
                            : !$v.employee.npwp_id.required &
                              $v.employee.npwp_id.$error
                            ? 'ID NPWP wajib diisi'
                            : ''
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.address.$model"
                        label="Alamat"
                        :error="$v.employee.address.$error"
                        :error-messages="
                          $v.employee.address.$error ? `Alamat wajib diisi` : ''
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-text-field
                        color="grey darken-2"
                        class="mr-2"
                        v-model.trim="$v.employee.place_of_birth.$model"
                        label="Tempat Lahir"
                        :error="$v.employee.place_of_birth.$error"
                        :error-messages="
                          $v.employee.place_of_birth.$error
                            ? `Tempat wajib diisi`
                            : ''
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-menu
                        v-model="menu3"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            color="grey darken-2"
                            v-model="employee.date_of_birth"
                            label="Tanggal lahir"
                            readonly
                            v-on="on"
                            prepend-inner-icon="calendar_today"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="employee.date_of_birth"
                          :max="dateNow"
                          @input="menu3 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-text-field
                        color="grey darken-2"
                        v-model.trim="$v.employee.phone_no.$model"
                        label="Nomor Telepon"
                        :error="$v.employee.phone_no.$error"
                        :error-messages="
                          $v.employee.phone_no.$error
                            ? `Nomor telepon wajib diisi`
                            : ''
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <div class="font-sm grey--text grey lighten-4 px-3 py-1 mb-3 round">Data Karyawan</div>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-select
                        v-model.trim="$v.employee.department_id.$model"
                        :items="listDepartment"
                        item-text="name"
                        item-value="id"
                        label="Departemen"
                        :error="$v.employee.department_id.$error"
                        :error-messages="
                          $v.employee.department_id.$error
                            ? `Department wajib diisi`
                            : ''
                        "
                      ></v-select>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-select
                        v-model.trim="$v.employee.group_id.$model"
                        :items="listGroup"
                        item-text="name"
                        item-value="id"
                        label="Golongan"
                        :error="$v.employee.group_id.$error"
                        :error-messages="
                          $v.employee.group_id.$error
                            ? `Golongan wajib diisi`
                            : ''
                        "
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-select
                        v-model.trim="$v.employee.area_id.$model"
                        :items="listArea"
                        item-text="name"
                        item-value="id"
                        label="Area"
                        :error="$v.employee.area_id.$error"
                        :error-messages="
                          $v.employee.area_id.$error
                            ? `Department wajib diisi`
                            : ''
                        "
                      ></v-select>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-select
                        v-model.trim="$v.employee.position_id.$model"
                        :items="listPosition"
                        item-text="name"
                        item-value="id"
                        label="Posisi"
                        :error="$v.employee.position_id.$error"
                        :error-messages="
                          $v.employee.position_id.$error
                            ? `Golongan wajib diisi`
                            : ''
                        "
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            color="grey darken-2"
                            v-model="employee.active_date"
                            label="Tanggal Mulai Kerja"
                            readonly
                            v-on="on"
                            prepend-inner-icon="calendar_today"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="employee.active_date"
                          :max="dateNow"
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                      <v-row align="center">
                        <v-col class="py-0" cols="12" sm="6" md="6">
                          <v-switch
                            color="primary"
                            v-model="employee.active"
                            :label="
                              `${employee.active ? 'Aktif' : 'Tidak aktif'}`
                            "
                          ></v-switch>
                        </v-col>
                        <v-col class="py-0" cols="12" sm="6" md="6">
                          <div class="subtitle">Status keaktifan karyawan</div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <div
                    v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                    class="font-sm grey--text grey lighten-4 px-3 py-1 mb-6 round"
                  >Data Komponen Pengajian</div>
                  <template v-if="userRole && userRole[0] !== 'general_hr_attendance'">
                    <div>
                      <v-row>
                        <v-col class="py-0 mb-5" cols="12" sm="12" md="12">
                          <v-currency-field
                            color="grey darken-2"
                            prefix="Rp"
                            filled
                            v-bind="currency_config"
                            v-model.trim="$v.employee.meta.payslip.$model.insentif"
                            class="currency-input pa-0 ma-0 font-md"
                            label="Insentif / Lembur Extra"
                          ></v-currency-field>
                          <div
                            style="color: red; font-size: 12px;"
                            v-if="$v.employee.meta.payslip.$model.insentif === ''"
                          >Data insentif harus diisi</div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="py-0 mb-5" cols="12" sm="12" md="6">
                          <v-currency-field
                            color="grey darken-2"
                            prefix="Rp"
                            filled
                            v-bind="currency_config"
                            v-model.trim="$v.employee.meta.payslip.$model.astek_deduction"
                            class="currency-input pa-0 ma-0 font-md"
                            label="Pot.BPJS TK & Kesehatan"
                          ></v-currency-field>
                          <div
                            style="color: red; font-size: 12px;"
                            v-if="$v.employee.meta.payslip.$model.astek_deduction === ''"
                          >Data Pot.BPJS TK & Kesehatan harus diisi</div>
                        </v-col>
                        <v-col class="py-0 mb-5" cols="12" sm="12" md="6">
                          <v-currency-field
                            color="grey darken-2"
                            prefix="Rp"
                            filled
                            v-bind="currency_config"
                            v-model.trim="$v.employee.meta.payslip.$model.spsi_deduction"
                            class="currency-input pa-0 ma-0 font-md"
                            label="Potongan SPSI"
                          ></v-currency-field>
                          <div
                            style="color: red; font-size: 12px;"
                            v-if="$v.employee.meta.payslip.$model.spsi_deduction === ''"
                          >Data Potongan SPSI harus diisi</div>
                        </v-col>
                      </v-row>
                      <!-- new additional produksi -->
                      <template
                        v-if="dataEmployee.department && dataEmployee.department.meta.payslip_filter === 1 && dataEmployee.department.meta.payslip_type === '1'"
                      >
                        <div>
                          <div
                            v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                            class="font-md black--text mb-6"
                          >Extra Full</div>
                          <v-row align="start">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-switch
                                  hide-details
                                  dense
                                  class="py-0 ma-0"
                                  color="green"
                                  v-model="$v.employee.meta.payslip.$model.extra_full.indicator"
                                ></v-switch>
                                <span>{{ $v.employee.meta.payslip.$model.extra_full.indicator ? 'Dapat extra full' : 'Tidak dapat' }}</span>
                              </div>
                            </v-col>
                            <v-col
                              class="py-0"
                              cols="12"
                              sm="6"
                              md="6"
                              v-if="$v.employee.meta.payslip.$model.extra_full.indicator"
                            >
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-currency-field
                                  color="grey darken-2"
                                  prefix="Rp"
                                  filled
                                  v-bind="currency_config"
                                  v-model.trim="$v.employee.meta.payslip.$model.extra_full.nominal"
                                  class="currency-input pa-0 ma-0 font-md"
                                  label="Nominal Extra Full"
                                ></v-currency-field>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </template>
                      <!-- new additional toko bulanan -->
                      <template
                        v-if="dataEmployee.department && dataEmployee.department.meta.payslip_filter === 2 && dataEmployee.department.meta.payslip_type === '2'"
                      >
                        <div>
                          <!-- <div
                            v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                            class="font-md black--text mb-6"
                          >Extra Tambahan Kerja</div>-->
                          <v-row align="start">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-currency-field
                                  color="grey darken-2"
                                  prefix="Rp"
                                  filled
                                  v-bind="currency_config"
                                  v-model.trim="$v.employee.meta.payslip.$model.value_extra_full"
                                  class="currency-input pa-0 ma-0 font-md"
                                  label="Extra Tambahan Kerja"
                                ></v-currency-field>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </template>
                      <!-- new additional toko mingguan -->
                      <template
                        v-if="dataEmployee.department && dataEmployee.department.meta.payslip_filter === 1 && dataEmployee.department.meta.payslip_type === '2'"
                      >
                        <div>
                          <div
                            v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                            class="font-md black--text mb-6"
                          >Extra Full</div>
                          <v-row align="start" class="mb-5">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-switch
                                  hide-details
                                  dense
                                  class="py-0 ma-0"
                                  color="green"
                                  v-model="$v.employee.meta.payslip.$model.extra_full.indicator"
                                ></v-switch>
                                <span>{{ $v.employee.meta.payslip.$model.extra_full.indicator ? 'Dapat extra full' : 'Tidak dapat extra full' }}</span>
                              </div>
                            </v-col>
                            <v-col
                              class="py-0"
                              cols="12"
                              sm="6"
                              md="6"
                              v-if="$v.employee.meta.payslip.$model.extra_full.indicator"
                            >
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-currency-field
                                  color="grey darken-2"
                                  prefix="Rp"
                                  filled
                                  v-bind="currency_config"
                                  v-model.trim="$v.employee.meta.payslip.$model.extra_full.nominal"
                                  class="currency-input pa-0 ma-0 font-md"
                                  label="Nominal Extra Full"
                                ></v-currency-field>
                              </div>
                            </v-col>
                          </v-row>
                          <div
                            v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                            class="font-md black--text mb-6"
                          >Hari Ke-7</div>
                          <v-row align="start" class="mb-5">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-switch
                                  hide-details
                                  dense
                                  class="py-0 ma-0"
                                  color="green"
                                  v-model="$v.employee.meta.payslip.$model.value_day_7.indicator"
                                ></v-switch>
                                <span>{{ $v.employee.meta.payslip.$model.value_day_7.indicator ? 'Dapat tambahan' : 'Tidak dapat tambahan' }}</span>
                              </div>
                            </v-col>
                            <v-col
                              class="py-0"
                              cols="12"
                              sm="6"
                              md="6"
                              v-if="$v.employee.meta.payslip.$model.value_day_7.indicator"
                            >
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-currency-field
                                  color="grey darken-2"
                                  prefix="Rp"
                                  filled
                                  v-bind="currency_config"
                                  v-model.trim="$v.employee.meta.payslip.$model.value_day_7.nominal"
                                  class="currency-input pa-0 ma-0 font-md"
                                  label="Nominal hari ke-7"
                                ></v-currency-field>
                              </div>
                            </v-col>
                          </v-row>
                          <div
                            v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                            class="font-md black--text mb-6"
                          >Hari Minggu</div>
                          <v-row align="start" class="mb-5">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-switch
                                  hide-details
                                  dense
                                  class="py-0 ma-0"
                                  color="green"
                                  v-model="$v.employee.meta.payslip.$model.extra_sunday.indicator"
                                ></v-switch>
                                <span>{{ $v.employee.meta.payslip.$model.extra_sunday.indicator ? 'Dapat tambahan' : 'Tidak dapat tambahan' }}</span>
                              </div>
                            </v-col>
                            <v-col
                              class="py-0"
                              cols="12"
                              sm="6"
                              md="6"
                              v-if="$v.employee.meta.payslip.$model.extra_sunday.indicator"
                            >
                              <div class="d-flex flex-row align-center justify-space-between">
                                <v-currency-field
                                  color="grey darken-2"
                                  prefix="Rp"
                                  filled
                                  v-bind="currency_config"
                                  v-model.trim="$v.employee.meta.payslip.$model.extra_sunday.nominal"
                                  class="currency-input pa-0 ma-0 font-md"
                                  label="Nominal tambahan hari minggu"
                                ></v-currency-field>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </template>
                    </div>
                  </template>
                  <!-- new additional owner -->
                  <div v-if="userRole && userRole[0] === 'owner' && employee.status === 'KHUSUS'">
                    <div
                      class="font-sm grey--text grey lighten-4 px-3 py-1 mb-2 round"
                    >Data Komponen Pengajian Karyawan Khusus</div>
                    <v-row>
                      <v-col class="py-0 mb-5" cols="12" sm="12" md="12"></v-col>
                    </v-row>
                    <v-row>
                      <v-col class="py-0 mb-5" cols="12" sm="12" md="6">
                        <v-currency-field
                          color="grey darken-2"
                          prefix="Rp"
                          filled
                          v-bind="currency_config"
                          v-model.trim="$v.employee.meta.payslip.$model.owner_special_insentif"
                          class="currency-input pa-0 ma-0 font-md"
                          label="Nominal Insentif Khusus"
                        ></v-currency-field>
                      </v-col>
                      <v-col class="py-0 mb-5" cols="12" sm="12" md="6">
                        <v-currency-field
                          color="grey darken-2"
                          prefix="Rp"
                          filled
                          v-bind="currency_config"
                          v-model.trim="$v.employee.meta.payslip.$model.astek_deduction_owner"
                          class="currency-input pa-0 ma-0 font-md"
                          label="Pot.BPJS TK & Kesehatan Khusus"
                        ></v-currency-field>
                        <div
                          style="color: red; font-size: 12px;"
                          v-if="$v.employee.meta.payslip.$model.astek_deduction_owner === ''"
                        >Data Pot.BPJS TK & Kesehatan Khusus harus diisi</div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="py-0" cols="12" sm="6" md="6">
                        <v-row align="center">
                          <v-col class="py-0" cols="12" sm="6" md="6">
                            <v-switch
                              color="primary"
                              v-model="employee.meta.payslip.status_tambahan"
                              :label="
                              `${employee.meta.payslip.status_tambahan ? 'Khusus' : 'Reguler'}`
                            "
                            ></v-switch>
                          </v-col>
                          <v-col class="py-0" cols="12" sm="6" md="6">
                            <div class="subtitle">Status Tambahan karyawan</div>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col class="py-0 mb-5" cols="12" sm="12" md="6">
                        <v-currency-field
                          color="grey darken-2"
                          prefix="Rp"
                          filled
                          v-bind="currency_config"
                          v-model.trim="$v.employee.meta.payslip.$model.owner_additional"
                          class="currency-input pa-0 ma-0 font-md"
                          label="Nominal Tambahan"
                        ></v-currency-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="py-0 mb-5" cols="12" sm="12" md="12">
                        <v-currency-field
                          color="grey darken-2"
                          prefix="Rp"
                          filled
                          v-bind="currency_config"
                          v-model.trim="$v.employee.meta.payslip.$model.owner_overtime"
                          class="currency-input pa-0 ma-0 font-md"
                          label="Nominal Lembur"
                        ></v-currency-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="py-0 mt-0" cols="12" sm="12" md="6">
                        <v-text-field
                          color="grey darken-2"
                          v-model.trim="$v.employee.meta.payslip.$model.ket_bonus_khusus"
                          label="Keterangan Bonus Khusus"
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-0 mt-4" cols="12" sm="12" md="6">
                        <v-currency-field
                          color="grey darken-2"
                          prefix="Rp"
                          filled
                          v-bind="currency_config"
                          v-model.trim="$v.employee.meta.payslip.$model.nominal_bonus_khusus"
                          class="currency-input pa-0 ma-0 font-md"
                          label="Nominal Bonus Khusus"
                        ></v-currency-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-form>
              </v-col>
              <v-col class="pl-10" cols="12" sm="7" md="7">
                <div class="d-flex flex-row align-center justify-space-between mb-6">
                  <div class="d-flex flex-row">
                    <v-icon color="grey" class="mr-2" small>dashboard</v-icon>
                    <div class="black--text">Detail Golongan</div>
                  </div>
                </div>
                <div v-if="activeGroup.name">
                  <data-group :activeGroup="activeGroup"></data-group>
                </div>
                <div v-else class="text-sm-center">
                  <img src="../../assets/empty-state.png" alt />
                  <div class="title">Data Department dan Golongan Kosong</div>
                  <div>Silahkan Pilih Departemen dan Golongan Terlebih Dahulu</div>
                </div>

                <v-divider class="grey lighten-3 my-6"></v-divider>

                <v-row align="start">
                  <v-col cols="6">
                    <div class="d-flex flex-row align-center justify-space-between mb-6">
                      <div class="d-flex flex-row">
                        <v-icon color="grey" class="mr-2" small>info</v-icon>
                        <div class="black--text">Data Area</div>
                      </div>
                    </div>
                    <div v-if="area.name">
                      <v-row class="mb-3 px-0">
                        <v-col class="py-0" cols="12" sm="6" md="6">
                          <div>
                            <div class="subtitle">Nama area</div>
                            <div class="body-1 black--text">{{ area.name }}</div>
                          </div>
                        </v-col>
                        <v-col
                          v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                          class="py-0"
                          cols="12"
                          sm="6"
                          md="6"
                        >
                          <div>
                            <div class="subtitle">Nominal</div>
                            <div class="body-1 black--text">{{ formatPrice(area.bonus) }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else class="text-sm-center">
                      <img src="../../assets/empty-state.png" alt width="100" />
                      <div class="title">Data Area Kosong</div>
                      <div>Silahkan Pilih Area Terlebih Dahulu</div>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex flex-row align-center justify-space-between mb-6">
                      <div class="d-flex flex-row">
                        <v-icon color="grey" class="mr-2" small>info</v-icon>
                        <div class="black--text">Data Posisi</div>
                      </div>
                    </div>
                    <div v-if="position.name">
                      <v-row class="mb-3 px-0">
                        <v-col class="py-0" cols="12" sm="6" md="6">
                          <div>
                            <div class="subtitle">Nama Posisi</div>
                            <div class="body-1 black--text">{{ position.name }}</div>
                          </div>
                        </v-col>
                        <v-col
                          class="py-0"
                          cols="12"
                          sm="6"
                          md="6"
                          v-if="userRole && userRole[0] !== 'general_hr_attendance'"
                        >
                          <div>
                            <div class="subtitle">Bonus</div>
                            <div class="body-1 black--text">{{ formatPrice(position.bonus) }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else class="text-sm-center">
                      <img src="../../assets/empty-state.png" alt width="100" />
                      <div class="title">Data Posisi Kosong</div>
                      <div>Silahkan Pilih Posisi Terlebih Dahulu</div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4 px-8 py-4 d-flex flex-row">
          <v-btn
            min-width="100"
            class="elevation-0"
            color="grey darken-1"
            dark
            @click="closeForm"
          >Tutup</v-btn>
          <v-btn
            min-width="100"
            class="elevation-0"
            color="primary"
            :disabled="
              $v.employee.name.$error ||
                $v.employee.nik.$error ||
                $v.employee.address.$error ||
                $v.employee.phone_no.$error ||
                $v.employee.department_id.$error ||
                $v.employee.group_id.$error ||
                $v.employee.npwp_id.$error ||
                $v.employee.bpjs_id.$error

            "
            @click="save()"
          >Simpan</v-btn>
          <div
            class="caption grey--text lighten-2 ml-5"
          >Sebelum submit silahkan cek kembali inputan anda</div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="600">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5">
          <img src="../../assets/trash.png" alt class="my-6" />
          <div class="title black--text my-2">Konfirmasi Non-Aktif Karyawan</div>
          <div>
            Apakah anda yakin ingin nonaktifkan karyawan
            <b>"{{ dataEmployee.name }}"</b> ?
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              block
              large
              min-width="100"
              class="elevation-0"
              color="grey darken-2"
              dark
              @click="dialogDelete = false"
            >Tidak</v-btn>
          </v-col>
          <v-col cols="6" class="py-0 px-0 pl-2">
            <v-btn
              block
              large
              dark
              min-width="100"
              class="elevation-0"
              color="primary"
              @click="deleteData"
            >Ya</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./employee.ts"></script>

<style lang="css">
.currency-input .v-text-field__details {
  display: none;
}
</style>