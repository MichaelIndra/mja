<template>
  <div>
    <v-row class="mb-3">
      <v-col class="py-0" cols="12" sm="3" md="3">
        <div class="d-flex flex-row align-start">
          <v-icon small class="mr-3 mt-1 box-icon orange lighten-5 orange--text">info</v-icon>
          <div>
            <div class="subtitle">Nama golongan</div>
            <div class="body-1 black--text">{{ activeGroup.name }}</div>
          </div>
        </div>
      </v-col>
      <v-col class="py-0" cols="12" sm="3" md="3">
        <div class="d-flex flex-row align-start">
          <v-icon small class="mr-3 mt-1 box-icon blue lighten-5 blue--text">calendar_today</v-icon>
          <div>
            <div class="subtitle">Terakhir diubah</div>
            <div
              class="body-1 black--text"
            >{{ activeGroup.updated_at ? activeGroup.updated_at.substring(0,10) : '-' }}</div>
          </div>
        </div>
      </v-col>
      <v-col
        v-if="userRole && userRole[0] !== 'general_hr_attendance'"
        class="py-0"
        cols="12"
        sm="3"
        md="3"
      >
        <div class="d-flex flex-row align-start">
          <v-icon small class="mr-3 mt-1 box-icon green lighten-5 green--text">attach_money</v-icon>
          <div>
            <div class="subtitle">Gaji UMR</div>
            <div class="body-1 black--text">{{ formatPrice(activeGroup.base_salary) }}</div>
          </div>
        </div>
      </v-col>
      <v-col class="py-0" cols="12" sm="3" md="3">
        <div class="d-flex flex-row align-start">
          <v-icon small class="mr-3 mt-1 box-icon red lighten-5 red--text">{{ activeGroup.switchable ? 'sync' : 'sync_disabled' }}</v-icon>
          <div class="py-0">
            <!-- <div class="subtitle">Terakhir diubah</div> -->
            <div
              class="body-1 black--text"
            >{{ activeGroup.switchable ? 'Dapat ditukar' : 'Tidak dapat ditukar' }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="grey lighten-3 my-6"></v-divider>
    <div>
      <div class="d-flex flex-row align-center justify-space-between">
        <div class="d-flex flex-row">
          <v-icon color="grey" class="mr-2" small>calendar_today</v-icon>
          <div class="black--text">Data Jadwal</div>
        </div>
      </div>
      <v-row>
        <v-col cols="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Hari</th>
                  <th class="text-left">Jam Kerja</th>
                  <th class="text-left">Jam Istirahat</th>
                  <th class="text-left">Tipe Istirahat</th>
                  <th class="text-left">Aktif</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in activeGroup.schedule.schedules" :key="index">
                  <td>{{ convertDate(item.value) }}</td>
                  <td>{{ item.start }}</td>
                  <td>{{ item.flexible_break ? item.duration + ' Jam' : item.end }}</td>
                  <td>{{ item.flexible_break ? 'Fleksibel' : 'Sesuai Jadwal' }}</td>
                  <td>
                    <v-chip
                      class="ma-2"
                      dark
                      small
                      :color="item.active ? 'green' : 'grey darken-1'"
                    >
                      <v-icon v-if="item.active" left small>check_circle</v-icon>
                      <v-icon v-else left small>cancel</v-icon>
                      {{ item.active ? 'Aktif' : 'Tidak Aktif' }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" src="./dataGroup.ts"></script>