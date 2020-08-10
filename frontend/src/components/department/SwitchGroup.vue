<template>
  <div>
    <v-alert
      dismissible
      class="alert-icon-center"
      icon="mdi-sync"
      type="warning"
    >
      <div class="d-flex flex-row justify-space-between align-center font-md">
        <span>
          Pergantian golongan (jadwal shift) otomatis harus dilakukan sebelum melakukan import data kehadiran (secara rutin setiap minggu).<br/>
          Import data kehadiran akan mengikuti jadwal setelah pergatian golongan otomatis.<br/>
          <v-tooltip bottom v-if="latestLog.id">
            <template v-slot:activator="{ on }">
              <v-chip
                v-on="on"
                @click.prevent="dialogDetailLog = true"
                class="ma-2"
                color="orange lighten-2"
                text-color="black"
                label
              >
              <v-icon left>query_builder</v-icon>
              Terakhir diperbaharui: <span class="px-1"><b>{{latestLog.created_at_text}}</b></span> ({{showDateInText(latestLog.created_at)}})
              </v-chip>
            </template>
            <span>Klik untuk melihat detail perubahan terakhir</span>
          </v-tooltip>
        </span>
        <v-btn light color="white" class="elevation-0" @click="dialogConfirmSwitch = true" :loading="isLoading" :disabled="isDisabled()">
          <v-icon dark class="mr-3">sync</v-icon> Tukar Jadwal Massal
        </v-btn>
      </div>
    </v-alert>

    <v-dialog v-model="dialogDetailLog" persistence max-width="800">
      <v-card class="custom-modal text-left">
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-left justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">sync</v-icon>
              Detail Perubahan
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >
              Terakhir diperbaharui: <span class="px-1"><b>{{latestLog.created_at_text}}</b></span> ({{showDateInText(latestLog.created_at)}})
            </div>
          </div>
          <v-icon @click="dialogDetailLog = false">close</v-icon>
        </v-card-title>
        <v-card-text class="py-5" v-if="latestLog.id">
          <v-data-table
            sort-by="name"
            :headers="headers"
            :items="latestLog.meta.additional_data.changed"
            class="elevation-0"
          >
            <template v-slot:item.group_name="{ item }">
              {{ item.group_name }} <v-icon>arrow_right_alt</v-icon> {{ item.switch_to_group.name }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              block
              large
              class="elevation-0"
              color="grey darken-2"
              dark
              @click="dialogDetailLog = false"
              >Tutup</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmSwitch" persistence max-width="600">
      <v-card class="custom-modal text-center">
        <v-card-title>
          Konfirmasi
        </v-card-title>
        <v-card-text class="py-5">
          Apakah anda yakin melakukan pergantian golongan (jadwal shift) secara massal?  
        </v-card-text>
        <v-card-actions class="px-8 py-4">
          <v-btn min-width="100" color="grey darken-1" dark @click="dialogConfirmSwitch = false">Tutup</v-btn>
          <v-btn min-width="100" color="primary" @click="switchGroup()">Yakin</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./switchGroup.ts"></script>