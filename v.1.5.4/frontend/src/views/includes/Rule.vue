<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <div class="title d-flex flex-row">
            <v-icon color="grey" class="mr-2">person</v-icon>
            <div>Data Rule</div>
          </div>
          <v-divider class="my-3"></v-divider>
          <div class="white--text">
            <v-row>
              <v-col>
                <v-btn color="primary" class="mr-2 elevation-0" @click="showForm()">Tambah Rule</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="listRule"
                  :options.sync="options"
                  :server-items-length="pagination.total"
                  :loading="isLoading"
                  class="elevation-1"
                >
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
                        <div class="d-flex flex-row align-center" v-on="on">
                          <div class="body-2">Pilihan</div>
                          <v-icon class="ml-6">more_vert</v-icon>
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
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="900">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ rule.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{rule.id ? 'Edit' : 'Tambah'}} Rumus
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ rule.id ? 'mengubah' : 'menambahkan' }} data rumus gaji</div>
          </div>
          <v-icon @click="cancelAction">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row class="mb-3">
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-text-field hide-details v-model="rule.name" label="Nama rule*" required></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="mb-3">
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-select
                        :items="['COMPONENT', 'REWARD', 'DEDUCTION']"
                        hide-details
                        v-model="rule.type"
                        label="Tipe*"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row class="mb-3">
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-textarea hide-details v-model="rule.description" label="Deskripsi"></v-textarea>
                    </v-col>
                  </v-row>
                  <!-- <v-row>
                    <v-col class="py-0" cols="12" sm="12" md="12">
                      <v-text-field hide-details v-model="rule.value" label="Konten*" required></v-text-field>
                    </v-col>
                  </v-row>-->
                </v-form>
              </v-col>
              <v-col cols="7">
                <div>
                  <v-col cols="10" class="my-2 pa-0 px-1">
                    <div
                      class="grey lighten-4 round px-3 py-2 result-calc"
                      style="min-height: 60px;"
                    >
                      <div class="font-sm mb-2 blue--text">Hasil rumus</div>
                      <div>{{ logList + current }}</div>
                    </div>
                  </v-col>
                </div>
                <div class="d-flex flex-row">
                  <v-col cols="10" class="my-3 pa-0 px-1">
                    <v-menu offset-y block>
                      <template v-slot:activator="{ on }">
                        <v-btn color="green liighten-2" class="elevation-0" block dark v-on="on">
                          Pilih Variabel
                          <v-icon class="ml-3">arrow_drop_down</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in listVariable"
                          :key="index"
                          @click="appendVariable(item.value)"
                        >
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </div>
                <div class="d-flex flex-row">
                  <v-col cols="7" class="pa-0">
                    <div class="d-flex flex-row number">
                      <v-btn
                        large
                        @click="clear()"
                        :class="calcButtonOperation"
                        color="white--text primary"
                      >C</v-btn>
                      <v-btn
                        large
                        @click="grouping('(')"
                        :class="calcButtonOperation"
                        color="white--text"
                      >(</v-btn>
                      <v-btn
                        large
                        @click="grouping(')')"
                        :class="calcButtonOperation"
                        color="white--text"
                      >)</v-btn>
                    </div>
                    <div class="d-flex flex-row number">
                      <v-btn large @click="append('7')" :class="calcButtonNumber">7</v-btn>
                      <v-btn large @click="append('8')" :class="calcButtonNumber">8</v-btn>
                      <v-btn large @click="append('9')" :class="calcButtonNumber">9</v-btn>
                    </div>
                    <div class="d-flex flex-row number">
                      <v-btn large @click="append('4')" :class="calcButtonNumber">4</v-btn>
                      <v-btn large @click="append('5')" :class="calcButtonNumber">5</v-btn>
                      <v-btn large @click="append('6')" :class="calcButtonNumber">6</v-btn>
                    </div>
                    <div class="d-flex flex-row number">
                      <v-btn
                        large
                        v-on:keyup.tab="pressedEnter"
                        @click="append('1')"
                        :class="calcButtonNumber"
                      >1</v-btn>
                      <v-btn large @click="append('2')" :class="calcButtonNumber">2</v-btn>
                      <v-btn large @click="append('3')" :class="calcButtonNumber">3</v-btn>
                    </div>
                    <div class="d-flex flex-row number">
                      <v-btn large @click="append('3')" :class="calcButtonNumber">0</v-btn>
                    </div>
                  </v-col>
                  <v-col cols="3" class="pa-0">
                    <div class="d-flex flex-column number">
                      <v-btn
                        large
                        @click="correction()"
                        :class="calcButtonOperation"
                        color="white--text grey darken-1"
                      >
                        <v-icon color="white">keyboard_arrow_left</v-icon>
                      </v-btn>
                      <v-btn
                        large
                        @click="divide('/')"
                        :class="calcButtonOperation"
                        color="white--text"
                      >/</v-btn>
                      <v-btn
                        @click="times('+')"
                        large
                        :class="calcButtonOperation + ' text-lowercase'"
                        color="white--text"
                      >*</v-btn>
                      <v-btn
                        large
                        @click="minus('-')"
                        :class="calcButtonOperation"
                        color="white--text"
                      >-</v-btn>
                      <v-btn
                        large
                        @click="plus('+')"
                        :class="calcButtonOperation"
                        color="white--text"
                      >+</v-btn>
                    </div>
                  </v-col>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-8 py-4">
          <v-btn min-width="100" color="elevation-0 grey darken-1" dark @click="cancelAction">Tutup</v-btn>
          <v-btn min-width="100" color="elevation-0 primary" @click.stop="save()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data departemen
          <b>"{{ rule.description }}"</b>?
        </v-card-text>
        <v-card-actions class="px-8 py-4">
          <v-btn
            class="elevation-0"
            min-width="100"
            color="grey darken-1"
            dark
            @click="dialogDelete = false"
          >Tidak</v-btn>
          <v-btn class="elevation-0" min-width="100" color="primary" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./rule.ts"></script>

<style lang="css">
.result-calc {
  min-height: 60px;
  overflow-wrap: break-word;
  /* box-shadow: 0px 2px 5px 1px inset rgba(0, 0, 0, 0.1); */
  /* border: 2px solid #929292 !important; */
}
</style>