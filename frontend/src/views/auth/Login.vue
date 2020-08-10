<template>
  <v-container
    class="fill-height pa-0 ma-0"
    style="background: #ffffff none repeat scroll 0% 0%;"
    fluid
  >
    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-title>
          Pilih aktor
          <span class="red--text">(testing only)</span>
        </v-card-title>
        <v-card-text>
          <div class="grey--text darken-3">
            Fitur ini hanya untuk testing semata, pilih aktor dibawah untuk
            login
          </div>
          <v-divider class="my-5"></v-divider>
          <v-btn text block @click="setUser('owner')">owner</v-btn>
          <v-btn text block @click="setUser('admin')">admin</v-btn>
          <!-- <v-divider></v-divider> -->
          <!-- <v-btn text block @click="setUser('branchmanager')">branch manager</v-btn>
          <v-btn text block @click="setUser('branchpayroll')">branch hr payroll</v-btn>
          <v-btn text block @click="setUser('branchattendance')">branch hr attendance</v-btn>-->
          <v-divider></v-divider>
          <v-btn text block @click="setUser('generalmanager')">general manager</v-btn>
          <v-btn text block @click="setUser('generalpayroll')">general hr payroll</v-btn>
          <v-btn text block @click="setUser('generalattendance')">general hr attendance</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout align-center justify-center>
      <v-row align="center" justify="center">
        <v-col sm="0" md="6" class="pa-0">
          <img src="../../assets/11.jpg" style="height: 100vh;width: 100%;object-fit: cover;" alt />
        </v-col>
        <v-col sm="6" md="6" class="pa-0">
          <v-row align="center" justify="center" style="height: 100vh;">
            <v-card class="elevation-0 text-center" width="400">
              <div class="text-center pb-8 px-8">
                <img src="../../assets/logo-color.svg" style="width: 50px" class="mb-5" />
                <div class="mb-5 font-weight-black headline">ePayroll</div>
                <div class="headline body-1 black--text">Attendance & Payroll Management System</div>
                <div class="headline body-1 black--text">CV Makmur Jaya Abadi</div>
              </div>
              <v-card-text class="white py-0 px-8">
                <v-form @submit.prevent="login" id="login-form">
                  <v-text-field
                    color="grey darken-2"
                    label="Email/Username"
                    name="login"
                    type="text"
                    v-model="username"
                  ></v-text-field>
                  <v-text-field
                    color="grey darken-2"
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
<!--
              <v-btn color="green" @click="dialog = !dialog" style="margin: 0 auto;" dark small fab>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
-->
              <v-card-actions class="px-8 py-5">
                <v-btn
                  large
                  color="orange darken-4"
                  class="elevation-0 py-4"
                  dark
                  block
                  justify-center
                  type="submit"
                  form="login-form"
                >Login</v-btn>
                <div class="flex-grow-1"></div>
              </v-card-actions>
              <router-link
                style="text-decoration:none;"
                :to="{ name: 'forgot-password' }"
              >Lupa password?</router-link>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script lang="ts" src="./login.ts"></script>

<style>
.rounded-card {
  border-radius: 15px;
}
</style>
