
<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">event_busy</v-icon>
                <div>Data Absensi</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
<!--              <div class="grey&#45;&#45;text font-sm">Total Absensi : {{ listLeave.length }}</div>-->
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row align="center" justify="space-between">
            <v-col cols="12" sm="6" md="4">
              <v-btn color="primary elevation-0" class="mr-2 icon-box" @click="showForm()">
                <v-icon small class="mr-2">add</v-icon>Tambah
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="2" class="text-right">
              <v-btn
                :outlined="!filter"
                class="elevation-0"
                :color="filter ? 'primary' : 'grey darken-1'"
                @click="showFilter"
              >
                <!-- <v-badge
                  v-if="filterCount !== 0"
                  class="mr-7"
                  :color="filter ? 'white primary--text' : 'primary white--text'"
                >
                  <template v-slot:badge>{{ filterCount }}</template>
                </v-badge>-->
                <v-icon class="mr-2" small>filter_list</v-icon>
                <span>Filter</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="filter" class="mt-3"></v-divider>
          <filters
            :options="filterOption"
            v-on:getListData="getListData($event)"
            v-on:checkFilter="checkFilter($event)"
            v-if="filter"
          ></filters>

          <div
            v-if="
              
                (formDataDelete.isAllSelected || formDataDelete.ids.length > 0)
            "
          >
            <v-divider></v-divider>
            <div
              v-if="
                
                  (formDataDelete.isAllSelected ||
                    formDataDelete.ids.length > 0)
              "
              class="py-2"
            >
              <div
                class="d-flex flex-row align-center justify-space-between"
                v-if="formDataDelete.isAllSelected"
              >
                <div>
                  <span>Semua data ditandai</span>
                  <span>
                    <v-chip color="blue" class="ml-2" dark>
                      <strong>Total: {{ totalData }} data</strong>
                    </v-chip>
                  </span>
                </div>
                <v-btn
                  dark
                  color="red elevation-0"
                  class="mx-2 icon-box"
                  @click="dialogConfirmMultiDelete = true"
                >
                  <v-icon>delete</v-icon>Hapus data terpilih
                </v-btn>
              </div>
              <div
                class="d-flex flex-row align-center justify-space-between"
                v-else-if=" formDataDelete.ids.length > 0"
              >
                <div>
                  <span>Data yang ditandai</span>
                  <v-chip color="blue" class="ml-3" dark>
                    <strong>Total: {{ formDataDelete.ids.length }} data</strong>
                  </v-chip>
                </div>
                <v-btn
                  dark
                  color="red elevation-0"
                  class="ml-2 icon-box"
                  @click="dialogConfirmMultiDelete = true"
                >
                  <v-icon>delete</v-icon>Hapus data terpilih
                </v-btn>
              </div>
            </div>
          </div>

          <v-card class="round relative card-detail elevation-1 white--text">
            <v-card-text class="relative">
              <v-data-table
                sort-by="employee.name"
                :headers="headers"
                :items="listLeave"
                :loading="isLoading"
                class="elevation-0"
                hide-default-footer
                show-select
              >
                <template v-slot:header.data-table-select="{}">
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
                <template v-slot:item.actions="{ item }">
                  <v-menu
                    class="elevation-10"
                    open-on-hover
                    bottom
                    transition="slide-y-transition"
                    offset-y
                    :position-y="200"
                  >
                    <template v-slot:activator="{ on }">
                      <div class v-on="on">
                        <v-icon>more_vert</v-icon>
                      </div>
                    </template>
                    <v-list class="py-0">
                      <v-list-item @click="showForm(item.id)">
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-icon small class="mr-2">edit</v-icon>
                            <span class="font-md">Edit</span>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="showConfirmDelete(item.id)">
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-icon small class="mr-2">delete</v-icon>
                            <span class="font-md">Delete</span>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
              <pagination :loading="isLoading" v-on:getListData="getListData($event)"></pagination>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="600">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ leave.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{leave.id ? 'Edit' : 'Tambah'}} Absensi
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ leave.id ? 'mengubah' : 'menambahkan' }} data absensi</div>
          </div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <div class="mb-5">
                <div class="d-flex flex-row align-center mb-2">
                  <div class="font-md">Filter Departemen</div>
                  <div class="flex-grow-1"></div>
                  <v-btn
                    @click="clearFilterForm()"
                    text
                    color="indigo"
                    small
                    style="text-transform: capitalize;"
                  >Clear</v-btn>
                </div>
                <v-select
                  single-line
                  class="white elevation-0"
                  hide-details
                  dense
                  outlined
                  v-model="departmentIdForm"
                  :items="listDepartmentFilter"
                  item-text="name"
                  item-value="id"
                  label="Departemen"
                  @change="departmentName.toLowerCase()==='produksi' ? switchLeave=true : switchLeave=false"
                ></v-select>
              </div>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="leave.employee_id"
                    :items="listEmployee"
                    item-text="name"
                    item-value="id"
                    label="Nama Karyawan"
                    clearable
                    placeholder="Ketik nama karyawan untuk mencari..."
                  >
                    <template v-slot:selection="data">
                      <div>
                        <span>{{ data.item.name }}</span>
                        <span class="mx-3">—</span>
                        <span class="grey--text darken-2">({{ data.item.department.name }})</span>
                      </div>
                    </template>
                    <template v-slot:item="data">
                      <div class="py-3 d-flex flex-row align-center">
                        <v-avatar color="indigo" size="32" class="mr-4">
                          <span class="white--text">{{ data.item.name.substr(0, 1) }}</span>
                        </v-avatar>
                        <div>
                          <div>{{ data.item.name }}</div>
                          <div class="font-sm">
                            <span class="mr-2 grey--text darken-2">Departemen :</span>
                            <span class="black--text">{{ data.item.department.name }}</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-textarea name="input-7-1" label="Keperluan" v-model="leave.description"></v-textarea>
                </v-col>
              </v-row>
              <v-row v-if="Number(this.departmentMeta.payslip_type) === 1">
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-switch
                    v-model="switchLeave"
                    :label="`Tipe Izin : ${switchLeave ? 'Per Jam' : 'Harian'}`"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-menu
                    v-model="date1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        color="grey darken-2"
                        v-model="leave.date_start"
                        label="Tanggal Mulai"
                        prepend-inner-icon="calendar_today"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="leave.date_start"
                      @input="date1 = false"
                      :min="minStartDate"
                      :max="maxDate"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col v-if="!switchLeave" class="py-0" cols="12" sm="6" md="6">
                  <v-menu
                    v-model="date2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        color="grey darken-2"
                        v-model="leave.date_end"
                        label="Tanggal Selesai"
                        prepend-inner-icon="calendar_today"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="leave.date_end"
                      :min="leave.date_start ? leave.date_start : minStartDate"
                      :max="maxDate"
                      @input="date2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row v-if="Number(this.departmentMeta.payslip_type) === 1 && switchLeave">
                <v-col class="py-0" cols="6" sm="6" md="6">
                  <v-text-field
                    v-model.trim="timeStart"
                    hide-details
                    prepend-inner-icon="alarm"
                    v-mask="mask"
                    label="Jam Mulai Izin"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="6" sm="6" md="6">
                  <v-text-field
                    v-model.trim="timeEnd"
                    hide-details
                    prepend-inner-icon="alarm"
                    v-mask="mask"
                    label="Jam Selesai Izin"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
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
          <v-btn min-width="100" class="elevation-0" color="primary" @click="save()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmMultiDelete" persistent max-width="650">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          <span v-if="formDataDelete.isAllSelected">
            Apakah anda yakin ingin menghapus
            <b>SEMUA</b> data absensi
            <b>
              <small>({{ totalData }} data sesuai filter saat ini)</small>
            </b>?
          </span>
          <span v-else>
            Apakah anda yakin ingin menghapus data absensi yang sudah dipilih
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

    <v-dialog v-model="dialogDelete" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data absensi karyawan ini?
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="elevation-0" color="red darken-1" text @click="dialogDelete = false">Tidak</v-btn>
          <v-btn class="elevation-0" color="primary" text @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./leave.ts"></script>