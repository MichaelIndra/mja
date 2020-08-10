<template>
  <v-container
    class="fill-height pa-0 ma-0"
    style="background: #ffffff none repeat scroll 0% 0%;"
    fluid
  >
    <v-layout align-center justify-center>
      <v-row align="center" justify="center">
        <v-col sm="0" md="6" class="pa-0">
          <img src="../../assets/11.jpg" style="height: 100vh;width: 100%;object-fit: cover;" alt />
        </v-col>
        <v-col sm="6" md="6" class="pa-0">
          <v-row align="center" justify="center" style="height: 100vh;">
            <v-card class="elevation-0 text-center" width="400">
              <div class="text-center pb-8 px-8">
                <img src="../../assets/logo-color.svg" class="mb-2" />
                <div class="mb-5 font-weight-black headline">ePayroll</div>
                <div class="mb-5 font-weight-black headline">RESET PASSWORD</div>
              </div>
              <div v-if="token && !email">
                <v-alert
                  type="error"
                  border="left"
                  icon="mdi-close"
                  elevation="2"
                  style="text-align:left;"
                  dismissible>
                  Link reset password tidak valid.
                </v-alert>
              </div>
              <div v-else-if="token">
                <v-card-text class="white py-0 px-8">
                  <v-form @submit.prevent="changePassword" id="login-form">
                    <v-text-field
                      color="grey darken-2"
                      label="Password"
                      name="login"
                      type="password"
                      v-model="password"
                    ></v-text-field>
                    <v-text-field
                      color="grey darken-2"
                      label="Ketik Ulang Password"
                      name="login"
                      type="password"
                      v-model="re_password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
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
                    :loading="isLoading"
                    :disabled="isLoading"
                  >Simpan</v-btn>
                  <div class="flex-grow-1"></div>
                </v-card-actions>
              </div>
              <div v-else>
                <v-alert
                  v-if="isSuccess"
                  type="success"
                  border="left"
                  icon="mdi-check"
                  elevation="2"
                  style="text-align:left;"
                  dismissible>
                  Link untuk reset password berhasil dikirim ke email anda. Silakan cek kotak masuk atau kotak spam anda.  
                </v-alert>
                <v-card-text class="white py-0 px-8">
                  <v-form @submit.prevent="resetPassword" id="login-form">
                    <v-text-field
                      color="grey darken-2"
                      label="Email/Username"
                      name="login"
                      type="text"
                      v-model="email"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions class="px-8 py-5">
                  <v-btn
                    large
                    color="orange darken-4"
                    class="elevation-0 py-4 ap-special-button"
                    dark
                    block
                    justify-center
                    type="submit"
                    form="login-form"
                    :loading="isLoading"
                    :disabled="isLoading"
                  >Reset Password</v-btn>
                  <div class="flex-grow-1"></div>
                </v-card-actions>
              </div>
              <router-link style="text-decoration:none;" :to="{name: 'login'}">Kembali ke halaman login</router-link>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script lang="ts" src="./forgotPassword.ts"></script>

<style>
.rounded-card {
  border-radius: 15px;
}

.elevation-0.py-4.ap-special-button.v-btn.v-btn--block.v-btn--contained.v-btn--disabled.theme--dark.v-size--large {
    background-color: 
    #e3e3e3 !important;
    color: #a6a2a2 !important;
}
</style>