<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">event_available</v-icon>
                <div>Data Kehadiran</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
<!--              <div class="grey&#45;&#45;text font-sm">Total Data : {{ totalData }}</div>-->
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row align="center" justify="space-between" v-if="!importData">
            <v-col v-if="addPermission" cols="12" sm="6" md="4">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="primary elevation-0"
                    class="mr-2 icon-box"
                    @click="showForm()"
                  >
                    <v-icon>add</v-icon>Tambah
                  </v-btn>
                </template>
                <span>Tambah data kehadiran</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="indigo elevation-0"
                    class="mr-2 icon-box"
                    dark
                    @click="importAttendance()"
                  >
                    <v-icon>cloud_upload</v-icon>
                  </v-btn>
                </template>
                <span>Import data Kehadiran</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    class="mr-2 icon-box v-btn v-btn--contained theme--dark v-size--default green elevation-0"
                    v-on="on"
                    href="/files/Attendance_report_20xx.xls"
                  >
                    <span class="v-btn__content">
                      <v-icon>cloud_download</v-icon>
                    </span>
                  </a>
                </template>
                <span>Download template import</span>
              </v-tooltip>
            </v-col>
            <v-col v-else></v-col>
            <v-col v-if="!importData" cols="12" sm="6" md="8" class="text-right">
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
                <span>Filter</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="filter"></v-divider>
          <filters
            :options="filterOption"
            v-on:getListData="getListData($event)"
            v-on:checkFilter="checkFilter($event)"
            v-if="filter"
          ></filters>

          <div
            v-if="
              !importData &&
                (formDataDelete.isAllSelected || formDataDelete.ids.length > 0)
            "
          >
            <v-divider></v-divider>
            <div
              v-if="
                !importData &&
                  (formDataDelete.isAllSelected ||
                    formDataDelete.ids.length > 0)
              "
              class="py-2"
            >
              <div
                class="d-flex flex-row align-center justify-space-between"
                v-if="!importData && formDataDelete.isAllSelected"
              >
                <div>
                  <span>Semua data ditandai</span>
                  <span>
                    <v-chip color="blue" class="ml-2" dark>Total: {{ totalData }} data</v-chip>
                  </span>
                </div>
                <v-btn
                  color="primary elevation-0"
                  class="mx-2 icon-box"
                  @click="dialogConfirmMultiDelete = true"
                >
                  <v-icon>delete</v-icon>Hapus data terpilih
                </v-btn>
              </div>
              <div
                class="d-flex flex-row align-center justify-space-between"
                v-else-if="!importData && formDataDelete.ids.length > 0"
              >
                <div>
                  <span>Data yang ditandai</span>
                  <v-chip color="blue" class="ml-3" dark>
                    <strong>Total: {{ formDataDelete.ids.length }}</strong>
                  </v-chip>
                </div>
                <v-btn
                  dark
                  color="red elevation-0"
                  class="mr-2 icon-box"
                  @click="dialogConfirmMultiDelete = true"
                >
                  <v-icon>delete</v-icon>Hapus data terpilih
                </v-btn>
              </div>
            </div>
          </div>
          <v-divider></v-divider>

          <switch-group v-if="importData"></switch-group>

          <v-card v-if="importData" class="round relative card-detail elevation-1 white--text">
            <v-card-text class="relative">
              <v-row>
                <v-col>
                  <import-attendance
                    v-on:cancelUpload="importAttendance()"
                    v-on:successUpload="successImport()"
                  ></import-attendance>
                </v-col>
              </v-row>
              <v-row>
                <v-col></v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card v-else>
            <v-card-text>
              <v-flex style="overflow-x: auto">
                <v-data-table
                  sort-by="date"
                  sort-desc
                  :headers="headers"
                  :items="listAttendance"
                  :options.sync="options"
                  :server-items-length="totalData"
                  :loading="isLoading"
                  class="elevation-1"
                  style="max-width: 1800px;"
                  single-expand
                  show-expand
                  hide-default-footer
                  show-select
                >
                  <template v-slot:header.data-table-select="{ headers, item }">
                    <span v-if="totalData > 0">
                      <span v-if="formDataDelete.isAllSelected" @click="unSelectAll()">
                        <v-icon>check_box</v-icon>
                      </span>
                      <span v-else-if="formDataDelete.ids.length === 0">
                        <v-menu open-on-hover bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on">check_box_outline_blank</v-icon>
                          </template>

                          <v-list>
                            <v-list-item
                              v-for="(item, index) in optionsForDeleteAll"
                              :key="index"
                              @click="selectionForDeleteAll = item.value"
                            >
                              <v-list-item-title>
                                {{
                                item.text
                                }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </span>
                      <span v-else @click="unSelectAll()">
                        <v-icon>indeterminate_check_box</v-icon>
                      </span>
                    </span>
                  </template>
                  <template v-slot:item.data-table-select="{ headers, item }">
                    <div class="py-6" v-if="formDataDelete.isAllSelected" @click="unSelectAll()">
                      <v-icon>check_box</v-icon>
                    </div>
                    <v-checkbox v-else v-model="formDataDelete.ids" :value="item.id"></v-checkbox>
                  </template>
                  <template v-slot:expanded-item="{ headers, item }">
                    <td style="border: none; background: #fafafa;"></td>
                    <td
                      :colspan="headers.length"
                      class="py-3"
                      style="border: none; background: #fafafa;"
                    >
                      <schedule :schedule="item.scheduleToday"></schedule>
                    </td>
                  </template>
                  <template v-slot:item.time_check_out_for_break="{ item }">
                    <div
                      v-if="
                        item.time_check_out_for_break.length > 0 &&
                          Array.isArray(item.time_check_out_for_break)
                      "
                    >
                      <span v-for="(time, index) in item.time_check_out_for_break" :key="index">
                        {{ time }}
                        <br />
                      </span>
                    </div>
                    <span v-else>{{ item.time_check_out_for_break }}</span>
                  </template>
                  <template v-slot:item.time_check_in_for_break="{ item }">
                    <div
                      v-if="
                        item.time_check_in_for_break.length > 0 &&
                          Array.isArray(item.time_check_in_for_break)
                      "
                    >
                      <span v-for="(time, index) in item.time_check_in_for_break" :key="index">
                        {{ time }}
                        <br />
                      </span>
                    </div>
                    <span v-else>{{ item.time_check_in_for_break }}</span>
                  </template>
                  <template v-slot:item.totalLate="{ item }">
                    {{
                    item.totalLate > 0 ? convertDuration(item.totalLate) : '-'
                    }}
                  </template>
                  <template v-slot:item.totalBreak="{ item }">
                    <div>
                      <!-- multiple -->
                      <div
                        v-if="Array.isArray(item.time_check_out_for_break) && item.time_check_out_for_break.length > 1"
                      >
                        <v-menu
                          class="elevation-10"
                          open-on-hover
                          bottom
                          transition="slide-y-transition"
                          offset-y
                        >
                          <template v-slot:activator="{ on }">
                            <div
                              class="tex-center"
                              v-on="
                              item.meta.approvedBreak === 'approved' ? '' : on
                            "
                            >
                              <span
                                :class="
                                item.meta.approvedBreak
                                  ? 'black--text'
                                  : item.totalBreak > 0
                                  ? 'red--text font-weight-bold'
                                  : 'black--text'
                              "
                              >
                                {{
                                item.totalBreak > 0
                                ? convertDuration(item.totalBreak)
                                : '-'
                                }}
                              </span>
                              <v-icon
                                class="ml-1"
                                v-if="item.meta.approvedBreak === 'approved'"
                                color="green"
                              >check_circle</v-icon>
                              <v-icon
                                class="ml-1"
                                v-else-if="item.meta.approvedBreak === 'rejected'"
                                color="red"
                              >cancel</v-icon>
                            </div>
                          </template>
                          <v-list
                            v-if="
                            item.totalBreak !== '-' &&
                              item.totalBreak !== 0 &&
                              !item.meta.approvedBreak
                          "
                            class="py-0"
                          >
                            <v-list-item @click="confirmBreak(item.id, true)">
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-icon small class="mr-2" color="blue">info</v-icon>
                                  <span class="font-md">Sesuaikan Jam Istirahat</span>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                      <div v-else>{{item.totalBreak > 0 ? convertDuration(item.totalBreak) : '-'}}</div>
                    </div>
                  </template>
                  <template v-slot:item.totalLeave="{ item }">
                    <v-menu
                      class="elevation-10"
                      open-on-hover
                      bottom
                      transition="slide-y-transition"
                      offset-y
                      :position-y="200"
                    >
                      <template v-slot:activator="{ on }">
                        <div
                          class="tex-center"
                          v-on="
                            item.employee.department.meta.payslip_type === '1'
                              ? ''
                              : on
                          "
                        >
                          <span
                            :class="
                              item.employee.department.meta.payslip_type === '1'
                                ? 'black--text'
                                : item.meta.isSwitchSchedule
                                ? 'black--text'
                                : item.totalLeave
                                ? 'red--text font-weight-bold'
                                : 'black--text'
                            "
                          >
                            {{
                            item.totalLeave > 0
                            ? convertDuration(item.totalLeave)
                            : '-'
                            }}
                          </span>
                          <v-icon
                            class="ml-1"
                            v-if="item.meta.isSwitchSchedule === 'yes'"
                            color="green"
                          >check_circle</v-icon>
                          <v-icon
                            class="ml-1"
                            v-else-if="
                              item.totalLeave > 0 &&
                                item.meta.isSwitchSchedule === 'no'
                            "
                            color="yellow"
                          >check_circle</v-icon>
                        </div>
                      </template>
                      <v-list
                        v-if="
                          item.totalLeave !== 0 && !item.meta.isSwitchSchedule
                        "
                        class="py-0"
                      >
                        <v-list-item @click="confirmSwitchSchedule(item.id, true)">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon small class="mr-2 green--text">cached</v-icon>
                              <span class="font-md">Pindah Jadwal</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="confirmSwitchSchedule(item.id, false)">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon small class="mr-2 yellow--text">check</v-icon>
                              <span class="font-md">Izin</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <template v-slot:item.totalOvertimeEarly="{ item }">
                    <v-menu
                      class="elevation-10"
                      open-on-hover
                      bottom
                      transition="slide-y-transition"
                      offset-y
                      :position-y="200"
                    >
                      <template v-slot:activator="{ on }">
                        <div
                          class="tex-center"
                          v-on="
                            item.meta.approvedEarly === 'approved' ? '' : on
                          "
                        >
                          <span
                            :class="
                              item.meta.approvedEarly
                                ? 'black--text'
                                : item.totalOvertimeEarly > 0
                                ? 'red--text font-weight-bold'
                                : 'black--text'
                            "
                          >
                            {{
                            item.totalOvertimeEarly > 0
                            ? convertDuration(item.totalOvertimeEarly)
                            : '-'
                            }}
                          </span>
                          <v-icon
                            class="ml-1"
                            v-if="item.meta.approvedEarly === 'approved'"
                            color="green"
                          >check_circle</v-icon>
                          <v-icon
                            class="ml-1"
                            v-else-if="item.meta.approvedEarly === 'rejected'"
                            color="red"
                          >cancel</v-icon>
                        </div>
                      </template>
                      <v-list
                        v-if="
                          item.totalOvertimeEarly !== '-' &&
                            item.totalOvertimeEarly !== 0 &&
                            !item.meta.approvedEarly
                        "
                        class="py-0"
                      >
                        <v-list-item @click="confirmOvertime(item.id, true, 'early')">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon small class="mr-2 green--text">check</v-icon>
                              <span class="font-md">Terima</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="confirmOvertime(item.id, false, 'early')">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon small class="mr-2 red--text">cancel</v-icon>
                              <span class="font-md">Tolak</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <template v-slot:item.totalOvertime="{ item }">
                    <v-menu
                      class="elevation-10"
                      open-on-hover
                      bottom
                      transition="slide-y-transition"
                      offset-y
                      :position-y="200"
                    >
                      <template v-slot:activator="{ on }">
                        <div class="tex-center" v-on="item.meta.approved === 'approved' ? '' : on">
                          <span
                            :class="
                              item.meta.approved
                                ? 'black--text'
                                : item.totalOvertime > 0
                                ? 'red--text font-weight-bold'
                                : 'black--text'
                            "
                          >
                            {{
                            item.totalOvertime > 0
                            ? convertDuration(item.totalOvertime)
                            : '-'
                            }}
                          </span>
                          <v-icon
                            class="ml-1"
                            v-if="item.meta.approved === 'approved'"
                            color="green"
                          >check_circle</v-icon>
                          <v-icon
                            class="ml-1"
                            v-else-if="item.meta.approved === 'rejected'"
                            color="red"
                          >cancel</v-icon>
                        </div>
                      </template>
                      <v-list
                        v-if="
                          item.totalOvertime !== '-' &&
                            item.totalOvertime !== 0 &&
                            !item.meta.approved
                        "
                        class="py-0"
                      >
                        <v-list-item @click="confirmOvertime(item.id, true, 'late')">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon small class="mr-2 green--text">check</v-icon>
                              <span class="font-md">Terima</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="confirmOvertime(item.id, false, 'late')">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon small class="mr-2 red--text">cancel</v-icon>
                              <span class="font-md">Tolak</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <template v-slot:item.totalWork="{ item }">
                    {{
                    item.totalWork > 0 ? convertDuration(item.totalWork) : '-'
                    }}
                  </template>
                </v-data-table>
                <pagination
                  :loading="isLoading"
                  v-if="listAttendance.length > 0"
                  v-on:getListData="getListData($event)"
                ></pagination>
              </v-flex>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="600">
      <v-card>
        <v-card-title class="subheading px-8 d-flex flex-row align-center justify-space-between">
          <div>{{ attendance.id ? 'Edit' : 'Tambah' }} Kehadiran</div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="px-2 py-0" cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="attendance.employee_id"
                    :items="listBaseEmployee"
                    item-text="name"
                    item-value="id"
                    label="Nama Karyawan"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    disabled
                    v-model="attendance.department_name"
                    item-text="name"
                    item-value="id"
                    label="Departemen"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-menu
                    v-model="date3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        color="grey darken-2"
                        v-model="attendance.date_entry"
                        label="Tanggal Masuk"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="attendance.date_entry"
                      :max="currentDate"
                      locale="id"
                      @input="date3 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="6" sm="6" md="6">
                  <v-text-field
                    v-model.trim="attendance.time_check_in"
                    hide-details
                    v-mask="mask"
                    label="Jam Masuk"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="6" sm="6" md="6">
                  <v-text-field
                    v-model.trim="attendance.time_check_out_for_break"
                    hide-details
                    v-mask="mask"
                    label="Mulai Istirahat"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="6" sm="6" md="6">
                  <v-text-field
                    v-model.trim="attendance.time_check_in_for_break"
                    hide-details
                    v-mask="mask"
                    label="Selesai Istirahat"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="6" sm="6" md="6">
                  <v-text-field
                    v-model.trim="attendance.time_check_out"
                    hide-details
                    v-mask="mask"
                    label="Jam Pulang"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-8 py-4">
          <v-btn min-width="100" color="grey darken-1" dark @click="closeForm()">Tutup</v-btn>
          <v-btn min-width="100" color="primary" @click="save()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmMultiDelete" persistent max-width="650">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          <span v-if="formDataDelete.isAllSelected">
            Apakah anda yakin ingin menghapus
            <b>SEMUA</b> data kehadiran
            <b>
              <small>({{ totalData }} data sesuai filter saat ini)</small>
            </b>?
          </span>
          <span v-else>
            Apakah anda yakin ingin menghapus data kehadiran yang sudah dipilih
            <b>
              <small>({{ formDataDelete.ids.length }} data)</small>
            </b>?
          </span>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="elevation-0"
            color="red darken-1"
            text
            @click="dialogConfirmMultiDelete = false"
          >Tidak</v-btn>
          <v-btn class="elevation-0" color="primary" text @click="deleteSelected()">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="700">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data kehadiran&nbsp;
          <b>
            "{{
            attendance && attendance.employee ? attendance.employee.name : ''
            }}"
          </b>
          pada
          <b>"{{ attendance.meta? convertDate(attendance.meta.rawData.date) : '' }}"</b>?
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="elevation-0" color="red darken-1" text @click="dialogDelete = false">Tidak</v-btn>
          <v-btn class="elevation-0" color="primary" text @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogBreak" persistent max-width="430">
      <v-card>
        <v-card-title>
          <div class="title">Konfirmasi Jam Istirahat</div>
          <div class="font-md grey--text">Pilih salah satu untuk menjadi jam istirahat</div>
        </v-card-title>
        <v-card-text v-if="breakDialogStatus">
          <v-menu bottom>
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" value label="Pilih jam istirahat" v-if="!getBreak.start"></v-text-field>
              <v-text-field
                v-else
                v-on="on"
                :value="`${getBreak.start} - ${getBreak.end}`"
                label="Pilih jam istirahat"
              ></v-text-field>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, index) in breakList"
                :key="index"
                @click="setBreak(item, index)"
              >
                <v-list-item-title>{{ item.start }} - {{ item.end }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div class="red--text" v-if="messageAdjustment !== ''">{{ messageAdjustment }}</div>
        </v-card-text>
        <v-card-text v-else>Apakah anda yakin untuk menerima data dari sistem?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="elevation-0" color="red darken-1" text @click="dialogBreak = false">Tidak</v-btn>
          <v-btn class="elevation-0" color="primary" text @click="adjustBreak()">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogOvertime" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Lembur</v-card-title>
        <v-card-text v-if="overtimeDialogStatus">
          <v-select
            v-model="getOvertime"
            :items="overtimeList"
            item-value="value"
            item-text="text"
            label="Pilih Total Lembur"
          ></v-select>
          <div class="red--text" v-if="messageAdjustment !== ''">{{ messageAdjustment }}</div>
        </v-card-text>
        <v-card-text v-else>Apakah anda yakin untuk tolak lembur?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="elevation-0" color="red darken-1" text @click="dialogOvertime = false">Tidak</v-btn>
          <v-btn class="elevation-0" color="primary" text @click="adjustOvertime()">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSwitchSchedule" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Pindah Jadwal</v-card-title>
        <v-card-text v-if="switchScheduleDialogStatus">
          <v-menu
            class="elevation-10"
            open-on-hover
            bottom
            transition="slide-y-transition"
            offset-y
            :position-y="200"
          >
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">
                <span>Pilih Golongan</span>
                <v-icon>arrow_drop_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in groupList"
                :key="index"
                @click="selectGolongan(item.id)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div>
            <div>Data golongan</div>
            <strong class="title black--text">
              {{
              getGroup.name ? getGroup.name : '-'
              }}
            </strong>
          </div>
        </v-card-text>
        <v-card-text v-else>Apakah anda yakin untuk tetapkan sebagai izin?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="elevation-0"
            color="red darken-1"
            text
            @click="dialogSwitchSchedule = false"
          >Tidak</v-btn>
          <v-btn
            v-if="getGroup !== ''"
            class="elevation-0"
            color="primary"
            text
            @click="adjustSchedule()"
          >Ya</v-btn>
          <v-btn
            v-else-if="!switchScheduleDialogStatus"
            class="elevation-0"
            text
            @click="adjustSchedule()"
          >Ya</v-btn>
          <v-btn v-else class="elevation-0" text disabled>Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./attendance.ts"></script>
