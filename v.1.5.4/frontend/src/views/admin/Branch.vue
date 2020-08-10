<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">assessment</v-icon>
                <div>Data Cabang</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
              <!--              <div class="grey&#45;&#45;text font-sm">Total Cabang : {{ listBranch.length }}</div>-->
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row align="center">
            <v-col cols="12" sm="4" md="4">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="primary elevation-0"
                    class="mr-2 icon-box"
                    @click="showForm()"
                  >
                    <v-icon small>add</v-icon>Tambah
                  </v-btn>
                </template>
                <span>Tambah data cabang</span>
              </v-tooltip>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col cols="12" sm="6" md="4" class="py-0 text-right">
              <v-row align="start">
                <v-col class="text-right">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        single-line
                        class="white elevation-0"
                        hide-details
                        dense
                        outlined
                        prepend-inner-icon="search"
                        color="grey darken-2"
                        v-model="keyword"
                        hint="Tekan enter untuk mencari"
                        label="Cari Nama Cabang"
                        @keyup.enter="getListBranch"
                      ></v-text-field>
                    </template>
                    <span>Tekan enter untuk mencari</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card class="round relative card-detail elevation-1 white--text">
            <v-card-text class="relative">
              <v-data-table
                sort-by="description"
                :headers="headers"
                :items="listBranch"
                :options.sync="options"
                :server-items-length="pagination.total"
                :loading="isLoading"
                class="elevation-0"
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
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="500">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ branch.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{branch.id ? 'Edit' : 'Tambah'}} Cabang
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ branch.id ? 'mengubah' : 'menambahkan' }} data cabang</div>
          </div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-text-field
                    color="grey darken-2"
                    v-model="branch.name"
                    label="Nama Cabang"
                    required
                    :error="branch.errors.name"
                    :error-messages="branch.errors.name ? `Nama wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-text-field
                    color="grey darken-2"
                    v-model="branch.address"
                    label="Alamat"
                    required
                    :error="branch.errors.address"
                    :error-messages="branch.errors.address ? `Alamat wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-text-field
                    color="grey darken-2"
                    v-model="branch.telp"
                    label="Nomor Telepon"
                    required
                    :error="branch.errors.telp"
                    :error-messages="branch.errors.telp ? `Nomor telepon wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-text-field
                    color="grey darken-2"
                    v-model="branch.postal_code"
                    label="Kode Pos"
                    required
                    counter="5"
                    :error="branch.errors.postal_code"
                    :error-messages="branch.errors.postal_code ? `Kode pos wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4 px-8 py-4 d-flex flex-row">
          <v-btn min-width="100" color="elevation-0 grey darken-1" dark @click="closeForm">Tutup</v-btn>
          <v-btn
            min-width="100"
            color="elevation-0 primary"
            :disabled="$v.branch.name.$error || $v.branch.address.$error || $v.branch.telp.$error || $v.branch.postal_code.$error"
            @click.stop="save()"
          >Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="600">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5">
          <img src="../../assets/trash.png" class="my-6" alt />
          <div class="title black--text my-2">Konfirmasi Hapus Cabang</div>
          <div>
            Apakah anda yakin ingin menghapus cabang
            <b>"{{ branch.name }}"</b>?
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              class="elevation-0"
              block
              large
              color="grey darken-1"
              dark
              @click="dialogDelete = false"
            >Tidak</v-btn>
          </v-col>
          <v-col cols="6" class="py-0 px-0 pl-2">
            <v-btn class="elevation-0" block large color="primary" @click="deleteData">Ya</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./branch.ts"></script>