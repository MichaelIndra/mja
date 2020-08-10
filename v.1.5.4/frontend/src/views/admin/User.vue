<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <div class="title d-flex flex-row">
            <v-icon color="grey" class="mr-2">people</v-icon>
            <div>Data Pengguna</div>
          </div>
          <v-divider class="my-3"></v-divider>
          <div>
            <v-row align="center" justify="space-between">
              <v-col cols="12" sm="6" md="4">
                <v-btn color="primary elevation-0" class="mr-2 icon-box" @click="showForm()">
                  <v-icon small>add</v-icon>
                  <span>Tambah</span>
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="4">
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
                      label="Cari Pengguna"
                    ></v-text-field>
                  </template>
                  <span>Tekan enter untuk mencari</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-card class="round relative card-detail elevation-1 white--text">
              <v-card-text class="relative">
                <v-data-table
                  sort-by="full_name"
                  :headers="headers"
                  :items="listUser"
                  :options.sync="options"
                  :server-items-length="pagination.total"
                  :loading="isLoading"
                  class="elevation-0"
                >
                  <template v-slot:item.roles="{ item }">{{item.role_text}}</template>
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
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="600">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon color="primary">{{ user.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{user.id ? 'Edit' : 'Tambah'}} Pengguna
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ user.id ? 'mengubah' : 'menambahkan' }} data karyawan</div>
          </div>
          <v-icon @click="closeForm">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="$v.user.first_name.$model"
                    label="Nama depan"
                    required
                    :error="$v.user.first_name.$error"
                    :error-messages="$v.user.first_name.$error ? `Nama depan wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="$v.user.last_name.$model"
                    label="Nama belakang"
                    required
                    :error="$v.user.last_name.$error"
                    :error-messages="$v.user.last_name.$error ? `Nama belakang wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="$v.user.email.$model"
                    label="Alamat Email"
                    required
                    :error="$v.user.email.$error"
                    :error-messages="!$v.user.email.email ? 'Format email salah' : !$v.user.email.required & $v.user.email.$error ? 'Email wajib diisi' : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-text-field
                    color="grey darken-2"
                    v-model.trim="$v.user.username.$model"
                    label="Username"
                    required
                    :error="$v.user.username.$error"
                    :error-messages="$v.user.username.$error ? `Username wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-select
                    v-model.trim="$v.user.role.$model"
                    :items="listRole"
                    item-text="description"
                    item-value="id"
                    label="Role Pengguna"
                    :error="$v.user.role.$error"
                    :error-messages="$v.user.role.$error ? `Role wajib diisi` : ''"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="12" sm="6" md="6">
                  <v-select
                    v-model.trim="$v.user.branch_id.$model"
                    :items="listBranch"
                    item-text="name"
                    item-value="id"
                    label="Branch Pengguna"
                    :error="$v.user.branch_id.$error"
                    :error-messages="$v.user.branch_id.$error ? `Role wajib diisi` : ''"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col block class="py-0" cols="12" sm="12" md="12">
                  <div class="block orange darken-2 text-center py-2 px-6">
                    <span class="black--text">Password default yaitu (12345)</span>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4 px-8 py-4 d-flex flex-row">
          <v-btn min-width="100" color="elevation-0 grey darken-1" dark @click="closeForm">Tutup</v-btn>
          <v-btn
            :disabled="$v.user.first_name.$error || $v.user.last_name.$error || $v.user.role.$error || $v.user.username.$error || $v.user.email.$error"
            min-width="100"
            color="elevation-0 primary"
            @click.stop="save()"
          >Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="600">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5">
          <img src="../../assets/trash.png" alt class="my-6" />
          <div class="title black--text my-2">Konfirmasi Hapus Karyawan</div>
          <div>
            Apakah anda yakin ingin menghapus data pengguna
            <b>"{{ user.full_name }}"</b> ?
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              class="elevation-0"
              min-width="100"
              block
              large
              color="grey darken-1"
              dark
              @click="dialogDelete = false"
            >Tidak</v-btn>
          </v-col>
          <v-col cols="6" class="py-0 px-0 pl-2">
            <v-btn
              class="elevation-0"
              min-width="100"
              block
              large
              color="primary"
              @click="deleteData"
            >Ya</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./user.ts"></script>