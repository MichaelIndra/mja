
<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">person</v-icon>
          <div>Log Data</div>
        </div>
      </v-col>
      <div class="flex-grow-1"></div>
      <v-col class="text-right py-0">
<!--        <div class="grey&#45;&#45;text font-sm">Total Data : {{ listLog.length }}</div>-->
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row align="center" justify="space-between">
      <v-col cols="12">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="blue elevation-0"
              class="mr-2 icon-box"
              @click="backup()"
              dark
            >
                    <span class="v-btn__content">
                      <v-icon>cached</v-icon> Unduh Basis Data
                    </span>
            </v-btn>
          </template>
          <span>Download Basis Data</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-card class="mb-3">
      <v-card-text>
        <v-data-table
          sort-by="employee.name"
          :headers="headers"
          :items="listLog"
          class="elevation-0"
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-btn small class="blue elevation-0 mr-2" @click="showData(item.id)" dark>Detail Log</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>

    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <v-icon color="primary" class="mr-2">info</v-icon>Detail Log
          </div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="black--text">
          <v-container>
            <div class="d-flex flex-row align-start justify-space-between">
              <div>
                <div class="grey--text darken-3">Orang yang melakukan</div>
                <div>
                  <div class="font-lg">{{ detailLog.name }}</div>
                </div>
              </div>
              <div>
                <div class="grey--text darken-3">Data yang diubah</div>
                <div>
                  <div class="font-lg">{{ detailLog.entity }}</div>
                </div>
              </div>
              <div>
                <div class="grey--text darken-3">Tanggal perubahan</div>
                <div>
                  <div class="font-lg">{{ detailLog.action_date }}</div>
                </div>
              </div>
            </div>
            <v-divider class="mt-3 mb-1"></v-divider>
            <v-row align="start">
              <v-col cols="6">
                <div class="title black--text mb-3 grey lighten-4 px-3 py-1">Data Sebelumnya</div>
                <div v-for="(item, index) in detailLog.previous" :key="index">
                  <div class="pb-3">
                    <div class="mb-3">
                      <strong class="mr-3">{{ item[0] }}</strong>
                      <span>{{ item[1] === '-' ? '' : item[1] }}</span>
                    </div>
                    <v-divider v-if="index + 1 !== detailLog.previous.length"></v-divider>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="title black--text mb-3 grey lighten-4 px-3 py-1">Data Sekarang</div>
                <div v-for="(item, index) in detailLog.current" :key="index">
                  <div class="pb-3">
                    <div class="mb-3">
                      <strong class="mr-3">{{ item[0] }}</strong>
                      <span>{{ item[1] === '-' ? '' : item[1] }}</span>
                    </div>
                    <v-divider v-if="index + 1 !== detailLog.current.length"></v-divider>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./log.ts"></script>