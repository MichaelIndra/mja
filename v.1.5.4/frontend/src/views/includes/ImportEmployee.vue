<template>
  <v-container class="pa-2" fluid>
    <v-alert
      dismissible
      type="error"
      v-if="errorData.status === 406"
    >Item berwarna merah belum sesuai, atau belum terdaftar di sistem.</v-alert>
    <v-alert
      dismissible
      type="error"
      v-if="errorData.status === 409"
    >Ada duplikasi data karyawaan, periksa daftar karyawan dibawah.</v-alert>
    <v-alert dismissible class="alert-icon-center" type="error" v-if="errorListEmployee.length > 0">
      <div class="d-flex flex-row justify-space-between align-center">
        <span>Ada data inputan yang masih kosong, silahkan cek kembali data excel Anda</span>
        <v-btn color="white" light class="elevation-0" @click="emptyInputData = true">
          <v-chip color="error" class="mr-2" small>{{ errorListEmployee.length }}</v-chip>
          <span>Lihat detail error</span>
        </v-btn>
      </div>
    </v-alert>
    <v-row>
      <v-col cols="12" class="py-0">
        <div class="d-flex flex-row align-start justify-space-between">
          <v-file-input
            accept=".xls, .xlsx"
            multiple
            color="primary"
            class="mr-4"
            hide-details
            placeholder="Impor data karyawan"
            @change="importSheets"
            :clearable="false"
          ></v-file-input>
          <v-btn
            class="mt-5 mr-2 elevation-0"
            min-width="100"
            color="primary"
            @click.stop="save()"
          >Import Data</v-btn>
          <v-btn
            dark
            class="mt-5"
            min-width="100"
            color="grey darken-1 elevation-0"
            @click="cancelUpload()"
          >Batal</v-btn>
        </div>
      </v-col>
      <v-col cols="12" v-if="errorData.status === 406">
        <div
          class="font-md my-2 black--text d-flex flex-row align-center yellow darken-1"
          style="border-radius: 7px; padding: 10px 20px;"
        >
          <v-icon small color="black" class="mr-2">info</v-icon>
          <span>Ada kesalahan pada daftar ini, perbaiki data yang berwarna merah. Kemudian upload ulang data yang telah direvisi</span>
        </div>
        <v-data-table
          :headers="headersImported"
          :items="errorData.data"
          :options.sync="options"
          class="elevation-1"
        >
          <template v-slot:item.department="{ item }">
            <span
              :class="item.department_id === null ? 'red--text' : 'black--text'"
            >{{item.department}}</span>
          </template>
          <template v-slot:item.group="{ item }">
            <span
              :class="item.group_id === null || item.department_id === null? 'red--text' : 'black--text'"
            >{{item.group}}</span>
          </template>
          <template v-slot:item.area="{ item }">
            <span
              :class="item.area_id === null || item.department_id === null ? 'red--text' : 'black--text'"
            >{{item.area}}</span>
          </template>
          <template v-slot:item.skill="{ item }">
            <span
              :class="item.position_id === null || item.department_id === null || item.area_id === null ? 'red--text' : 'black--text'"
            >{{item.skill}}</span>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" v-else-if="errorData.status === 409">
        <div
          class="font-md my-2 black--text d-flex flex-row align-center yellow darken-1"
          style="border-radius: 7px; padding: 10px 20px;"
        >
          <v-icon small color="black" class="mr-2">info</v-icon>
          <span>Data berikut sudah ada di sistem, silahkan cek kembali nik karyawan dibawah. Kemudian upload ulang data yang telah direvisi</span>
        </div>
        <v-data-table
          :headers="headers"
          :items="tempListError"
          :items-per-page="10"
          class="elevation-0"
        ></v-data-table>
      </v-col>
      <v-col cols="12" v-else-if="errorListEmployee.length > 0">
        <div
          class="font-md my-2 black--text d-flex flex-row align-center yellow darken-1"
          style="border-radius: 7px; padding: 10px 20px;"
        >
          <v-icon small color="black" class="mr-2">info</v-icon>
          <span>Ada kesalahan pada daftar ini, perbaiki data yang ada didaftar error. Kemudian upload ulang data yang telah direvisi</span>
        </div>
        <v-data-table
          :headers="headersErrorList"
          :items="this.postFile.dataItems"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.date_of_birth="{ item }">
            <span
              :class="item.date_of_birth.toLowerCase().includes('invalid date') ? 'red--text' : 'black--text'"
            >{{item.date_of_birth}}</span>
          </template>
          <template v-slot:item.active_date="{ item }">
            <span
              :class="item.active_date.toLowerCase().includes('invalid date') ? 'red--text' : 'black--text'"
            >{{item.active_date}}</span>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" v-else-if="postFile.dataItems && postFile.dataItems.length > 0">
        <div
          class="font-md my-2 black--text d-flex flex-row align-center"
          style="border-radius: 7px; padding: 10px 20px; background: #4caf50;"
        >
          <v-icon small color="white" class="mr-2">check</v-icon>
          <span class="white--text">Data aman untuk diimport. Klik tombol <b>IMPORT DATA</b>.</span>
        </div>
      </v-col>
      <v-col cols="12" v-else>
        <div
          class="font-md my-2 black--text d-flex flex-row align-center"
          style="border-radius: 7px; padding: 10px 20px; background: #fafafa;"
        >
          <v-icon small color="grey" class="mr-2">info</v-icon>
          <span>Preview import akan muncul disini, silahkan import data terlebih dahulu data yang telah dipilih</span>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="emptyInputData" width="650">
      <v-card>
        <v-card-text class="py-5">
          <div class="d-flex flex-row align-center justify-space-between">
            <div class="title black--text">Data yang tidak lengkap</div>
            <v-icon color="black" @click="emptyInputData = false">close</v-icon>
          </div>
          <div
            class="my-3 grey lighten-4 py-2 px-3"
            v-for="(item, index) in errorListEmployee"
            :key="index"
          >{{ index + 1 }}. {{ item.message }}</div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogInfo" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Info</v-card-title>
        <v-card-text>Tidak ada data untuk di simpan. Silahkan unggah data karyawan.</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn tile class="elevation-0" color="red darken-1" text @click="dialogInfo = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./importEmployee.ts"></script>

<style lang="css">
.alert-icon-center .v-alert__icon.v-icon {
  margin-top: 5px;
}
</style>
