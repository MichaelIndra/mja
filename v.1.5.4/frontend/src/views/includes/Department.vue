<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col>
        <div flat>
          <v-row align="center" justify="space-between">
            <v-col class="py-0">
              <div class="title d-flex flex-row">
                <v-icon color="grey" class="mr-2">dashboard</v-icon>
                <div>Data Departemen</div>
              </div>
            </v-col>
            <div class="flex-grow-1"></div>
            <v-col class="text-right py-0">
              <!--              <div class="grey&#45;&#45;text font-sm">Total Departemen : {{ listDepartment.length }}</div>-->
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <div class="white--text">
            <v-row align="stretch">
              <v-col cols="12" md="4">
                <v-card @click="showForm()" hover class="primary card-hover" dark>
                  <v-card-text class="pa-5">
                    <div class="d-flex flex-row align-start">
                      <v-icon large color="white">control_point</v-icon>
                      <div class="ml-3">
                        <div class="font-weight-normal white--text" style="font-size: 20px;">Tambah</div>
                        <div
                          class="font-weight-normal mt-1 white--text"
                          style="font-size: 20px;"
                        >Departemen</div>
                        <div class="mt-4 caption white--text lighten-4">Menambahkan departemen baru</div>
                      </div>
                    </div>
                  </v-card-text>
                  <div style="height: 38px;" class="primary darken-1"></div>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="4"
                class="relative"
                v-for="(item, index) in listDepartment"
                :key="index"
              >
                <v-hover v-slot:default="{ hover }">
                  <div>
                    <v-card
                      class="card-custom card-hover"
                      :elevation="hover ? 10 : 2"
                      @click="goToDetail(item.id)"
                    >
                      <v-card-text class="pa-5 relative" style="z-index: 200;">
                        <v-row align="start" justify="space-between">
                          <v-col class="py-0">
                            <div class="caption grey--text">Departemen</div>
                            <v-list-item-title
                              class="font-weight-normal black--text"
                              style="font-size: 20px;"
                            >{{ item.name }}</v-list-item-title>
                            <div class="caption grey--text mt-5">
                              <span>Ditambahkan</span>
                              {{ item.created_at }}
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <div class="primary py-2 px-4 white--text" v-if="item.branch">
                        <v-icon small class="mr-1" dark>equalizer</v-icon>
                        {{ item.branch.name.length > 38 ? item.branch.name.substring(0, 38) : item.branch.name }}
                      </div>
                    </v-card>
                    <v-col
                      :class="{'action text-right pa-0 px-1' : true, 'action-active': hover}"
                      cols="4"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            small
                            dark
                            text
                            icon
                            v-on="on"
                            color="blue"
                            class="mr-2"
                            :loading="isLoading"
                            :disabled="isLoading"
                            @click="showForm(item.id)"
                          >
                            <v-icon small>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit data</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            small
                            dark
                            text
                            icon
                            v-on="on"
                            color="red darken-2"
                            :loading="isLoading"
                            :disabled="isLoading"
                            @click="showConfirmDelete(item.id)"
                          >
                            <v-icon small>delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Hapus data</span>
                      </v-tooltip>
                    </v-col>
                  </div>
                </v-hover>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col>
                <v-data-table
                  sort-by="name"
                  :headers="headers"
                  :items="listDepartment"
                  :options.sync="options"
                  :server-items-length="pagination.total"
                  :loading="isLoading"
                  class="elevation-1"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      small
                      depressed
                      dark
                      color="green"
                      class="mr-2"
                      :loading="isLoading"
                      :disabled="isLoading"
                      @click.stop="goToDetail(item.id)"
                    >Detail</v-btn>
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
                      depressed
                      dark
                      color="red darken-2"
                      class="mr-2"
                      :loading="isLoading"
                      :disabled="isLoading"
                      @click="showConfirmDelete(item.id)"
                    >Hapus</v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>-->
          </div>
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
              <v-icon color="primary">{{ department.id ? 'assessment' : 'add_circle'}}</v-icon>
              {{department.id ? 'Edit' : 'Tambah'}} Departemen
            </div>
            <div
              class="caption ml-8 grey--text darken-3"
            >Form {{ department.id ? 'mengubah' : 'menambahkan' }} data departemen</div>
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
                    v-model="department.name"
                    label="Nama departemen"
                    required
                    :error="department.errors.name"
                    :error-messages="department.errors.name ? `Nama department wajib diisi` : ''"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="department.branch_id"
                    :items="listBranch"
                    item-text="name"
                    item-value="id"
                    label="Daftar Cabang"
                    :error="department.errors.branch_id"
                    :error-messages="department.errors.branch_id ? `Nama cabang wajib diisi` : ''"
                  ></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="department.meta.payslip_filter"
                    :items="listPayslipFilter"
                    item-text="name"
                    item-value="id"
                    label="Periode Gaji"
                    :error="department.errors.payslip_filter"
                    :error-messages="department.errors.payslip_filter ? `Periode gaji wajib diisi` : ''"
                  ></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="department.meta.payslip_type"
                    :items="listPayslipType"
                    item-text="name"
                    item-value="id"
                    label="Tipe Slip Gaji"
                    :error="department.errors.payslip_type"
                    :error-messages="department.errors.payslip_type ? `Tipe slip gaji wajib diisi` : ''"
                  ></v-autocomplete>
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
            @click="closeForm"
          >Tutup</v-btn>
          <v-btn
            min-width="100"
            class="elevation-0"
            color="primary"
            :disabled="$v.department.name.$error"
            @click.stop="save()"
          >Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="500">
      <v-card class="custom-modal text-center">
        <v-card-text class="py-5">
          <img src="../../assets/trash.png" alt class="my-6" />
          <div class="title black--text my-2">Konfirmasi Hapus Data</div>
          <div>
            Apakah anda ingin menghapus departemen
            <strong>{{ dataDepartment.name }}</strong> ?
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              class="elevation-0"
              min-width="100"
              color="grey darken-1"
              block
              large
              dark
              @click="dialogDelete = false"
            >Tidak</v-btn>
          </v-col>
          <v-col cols="6" class="py-0 px-0 pr-2">
            <v-btn
              block
              large
              dark
              class="elevation-0"
              min-width="100"
              color="primary"
              @click="deleteData"
            >Ya</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./department.ts"></script>