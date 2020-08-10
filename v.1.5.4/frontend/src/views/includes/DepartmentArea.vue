<template>
  <v-row>
    <v-col cols="12" sm="12" md="12">
      <v-card class="mt-4 round">
        <v-card-text>
          <v-row>
            <v-col class="py-0">
              <v-row class="pb-3">
                <v-col class="py-0 d-flex flex-row align-center" cols="12" sm="12" md="12">
                  <v-icon class="mr-2" small>info</v-icon>
                  <div class="black--text">Detail Area</div>
                </v-col>
              </v-row>
              <v-row align="center" justify="space-between">
                <v-col cols="4" class="py-0">
                  <v-btn
                    class="elevation-0 my-3"
                    color="primary"
                    @click="showForm(null, 'area')"
                  >Tambah Area</v-btn>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        prepend-inner-icon="search"
                        single-line
                        class="white elevation-0"
                        hide-details
                        dense
                        outlined
                        color="grey darken-2"
                        v-model="keyword"
                        @keyup.enter="searchKeyword"
                        label="Cari nama area"
                      ></v-text-field>
                    </template>
                    <span>Tekan enter untuk mencari</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <template v-if="listArea.length > 0">
                <div
                  :class="{'box-icon px-5' : true, 'grey lighten-4' : index % 2 !== 0}"
                  v-for="(item, index) in listArea"
                  :key="index"
                >
                  <v-row align="center">
                    <v-col class="d-flex flex-row">
                      <v-icon
                        class="box-icon blue lighten-4 px-3 mr-5"
                        color="blue darken-2"
                      >equalizer</v-icon>
                      <div>
                        <div class="font-sm">Nama Area</div>
                        <div class="subtitle-1 black--text">{{ item.name }}</div>
                      </div>
                    </v-col>
                    <v-col>
                      <div class="font-sm">Nominal</div>
                      <div class="subtitle-1 black--text">{{ formatPrice(item.bonus) }}</div>
                    </v-col>
                    <v-col>
                      <div class="font-sm">Tanggal Ditambahkan</div>
                      <div class="subtitle-1 black--text">{{ item.created_at }}</div>
                    </v-col>
                    <v-col>
                      <div class="font-sm">Tanggal Diubah</div>
                      <div class="subtitle-1 black--text">{{ item.updated_at }}</div>
                    </v-col>
                    <v-col cols="1">
                      <v-menu
                        class="elevation-10"
                        open-on-hover
                        bottom
                        left
                        transition="slide-y-transition"
                        offset-x
                        :position-y="200"
                      >
                        <template v-slot:activator="{ on }">
                          <div v-on="on">
                            <v-icon>more_vert</v-icon>
                          </div>
                        </template>

                        <v-list class="py-0">
                          <v-list-item @click="showDetailPosition(item.id)">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon small class="mr-2">notes</v-icon>
                                <span class="font-md">Detail</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="showForm(item.id, 'area')">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon small class="mr-2">edit</v-icon>
                                <span class="font-md">Edit</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="showConfirmDelete(item.id, 'area')">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon small class="mr-2">delete</v-icon>
                                <span class="font-md">Delete</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                </div>
              </template>
              <div v-else class="text-sm-center mb-5">
                <img src="../../assets/empty-state.png" alt />
                <div
                  class="title"
                >{{ keyword == '' ? 'Data Area Kosong' : `Data "${keyword}" tidak ditemukan` }}</div>
                <div>Silahkan Tambahkan Data Area Terlebih Dahulu</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="dialogDetailArea" persistent max-width="800">
      <v-card>
        <v-card-title class="subheading px-6 d-flex flex-row align-center justify-space-between">
          <div>Data Posisi</div>
          <v-icon @click="closeForm('dialogDetailArea')">close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-row align="center" justify="space-between">
            <v-col cols="4" class="py-0">
              <v-btn
                class="elevation-0 my-3"
                color="primary"
                @click="showForm(null, 'position')"
              >Tambah Posisi</v-btn>
            </v-col>
          </v-row>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Nama Posisi</th>
                  <th class="text-left">Nominal Bonus</th>
                  <th class="text-left">Tanggal Ditambahkan</th>
                  <th class="text-left">Tanggal Diperbarui</th>
                  <th class="text-left">Aksi</th>
                </tr>
              </thead>
              <tbody v-if="listPosition.length > 0">
                <tr v-for="(item, index) in listPosition" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ formatPrice(item.bonus) }}</td>
                  <td>{{ item.created_at }}</td>
                  <td>{{ item.updated_at }}</td>
                  <td>
                    <v-btn
                      @click="showForm(item.id, 'position')"
                      title="Ubah data golongan"
                      small
                      color="blue"
                      dark
                      class="mr-2 elevation-0"
                    >Edit</v-btn>
                    <v-btn
                      @click="showConfirmDelete(item.id, 'position')"
                      title="Hapus data golongan"
                      small
                      color="red darken-2"
                      dark
                      class="mr-2 elevation-0"
                    >Hapus</v-btn>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="5" align="center">Data Posisi Kosong</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFormArea" persistent max-width="500">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ area.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{area.id ? 'Edit' : 'Tambah'}} Area
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ area.id ? 'mengubah' : 'menambahkan' }} data area</div>
          </div>
          <v-icon @click="closeForm('dialogFormArea')">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="area.name"
                    label="Nama Area"
                    required
                    :error="area.errors.name"
                    :error-messages="area.errors.name ? `Nama area wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-currency-field
                    color="grey darken-2"
                    prefix="Rp"
                    v-bind="currency_config"
                    v-model.trim="area.bonus"
                    :error="area.errors.bonus"
                    :error-messages="area.errors.bonus ? `Nominal bonus wajib diisi` : ''"
                    label="Nominal Bonus"
                    required
                  ></v-currency-field>
                </v-col>
              </v-row>
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
            @click="closeForm('dialogFormArea')"
          >Tutup</v-btn>
          <v-btn
            min-width="100"
            class="elevation-0"
            color="primary"
            :disabled="$v.area.name.$error || $v.area.bonus.$error"
            @click.stop="saveArea()"
          >Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFormPosition" persistent max-width="500">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ position.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{position.id ? 'Edit' : 'Tambah'}} Posisi
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ position.id ? 'mengubah' : 'menambahkan' }} data posisi</div>
          </div>
          <v-icon @click="closeForm('dialogFormPosition')">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="position.name"
                    label="Nama Posisi"
                    required
                    :error="position.errors.name"
                    :error-messages="position.errors.name ? `Nama posisi wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-currency-field
                    color="grey darken-2"
                    prefix="Rp"
                    v-bind="currency_config"
                    v-model.trim="position.bonus"
                    :error="position.errors.bonus"
                    :error-messages="position.errors.bonus ? `Nominal bonus wajib diisi` : ''"
                    label="Nominal Bonus"
                    required
                  ></v-currency-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4 px-8 py-4 d-flex flex-row">
          <v-btn
            min-width="100"
            color="grey darken-1"
            dark
            @click="closeForm('dialogFormPosition')"
          >Tutup</v-btn>
          <v-btn
            min-width="100"
            color="primary"
            :disabled="$v.position.name.$error || $v.position.bonus.$error"
            @click.stop="savePosition()"
          >Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteArea" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data departemen
          <b>"{{ area.name }}"</b>?
        </v-card-text>
        <v-card-actions class="px-6 py-4">
          <v-btn
            class="elevation-0"
            min-width="100"
            color="grey darken-1"
            dark
            @click="closeForm('dialogDeleteArea')"
          >Tidak</v-btn>
          <v-btn class="elevation-0" min-width="100" color="primary" @click="deleteDataArea">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeletePosition" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data departemen
          <b>"{{ position.name }}"</b>?
        </v-card-text>
        <v-card-actions class="px-6 py-4">
          <v-btn
            class="elevation-0"
            min-width="100"
            color="grey darken-1"
            dark
            @click="closeForm('dialogDeletePosition')"
          >Tidak</v-btn>
          <v-btn class="elevation-0" min-width="100" color="primary" @click="deleteDataPosition">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts" src="./departmentArea.ts"></script>

<style lang="css">
.item--active {
  background: #d8d8d8;
}
.item--active .v-list-item__title {
  color: black !important;
}
</style>