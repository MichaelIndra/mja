<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <div class="title d-flex flex-row">
            <v-icon color="grey" class="mr-2">assignment_ind</v-icon>
            <div>Data Role</div>
          </div>
          <v-divider class="my-3"></v-divider>
          <div class="white--text">
             <!-- <v-row>
              <v-col>
                <v-btn  color="primary" class="mr-2" @click="showForm()">Tambah Role</v-btn>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col>
                <v-data-table
                  sort-by="description"
                  :headers="headers"
                  :items="listRole"
                  :options.sync="options"
                  :server-items-length="pagination.total"
                  :loading="isLoading"
                  class="elevation-1"
                >
                  <!-- <template v-slot:item.actions="{ item }">
                    <v-btn
                      small
                      
                      depressed
                      dark
                      color="blue"
                      class="mr-2"
                      :loading="isLoading"
                      :disabled="isLoading"
                      @click="showForm(item.id)"
                    >Edit</v-btn>
                    <v-btn
                      small
                      
                      :disabled="item.description === 'admin' || isLoading"
                      depressed
                      dark
                      color="red darken-2"
                      class="mr-2"
                      :loading="isLoading"
                      @click="showConfirmDelete(item.id)"
                    >Hapus</v-btn>
                  </template>-->
                </v-data-table>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogForm" persistent max-width="500">
      <v-card>
        <v-card-title class="subheading px-8">{{role.id ? 'Edit' : 'Tambah'}} Role</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-text-field
                    color="grey darken-2"
                    hide-details
                    v-model="role.description"
                    label="Nama role"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-8 py-4">
          <v-btn min-width="100" color="elevation-0 grey darken-1" dark @click="closeForm">Tutup</v-btn>
          <v-btn min-width="100" color="elevation-0 primary" @click.stop="save()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="600">
      <v-card>
        <v-card-title class="title">Konfirmasi Penghapusan</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data departemen
          <b>"{{ role.description }}"</b>?
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

<script lang="ts" src="./role.ts"></script>