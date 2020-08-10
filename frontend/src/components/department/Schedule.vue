<template>
  <div>
    <div class="d-flex flex-row align-center justify-space-between">
      <div class="d-flex flex-row align-start">
        <div class="black--text mr-5">Data Jadwal</div>
        <div class="font-sm black--text">Jadwal dari masing-masing karyawan di hari sesuai kehadiran</div>
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
              <tr v-for="(item, index) in schedule" :key="index">
                <td>{{ convertDate(item.value) }}</td>
                <td>{{ item.start }}</td>
                <td>{{ item.end ? item.end : getTime(item.duration) }}</td>
                <td>{{ item.flexible_break ? 'Fleksibel' : 'Sesuai Jadwal' }}</td>
                <td>
                  <v-chip class="ma-2" dark small :color="item.active ? 'green' : 'grey darken-1'">
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
</template>

<script lang="ts" src="./schedule.ts"></script>