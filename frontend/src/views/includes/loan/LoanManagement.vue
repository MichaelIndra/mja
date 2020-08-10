<template>
  <v-container class="pa-2" fluid>
    <v-row align="center" justify="space-between">
      <v-col class="py-0">
        <div class="title d-flex flex-row">
          <v-icon color="grey" class="mr-2">person</v-icon>
          <div>Data Peminjaman</div>
        </div>
      </v-col>
      <div class="flex-grow-1"></div>
      <v-col class="text-right py-0">
        <!--        <div class="grey&#45;&#45;text font-sm">Total Data : {{ listEmployee.length }}</div>-->
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row align="center" justify="space-between">
      <div class="flex-grow-1"></div>
      <v-col cols="12" sm="6" md="2" class="text-right">
        <v-btn
          :outlined="!filter"
          class="elevation-0"
          :color="filter ? 'primary' : 'grey darken-1'"
          @click="showFilter"
        >
          <!-- <v-badge
            v-if="filterCount !== 0"
            class="mr-7"
            :color="filter ? 'white primary--text' : 'primary white--text'"
          >
            <template v-slot:badge>{{ filterCount }}</template>
          </v-badge>-->
          <v-icon class="mr-2" small>filter_list</v-icon>
          <span>Filter</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider v-if="filter" class="mt-3"></v-divider>
    <filters
      :options="filterOption"
      v-on:getListData="getListData($event)"
      v-on:checkFilter="checkFilter($event)"
      v-if="filter"
    ></filters>
    <v-card class="mb-5">
      <v-card-text>
        <div class="black--text mb-3 body-1">Rincian Pinjaman Per Departemen</div>
        <v-divider></v-divider>
        <v-row align="start" class="mt-2">
          <v-col class="py-0" cols="3" v-for="(item, index) in totalLoanByDepartment" :key="index">
            <div>{{item.departments_name}}</div>
            <div
              class="black--text mt-3"
              style="font-size: 24px;"
            >{{item.total_loan ? formatPriceToText(item.total_loan) : '-'}}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-3">
      <v-card-text>
        <v-data-table
          sort-by="employee.name"
          :headers="headers"
          :items="listEmployee"
          class="elevation-0"
          hide-default-footer
          :loading="loadingEmployee"
        >
          <template v-slot:item.latestLoan.total_loan_current="{ item }">
            {{
            item.latestLoan
            ? formatPriceToText(item.latestLoan.total_loan_current)
            : 'Rp0'
            }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="item.active"
              color="green"
              class="mr-3 elevation-0"
              dark
              small
              @click="showConfirm(item)"
            >Tambah Pinjaman</v-btn>
            <v-btn small class="mr-3 elevation-0" v-else disabled>Tambah Pinjaman</v-btn>

            <v-btn
              v-if="item.active"
              color="blue"
              class="elevation-0"
              dark
              small
              @click="showDetail(item.id)"
            >Detail</v-btn>
            <v-btn small class="elevation-0" v-else disabled>Detail</v-btn>
          </template>
        </v-data-table>
        <pagination :loading="loading" v-on:getListData="getListData($event)"></pagination>
      </v-card-text>
    </v-card>

    <v-dialog v-model="detail" max-width="900">
      <v-card>
        <v-card-title class="d-flex flex-row align-center justify-space-between">
          <span>Detail Informasi Pinjaman</span>
          <v-btn fab x-small class="elevation-0 grey darken-2" dark @click="dismisDialogDetail">
            <v-icon small>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <div class="d-flex flex-row align-center justify-space-between">
            <div class="black--text my-3">
              Sisa Pinjaman :
              {{
              listLoan.length > 0
              ? formatPriceToText(listLoan[0].total_loan_current)
              : 'Rp0'
              }}
              <v-btn
                v-if="
                  employee.active &&
                    listLoan.length > 0 &&
                    listLoan[0].total_loan_current > 0
                "
                color="green"
                class="ml-3 elevation-0"
                dark
                small
                @click="showPay(employee)"
              >Bayar</v-btn>
              <v-btn small class="mr-3 elevation-0" v-else disabled>Bayar</v-btn>
            </div>

            <div>Data teratas merupakan data terbaru</div>
          </div>
          <v-divider></v-divider>
          <v-data-table
            sort-by="employee.name"
            :headers="headersLoanDetail"
            :items="listLoan"
            class="elevation-0"
            hide-default-footer
            :loading="loading"
          >
            <template v-slot:item.created_at="{ item }">
              {{
              formatDate(item.created_at)
              }}
            </template>
            <template v-slot:item.description="{ item }">
              <span v-if="item.description">{{ item.description }}</span>
              <span v-else-if="item.type === 'LOAN'">Pinjam</span>
              <span v-else-if="item.type === 'PAY'">Bayar pinjaman</span>
            </template>
            <template v-slot:item.nominal="{ item }">
              <span v-if="item.type === 'LOAN'">+ {{ formatPriceToText(item.nominal) }}</span>
              <span v-else-if="item.type === 'PAY'">- {{ formatPriceToText(item.nominal) }}</span>
            </template>
            <template v-slot:item.type="{ item }">
              <v-chip v-if="item.type === 'LOAN'" color="primary">
                {{
                item.type
                }}
              </v-chip>
              <v-chip v-else-if="item.type === 'PAY'" dark color="green">
                {{
                item.type
                }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <div>
            Tambah Pinjaman
            <strong>({{ employee.name }})</strong>
          </div>
        </v-card-title>
        <v-card-text>
          <v-currency-field
            color="grey darken-2"
            prefix="Rp"
            v-bind="currency_config"
            v-model.trim="loan.nominal"
            label="Nominal Pinjaman"
            required
          ></v-currency-field>
          <v-text-field color="grey darken-2" v-model.trim="loan.description" label="Deskripsi"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="elevation-0 grey darken-2" dark @click="dismisDialog">Batal</v-btn>
          <v-btn class="elevation-0 primary" @click.stop="saveLoan">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPay" max-width="600">
      <v-card>
        <v-card-title>
          <div>
            Bayar Pinjaman
            <strong>({{ employee.name }})</strong>
          </div>
        </v-card-title>
        <v-card-text>
          <v-currency-field
            color="grey darken-2"
            prefix="Rp"
            v-bind="currency_config"
            v-model.trim="loan.nominal"
            label="Nominal Pinjaman"
            required
          ></v-currency-field>
          <v-text-field color="grey darken-2" v-model.trim="loan.description" label="Deskripsi"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="elevation-0 grey darken-2" dark @click="dismisDialog">Batal</v-btn>
          <v-btn class="elevation-0 primary" @click.stop="saveLoan">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./loanManagement.ts"></script>
