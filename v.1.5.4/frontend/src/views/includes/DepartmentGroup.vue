<template>
  <div fluid class="mt-4">
    <v-row>
      <v-col class="py-0" cols="12" sm="8" md="8">
        <v-card class="round relative card-detail elevation-1">
          <v-card-text class="relative">
            <div class="d-flex flex-row align-center justify-space-between mb-6">
              <div class="d-flex flex-row">
                <v-icon color="grey" class="mr-2" small>dashboard</v-icon>
                <div class="black--text">Detail Golongan</div>
              </div>
            </div>
            <div v-if="listGroup.length > 0">
              <data-group :activeGroup="activeGroup"></data-group>
            </div>
            <div v-else class="text-sm-center mb-5">
              <img src="../../assets/empty-state.png" alt />
              <div class="title">Data Golongan Kosong</div>
              <div>Silahkan Tambahkan Data Golongan Terlebih Dahulu</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="py-0" cols="12" sm="4" md="4">
        <div>
          <v-btn block large color="primary" class="mb-5 round elevation-0" @click="showForm()">
            <v-icon dark class="mr-3">add</v-icon>Tambah data golongan
          </v-btn>
        </div>
        <v-card class="elevation-1 round">
          <v-row class="mx-2">
            <v-col class="d-flex flex-row align-center" cols="12" sm="12" md="12">
              <v-icon class="mr-2" small>info</v-icon>
              <div class="black--text">Daftar Golongan</div>
            </v-col>
          </v-row>
          <v-list shaped dense class="pt-0" v-if="listGroup.length > 0">
            <v-list-item-group class="group-list" color="primary">
              <v-list-item
                @click="changeSelectedGroup(item.id)"
                :class="{ 'item--active' : selectedGroup === item.id }"
                v-for="(item, i) in listGroup"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          small
                          class="mr-3 mt-1 red--text"
                        >{{ item.switchable ? 'sync' : 'sync_disabled' }}</v-icon>
                        {{ item.name }}
                      </template>
                      <span>{{ item.switchable ? 'Dapat ditukar' : 'Tidak dapat ditukar' }}</span>
                    </v-tooltip>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row">
                  <v-btn
                    @click="showForm(item.id)"
                    title="Ubah data golongan"
                    small
                    :color="selectedGroup !== item.id ? 'grey' : 'blue'"
                    dark
                    text
                    :disabled="selectedGroup !== item.id"
                    icon
                    class="mr-2"
                  >
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-btn
                    @click="showConfirmDelete(item.id)"
                    title="Hapus data golongan"
                    small
                    :color="selectedGroup !== item.id ? 'grey' : 'red darken-2'"
                    dark
                    text
                    :disabled="selectedGroup !== item.id"
                    icon
                  >
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-list v-else class="text-sm-center">
            <v-list-item>
              <v-list-item-content>Tidak ada golongan</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="1000">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ group.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{group.id ? 'Edit' : 'Tambah'}} Golongan
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ group.id ? 'mengubah' : 'menambahkan' }} data golongan</div>
          </div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <div class="d-flex my-3 flex-row align-start">
                <v-icon color="grey" class="mr-2" small>dashboard</v-icon>
                <span>Detail Golongan</span>
              </div>
              <v-row>
                <v-col class="py-0" cols="12" sm="5" md="5">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="$v.group.name.$model"
                    label="Nama Golongan"
                    required
                    :error="$v.group.name.$error"
                    :error-messages="$v.group.name.$error ? `Nama golongan wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="5" md="5">
                  <v-currency-field
                    color="grey darken-2"
                    prefix="Rp"
                    v-bind="currency_config"
                    v-model.trim="$v.group.base_salary.$model"
                    :error="$v.group.base_salary.$error"
                    :error-messages="$v.group.base_salary.$error ? `Nominal gaji wajib diisi` : ''"
                    label="Gaji UMR"
                    required
                  ></v-currency-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="2" md="2">
                  <div class="font-sm">Dapat Ditukar</div>
                  <v-switch
                    class="pt-0 mt-0"
                    color="primary"
                    v-model="$v.group.switchable.$model"
                    inset
                  ></v-switch>
                </v-col>
              </v-row>
              <v-divider class="my-5"></v-divider>
              <div class="d-flex flex-row align-center justify-space-between mb-5">
                <div>
                  <v-icon color="grey" class="mr-2" small>calendar_today</v-icon>
                  <span>Data Jadwal Kerja</span>
                </div>
                <div>
                  <v-select
                    class="mt-0 pt-0"
                    :items="schedules"
                    hide-details
                    v-model="scheduleType"
                    item-text="name"
                    item-value="id"
                    single-line
                    label="Tipe Jadwal"
                  ></v-select>
                </div>
                <!-- <div class="d-flex flex-row align-center">
                  <v-switch
                    hide-details
                    color="primary"
                    v-model="sameAllSchedule"
                    class="mt-0"
                    inset
                  ></v-switch>
                  <div class="font-sm">Samakan semua jadwal</div>
                </div>-->
              </div>
              <v-divider class="my-5"></v-divider>
              <v-card-text></v-card-text>
              <div v-if="scheduleType === 0">
                <div v-for="(v, index) in group.schedule.schedules" :key="index">
                  <div :class="{ 'py-6 px-5 round' : true, 'grey lighten-4': index % 2 !== 0}">
                    <v-row align="start">
                      <v-col class="py-0 ml-7">
                        <div class="font-sm">Status Hari</div>
                        <v-switch color="primary" v-model="v.active" inset></v-switch>
                      </v-col>
                      <v-col class="py-0">
                        <v-text-field
                          color="grey darken-2"
                          label="Hari"
                          :value="convertDate(v.value)"
                          readonly
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-0" cols="3">
                        <v-text-field
                          :error="v.error && v.start_one"
                          v-model.trim="v.start_one"
                          hide-details
                          v-mask="mask"
                          label="Jam Masuk"
                        ></v-text-field>
                        <v-text-field
                          :error="v.error && v.start_two"
                          v-model.trim="v.start_two"
                          hide-details
                          v-mask="mask"
                          label="Jam Pulang"
                        ></v-text-field>
                        <!-- <div class="font-sm">Jam Masuk</div> -->
                        <!-- <vue-timepicker
                          placeholder="-"
                          format="HH:mm"
                          @change="setTimeSchedule(index)"
                          v-model.trim="v.start_one"
                        ></vue-timepicker>-->
                        <!-- <vue-timepicker
                          @change="setTimeSchedule(index)"
                          :disabled="v.start_one !== '' ? false : true"
                          hide-disabled-hours
                          placeholder="-"
                          format="HH:mm"
                          :hour-range="v.start_one_hour"
                          v-model.trim="v.start_two"
                        ></vue-timepicker>-->
                      </v-col>
                      <v-col class="py-0" cols="3">
                        <v-text-field
                          :error="v.error && v.end_one"
                          v-model.trim="v.end_one"
                          hide-details
                          v-mask="mask"
                          label="Jam Istirahat Mulai"
                        ></v-text-field>
                        <v-text-field
                          :error="v.error && v.end_two"
                          v-model.trim="v.end_two"
                          hide-details
                          v-mask="mask"
                          label="Jam Istirahat Selesai"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-alert class="mt-4 py-2" v-if="v.error" type="error">Cek kembali bagian ini</v-alert>
                  </div>
                </div>
              </div>
              <div v-if="scheduleType === 1">
                <div v-for="(v, index) in $v.group.schedule.schedules.$each.$iter" :key="index">
                  <v-row
                    align="start"
                    :class="{ 'py-6 px-5 round' : true, 'grey lighten-4': index % 2 !== 0}"
                  >
                    <v-col class="py-0 ml-7">
                      <div class="font-sm">Status Hari</div>
                      <v-switch color="primary" v-model="v.active.$model" inset></v-switch>
                    </v-col>
                    <v-col class="py-0">
                      <v-text-field
                        color="grey darken-2"
                        label="Hari"
                        :value="convertDate(v.value.$model)"
                        readonly
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="3">
                      <v-text-field
                        v-model.trim="v.start_one.$model"
                        hide-details
                        v-mask="mask"
                        label="Jam Masuk"
                      ></v-text-field>
                      <v-text-field
                        v-model.trim="v.start_two.$model"
                        hide-details
                        v-mask="mask"
                        label="Jam Pulang"
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="3">
                      <!-- <v-text-field
                        v-model.trim="v.duration.$model"
                        label="Durasi Istirahat"
                        hint="Durasi dalam satuan jam"
                        persistent-hint
                        suffix="Jam"
                      ></v-text-field>-->
                      <v-select
                        class="white elevation-0"
                        hide-details
                        v-model.trim="v.duration_hours.$model"
                        :items="listHours"
                        item-text="text"
                        item-value="value"
                        label="Durasi Istirahat (Jam)"
                        :menu-props="{ top: true, offsetY: true }"
                      ></v-select>
                      <v-select
                        class="white elevation-0"
                        hide-details
                        v-model.trim="v.duration_minutes.$model"
                        :items="listMinutes"
                        item-text="text"
                        item-value="value"
                        label="Durasi Istirahat (Menit)"
                        :menu-props="{ top: true, offsetY: true }"
                      ></v-select>
                      <!-- <v-text-field
                        suffix="Jam"
                        color="grey darken-2"
                        v-model.trim="v.duration_hours.$model"
                        hide-details
                        label="Durasi istirahat"
                        required
                        v-mask="maskHour"
                      ></v-text-field>-->
                      <!-- <v-text-field
                      suffix="Menit"
                        color="grey darken-2"
                        v-model.trim="v.duration_minutes.$model"
                        hide-details
               { }          v-mask="maskHour"
                      ;                ></v-text-field>-->
                    </v-col>
                  </v-row>
                </div>
              </div>
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
          <v-btn
            min-width="100"
            class="elevation-0"
            color="primary"
            :disabled="$v.group.name.$error"
            @click.stop="save"
          >Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="500">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5">
          <img src="../../assets/trash.png" alt class="my-6" />
          <div class="title black--text my-2">Konfirmasi Hapus Data</div>
          <div>
            Apakah anda ingin menghapus golongan
            <strong>{{ group.name }}</strong> ?
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              class="elevation-0"
              block
              large
              color="grey darken-1"
              dark
              @click="dialogDelete = false"
            >Tidak</v-btn>
          </v-col>
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn class="elevation-0" block large color="primary" @click="deleteData">Ya</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" src="./departmentGroup.ts"></script>

<style lang="css">
.item--active {
  background: #d8d8d8;
}
.item--active .v-list-item__title {
  color: black !important;
}
.group-list .v-item--active::before {
  opacity: 0 !important;
}
.mx-input-wrapper .mx-input-append {
  display: none;
}
.mx-time-list {
  padding-left: 0 !important;
}
.time-picker {
  padding-top: 0px;
  margin-bottom: 5px;
}
.display-time {
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  padding: 0px 0px 4px !important;
  height: auto !important;
  font-size: 14px !important;
  color: black !important;
  border-bottom: 1px solid #949494 !important;
  font-family: Roboto !important;
  font-weight: normal !important;
}
</style>