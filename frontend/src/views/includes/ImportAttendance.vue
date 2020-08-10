<template>
  <v-container class="pa-2" fluid>
    <v-alert type="error" v-if="errorData.status === 409">
      Kesalahan data ganda, terdapat data yang sama dan sudah tersimpan di
      sistem.
    </v-alert>
    <v-alert type="error" v-if="errorData.status === 404"
      >Data karyawan tidak di temukan.</v-alert
    >
    <v-alert
      dismissible
      class="alert-icon-center"
      type="error"
      v-if="errorListImport.length > 0"
    >
      <div class="d-flex flex-row justify-space-between align-center">
        <span>
          Ada data yang belum sesuai, silahkan cek kembali data excel anda
        </span>
        <v-btn
          color="white"
          light
          class="elevation-0"
          @click="emptyInputData = true"
        >
          <v-chip color="error" class="mr-2" small>
            {{ errorListImport.length }}
          </v-chip>
          <span>Lihat detail error</span>
        </v-btn>
      </div>
    </v-alert>

    <v-dialog v-model="emptyInputData" width="650">
      <v-card>
        <v-card-text class="py-5">
          <div class="d-flex flex-row align-center justify-space-between">
            <div class="title black--text">Data yang tidak lengkap</div>
            <v-icon color="black" @click="emptyInputData = false">close</v-icon>
          </div>
          <div
            class="my-3 grey lighten-4 py-2 px-3"
            v-for="(item, index) in errorListImport"
            :key="index"
          >
            {{ index + 1 }}. {{ item.message }}
            <v-tooltip bottom v-if="item.additionalMessage">
              <template v-slot:activator="{ on }">
                <v-chip
                  v-on="on"
                  class="ml-2"
                  color="transparent"
                  text-color="primary"
                  label
                >
                  <v-icon center>info</v-icon>
                </v-chip>
              </template>
              <span>Nama karyawan tersimpan: {{ item.additionalMessage }}</span>
            </v-tooltip>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card v-if="isLoading">
      <v-card-text>
        <div class="d-flex flex-column align-center justify-space-between">
          <div class="text-center ma-12">
            <v-progress-circular
              indeterminate
              size="120"
              width="21"
              color="orange"
            ></v-progress-circular>
          </div>
          <div class="text-center ma-12">
            <div class="title">Memproses data</div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col>
        <v-file-input
          accept=".xls, .xlsx"
          multiple
          color="primary"
          class="mr-2"
          placeholder="Impor data kehadiran"
          @change="importSheets"
          :clearable="false"
        ></v-file-input>
        <v-data-table
          :headers="headersImported"
          :items="listImportedAttendance"
          :options.sync="options"
          :loading="isLoading"
          class="elevation-1"
        >
          <template v-slot:item.employeeName="{ item }">
            <span :class="!item.status ? 'red--text' : 'black--text'">
              {{ item.employeeName }}
              <v-tooltip
                bottom
                v-if="
                  !isLoading && item.employeeName.trim() !== item.employeeNameFromExcel.trim()
                "
              >
                <template v-slot:activator="{ on }">
                  <v-chip
                    v-on="on"
                    class="ml-2"
                    color="transparent"
                    text-color="primary"
                    label
                  >
                    <v-icon center>info</v-icon>
                  </v-chip>
                </template>
                <span
                  >Nama karyawan di excel:
                  {{ item.employeeNameFromExcel }}</span
                >
              </v-tooltip>
            </span>
          </template>
          <template v-slot:item.date="{ item }">
            <span>{{ formatDate(item.date, 'short-date') }}</span>
          </template>
          <template v-slot:item.timeCheckIn="{ item }">
            <span
              :class="
                isDateTimeValid(item.timeCheckIn) || item.timeCheckInFalse
                  ? 'red--text'
                  : 'black--text'
              "
              >{{ isDateTimeValid(item.timeCheckIn) ? '' : item.timeCheckIn }}
            </span>
            <v-tooltip
              top
              v-if="isDateTimeValid(item.timeCheckIn) || item.timeCheckInFalse"
            >
              <template v-slot:activator="{ on }">
                <v-icon class="ml-2" color="primary">help</v-icon>
              </template>
              <span>Data waktu tidak urut</span>
            </v-tooltip>
          </template>
          <template v-slot:item.breakStart="{ item }">
            <span
              :class="
                isDateTimeValid(item.breakStart) || item.breakStartFalse
                  ? 'red--text'
                  : 'black--text'
              "
            >
              {{ isDateTimeValid(item.breakStart) ? '' : item.breakStart }}
            </span>

            <v-tooltip
              top
              v-if="isDateTimeValid(item.breakStart) || item.breakStartFalse"
            >
              <template v-slot:activator="{ on }">
                <v-icon class="ml-2" color="primary">help</v-icon>
              </template>
              <span>Data waktu tidak urut</span>
            </v-tooltip>
          </template>
          <template v-slot:item.timeCheckOut="{ item }">
            <span
              :class="
                isDateTimeValid(item.timeCheckOut) || item.timeCheckOutFalse
                  ? 'red--text'
                  : 'black--text'
              "
              >{{ isDateTimeValid(item.timeCheckOut) ? '' : item.timeCheckOut }}
            </span>

            <v-tooltip
              top
              v-if="
                isDateTimeValid(item.timeCheckOut) || item.timeCheckOutFalse
              "
            >
              <template v-slot:activator="{ on }">
                <v-icon class="ml-2" color="primary">help</v-icon>
              </template>
              <span>Data waktu tidak urut</span>
            </v-tooltip>
          </template>
          <template v-slot:item.breakEnd="{ item }">
            <span
              :class="
                isDateTimeValid(item.breakEnd) || item.breakEndFalse
                  ? 'red--text'
                  : 'black--text'
              "
            >
              {{ isDateTimeValid(item.breakEnd) ? '' : item.breakEnd }}</span
            >
            <v-tooltip
              top
              v-if="isDateTimeValid(item.breakEnd) || item.breakEndFalse"
            >
              <template v-slot:activator="{ on }">
                <v-icon class="ml-2" color="primary">help</v-icon>
              </template>
              <span>Data waktu tidak urut</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-btn
          dark
          class="mt-5"
          min-width="100"
          color="grey darken-1"
          @click="cancelUpload()"
          >Batal</v-btn
        >
        <v-btn
          v-if="
            errorListImport.length === 0 &&
              postFile.filteredAttendance.length > 0 &&
              snackbar.value !== false
          "
          class="mt-5 ml-2"
          min-width="100"
          color="primary"
          @click="save()"
          :disabled="isLoading"
          :loading="isLoading"
          >Simpan</v-btn
        >
      </v-col>
    </v-row>
    <v-dialog v-model="dialogInfo" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Info</v-card-title>
        <v-card-text
          >Tidak ada data untuk di simpan. Silahkan unggah data
          kehadiran.</v-card-text
        >
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="elevation-0"
            color="red darken-1"
            text
            @click="dialogInfo = false"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./importAttendance.ts"></script>
