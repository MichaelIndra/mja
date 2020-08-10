<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col cols="8">
        <v-card class="mx-auto pa-4" min-height="150" elevation="1">
          <div class="d-flex flex-row justify-space-between align-center">
            <div class="title d-flex flex-row">
              <v-icon color="grey" class="mr-2">person</v-icon>
              <div>Pengaturan Akun</div>
            </div>
          </div>
          <div class="mt-5">
            <v-row>
              <v-col cols="6">
                <div class="grey--text">Nama Depan</div>
                <div class="mb-5">{{ user.first_name }}</div>
                <div class="grey--text">Alamat Email</div>
                <div>{{ user.email }}</div>
              </v-col>
              <v-col cols="6">
                <div class="grey--text">Nama Belakang</div>
                <div class="mb-5">{{ user.last_name }}</div>
                <div class="grey--text">Role</div>
                <div>{{ displayRole }}</div>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row v-if="editPassword">
              <v-col cols="12">
                <div
                  class="font-md black--text grey lighten-4 px-3 py-3 mb-6 round"
                >Penggantian Password</div>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  color="grey"
                  v-model="newPassword"
                  label="Password baru"
                  :type="visibility ? 'text' : 'password'"
                  :append-outer-icon="!visibility ? 'visibility' : 'visibility_off'"
                  @click:append-outer="visibility = !visibility"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  :color="!checkReTypePassword && reTypePassword !== '' ? 'green' : 'grey'"
                  :error-messages="checkReTypePassword ? 'Password tidak sama' : ''"
                  v-model="reTypePassword"
                  label="Ulangi Password"
                  :type="visibility ? 'text' : 'password'"
                  :append-outer-icon="!visibility ? 'visibility' : 'visibility_off'"
                  @click:append-outer="visibility = !visibility"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="editPassword">
                <!-- <v-alert
                  class="mb-4"
                  type="info"
                >Setelah mengganti password, anda akan di arahkan keluar dari sistem, kemudian silahkan login kembali dengan password baru</v-alert>-->
                <v-btn class="grey mr-3" @click="cancelChangePassword" dark>Batal</v-btn>
                <v-btn class="primary" @click="confirmPassword">Simpan</v-btn>
              </v-col>
              <v-col cols="12" v-else>
                <v-btn class="primary mr-3" @click="changeAccountInfo" dark>Perbarui data akun</v-btn>
                <v-btn class="green" @click="confirmChangePassword" dark>Ubah password</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogConfirmPassword" persistent max-width="650">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon class="mr-3" color="primary">person</v-icon>Konfirmasi perubahan password
            </div>
            <!-- <div class="caption ml-8 grey--text darken-3">Form mengubah data akun pengguna</div> -->
          </div>
          <v-icon @click="cancelChangePassword">close</v-icon>
        </v-card-title>
        <v-card-text>
          <div
            style="font-size: 16px; color: black; margin: 20px 0;"
          >Apakah anda yakin ingin mengubah password anda? proses ini tidak bisa dibatalkan</div>
          <v-alert
            class="mb-4"
            type="info"
          >Setelah mengganti password, anda akan di arahkan keluar dari sistem, kemudian silahkan login kembali dengan password baru</v-alert>
        </v-card-text>
        <v-card-actions class="grey lighten-4 px-6 py-4 d-flex flex-row">
          <v-btn class="grey px-3" @click="cancelChangePassword" dark>Batal</v-btn>
          <v-btn class="primary px-4" @click="savePassword">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalChangeAccount" persistent max-width="600">
      <v-card>
        <v-card-title
          class="subheading px-8 d-flex flex-row grey lighten-5 align-center justify-space-between"
        >
          <div>
            <div>
              <v-icon class="mr-3" color="primary">person</v-icon>Perbarui data akun
            </div>
            <div class="caption ml-8 grey--text darken-3">Form mengubah data akun pengguna</div>
          </div>
          <v-icon @click="modalChangeAccount = false">close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field grey v-model="account.first_name" color="grey" label="Nama Depan"></v-text-field>
                <v-text-field grey v-model="account.last_name" color="grey" label="Nama Belakang"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4 px-8 py-4 d-flex flex-row">
          <v-btn
            min-width="100"
            class="elevation-0"
            color="grey darken-1"
            dark
            @click="modalChangeAccount = false"
          >Batal</v-btn>
          <v-btn min-width="100" class="elevation-0" color="primary" @click.stop="save()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./account.ts"></script>