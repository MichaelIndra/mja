<template>
  <div>
    <div class="mt-3" v-if="options.type === 'report_payslip'">
      <v-row class="mb-5">
        <v-col cols="6" class="py-0">
          <div class="d-flex flex-row align-center mb-1">
            <div class="font-md mb-1">Filter tanggal Mulai</div>
          </div>
          <div>
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
                  v-model="dateStart"
                  label="Tanggal mulai"
                  readonly
                  dense
                  class="white elevation-0"
                  hide-details
                  outlined
                  single-line
                  v-on="on"
                  prepend-inner-icon="calendar_today"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateStart"
                :max="options.type !== 'leave' ? dateEnd : ''"
                @input="date1 = false"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-col>
        <v-col cols="6" class="py-0">
          <div class="d-flex flex-row align-center mb-1">
            <div class="font-md mb-1">Filter tanggal Selesai</div>
          </div>
          <div>
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
                  v-model="dateEnd"
                  label="Tanggal selesai"
                  readonly
                  dense
                  class="white elevation-0"
                  hide-details
                  outlined
                  single-line
                  v-on="on"
                  prepend-inner-icon="calendar_today"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateEnd"
                :min="dateStart"
                :max="options.type !== 'leave' ? dateNow : ''"
                @input="date2 = false"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row v-if="options.type !== 'report_payslip_outcome'" align="center">
        <v-col>
          <div class="d-flex flex-row align-center mb-1">
            <div class="font-md">Filter Departemen</div>
            <div class="flex-grow-1"></div>
            <v-btn
              @click="clearFilter('department')"
              text
              color="indigo"
              class="py-0"
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
            v-model="departmentId"
            :items="listDepartmentFilter"
            item-text="name"
            item-value="id"
            label="Departemen"
          ></v-select>
        </v-col>
        <v-col>
          <div class="d-flex flex-row align-center mb-2">
            <div class="font-md">Filter Golongan</div>
            <div class="flex-grow-1"></div>
          </div>
          <v-select
            single-line
            class="white elevation-0"
            hide-details
            dense
            outlined
            v-model="groupId"
            :items="listGroupFilter"
            item-text="name"
            item-value="id"
            label="Golongan"
          ></v-select>
        </v-col>
        <v-col>
          <div class="d-flex flex-row align-center mb-2">
            <div class="font-md">Filter Area</div>
            <div class="flex-grow-1"></div>
          </div>
          <v-select
            single-line
            class="white elevation-0"
            hide-details
            dense
            outlined
            v-model="areaId"
            :items="listAreaFilter"
            item-text="name"
            item-value="id"
            label="Area"
          ></v-select>
        </v-col>
        <v-col>
          <div class="d-flex flex-row align-center mb-2">
            <div class="font-md">Filter Posisi</div>
            <div class="flex-grow-1"></div>
          </div>
          <v-select
            single-line
            class="white elevation-0"
            hide-details
            dense
            outlined
            v-model="positionId"
            :items="listPositionFilter"
            item-text="name"
            item-value="id"
            label="Posisi"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col
          :cols="options.type !== 'report_payslip_outcome' ? 3 : 6"
          class="py-0"
          v-if="options.type !== 'employee'"
        >
          <div class="d-flex flex-row align-center mb-1">
            <div
              class="font-md mb-1"
            >{{ options.type === 'report_payslip_outcome' ? 'Filter Tanggal Mulai' : 'Filter Tanggal' }}</div>
          </div>
          <div>
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
                  v-model="dateStart"
                  label="Tanggal mulai"
                  readonly
                  dense
                  class="white elevation-0"
                  hide-details
                  outlined
                  single-line
                  v-on="on"
                  prepend-inner-icon="calendar_today"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateStart"
                :max="options.type !== 'leave' ? dateEnd : ''"
                @input="date1 = false"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-col>
        <v-col
          :cols="options.type !== 'report_payslip_outcome' ? 3 : 6"
          class="py-0"
          v-if="options.type !== 'employee'"
        >
          <div class="d-flex flex-row align-center mb-1">
            <div
              class="font-md mb-1"
            >{{ options.type === 'report_payslip_outcome' ? 'Filter Tanggal Selesai' : 'Filter Tanggal' }}</div>
          </div>
          <div>
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
                  v-model="dateEnd"
                  label="Tanggal selesai"
                  readonly
                  dense
                  class="white elevation-0"
                  hide-details
                  outlined
                  single-line
                  v-on="on"
                  prepend-inner-icon="calendar_today"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateEnd"
                :min="dateStart"
                :max="options.type !== 'leave' ? dateNow : ''"
                @input="date2 = false"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-col>
        <v-col cols="3" class="py-0" v-if="options.type === 'employee'">
          <div class="d-flex flex-row align-center mb-1">
            <div class="font-md mb-1">Status Karyawan</div>
          </div>
          <v-select
            single-line
            class="white elevation-0"
            hide-details
            dense
            placeholder="Pilih kategori karyawan"
            outlined
            v-model="statusEmployee"
            :items="statusEmployees"
          ></v-select>
        </v-col>
        <v-col cols="3" class="py-0" v-if="options.type === 'employee'">
          <div class="d-flex flex-row align-center mb-1">
            <div class="font-md mb-1">Keaktifan Karyawan</div>
          </div>
          <v-select
            single-line
            class="white elevation-0"
            hide-details
            dense
            placeholder="Status Keaktifan"
            outlined
            v-model="activeEmployee"
            :items="activeEmployees"
            item-text="name"
            item-value="value"
          ></v-select>
        </v-col>
        <v-col v-if="options.type !== 'report_payslip_outcome'" cols="6" class="py-0">
          <div class="d-flex flex-row align-center">
            <div class="font-md mb-2">
              Pencarian Nama Karyawan
              <span class="grey--text font-sm">(Tekan enter untuk mencari)</span>
            </div>
          </div>
          <v-text-field
            single-line
            class="white elevation-0"
            dense
            hide-details
            outlined
            :error="warn.keyword"
            prepend-inner-icon="search"
            color="grey darken-2"
            v-model="keyword"
            @keyup.enter="searchKeyword"
            label="Tekan enter untuk mencari"
          ></v-text-field>
          <span v-if="warn.keyword" class="red--text font-md mt-2">Cek kembali kata kunci anda</span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
  
<script lang="ts" src="./filter.ts"></script>