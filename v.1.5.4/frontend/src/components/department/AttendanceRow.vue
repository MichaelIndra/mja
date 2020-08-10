<template>
  <div>
    <div v-for="(item, index) in attendances" :key="index">
      <v-expansion-panels accordion class="mb-2">
        <v-expansion-panel class="elevation-0">
          <v-expansion-panel-header class="body-2 flex-column">
            <v-row class="mb-3" align="center" justify="space-around">
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Nama Karyawan</div>
                  <div class="black--text">{{ item.employee.name }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Masuk</div>
                  <div class="black--text">{{ item.time_check_in }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Pulang</div>
                  <div class="black--text">{{ item.time_check_out }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Mulai Istirahat</div>
                  <div class="black--text">{{ item.time_check_out_for_break }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Selesai Istirahat</div>
                  <div class="black--text">{{ item.time_check_in_for_break }}</div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mb-3" align="center" justify="space-around">
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Nama Karyawan</div>
                  <div class="black--text">{{ item.employee.name }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Masuk</div>
                  <div class="black--text">{{ item.time_check_in }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Pulang</div>
                  <div class="black--text">{{ item.time_check_out }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Mulai Istirahat</div>
                  <div class="black--text">{{ item.time_check_out_for_break }}</div>
                </div>
              </v-col>
              <v-col class="py-0 d-flex flex-row align-start">
                <div>
                  <div>Jam Selesai Istirahat</div>
                  <div class="black--text">{{ item.time_check_in_for_break }}</div>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <schedule :schedule="item.employee.group.schedule.schedules"></schedule>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script lang="ts" src="./attendanceRow.ts"></script>