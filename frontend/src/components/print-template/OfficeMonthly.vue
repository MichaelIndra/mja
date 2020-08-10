<template>
  <tbody class="table-payslip-print">
    <tr class="bo-l bo-r">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <!-- <tr>
      <td rowspan="2" colspan="2"></td>
      <td colspan="3">Cabang Pusat</td>
      <td colspan="2">Tanggal Cetak</td>
    </tr>
    <tr>
      <td colspan="3">
        <strong>CV. Makmur Jaya Abadi</strong>
        <div>Jl. Jend. Sudirman No.168 A, Kudus</div>
      </td>
      <td colspan="2">{{ formatDate(dateNow, 'long') }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7"></td>
    </tr>-->
    <tr class="bo-l bo-r bo-t">
      <td colspan="7" align="center">
        <strong>SLIP GAJI KARYAWAN</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-b">
      <td colspan="7" align="center">
        Periode {{ convertPeriodDate($route.params.dateStart) }} -
        {{ convertPeriodDate($route.params.dateEnd) }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7" align="center">
        ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Nama</td>
      <td colspan="2">
        <strong>{{ data.name }}</strong>
      </td>
      <td></td>
      <td>Departemen</td>
      <td colspan="2">{{ data.department ? data.department.name : '-' }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>NIK</td>
      <td colspan="2">{{ data.nik }}</td>
      <td></td>
      <td>Area Skill/Jabatan</td>
      <td colspan="2">
        {{ data.area ? data.area.name : '-' }} /
        {{ data.position ? data.position.name : '-' }}
      </td>
    </tr>
    <tr class="bo-1 bo-r">
      <td>Total Hari Kerja:</td>
      <td colspan="2">
        {{
          data.temp_payslip_data
            ? data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.base.jumlah_hari_kerja
              : data.temp_payslip_data.payslip_meta.base.jumlah_hari_kerja
            : 0
        }}
        hari
      </td>
      <td></td>
      <td>Total Hari Libur/Tanggal Merah :</td>
      <td colspan="2">
        {{
          data.temp_payslip_data
            ? data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.attendance_calculation
                  .total_hari_libur
              : data.temp_payslip_data.payslip_meta.attendance_calculation
                  .total_hari_libur
            : '-'
        }}
        hari
      </td>
    </tr>
    <tr>
      <td>Total Hari Masuk</td>
      <td colspan="2">
        {{
          data.temp_payslip_data
            ? data.temp_payslip_data.payslip_meta.total_hari_masuk
            : 0
        }}
        hari
        {{
          data.temp_payslip_data
            ? data.temp_payslip_data.payslip_meta.attendance_calculation
                  .workDuration.currentWorkHours
            : 0
        }}
        jam
      </td>
      <td></td>
      <td>Total Hari Tidak Masuk:</td>
      <td colspan="2">
        {{
          data.temp_payslip_data
            ? data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.deductions
                  .jumlah_potongan_hari +
                ' hari' +
                data.temp_payslip_data.owner_payslip.deductions
                  .jumlah_potongan_izin +
                ' jam'
              : data.temp_payslip_data.payslip_meta.deductions
                  .jumlah_potongan_hari +
                ' hari' +
                data.temp_payslip_data.payslip_meta.deductions
                  .jumlah_potongan_izin +
                ' jam'
            : '-'
        }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7" align="center">
        ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="3" align="center" class="bo-t bo-b">
        <strong>PENDAPATAN</strong>
      </td>
      <td></td>
      <td colspan="3" align="center" class="bo-t bo-b bo-l">
        <strong>POTONGAN</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7" align="center">
        ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Gaji Pokok</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.base.gaji_pokok
              : data.temp_payslip_data.payslip_meta.base.gaji_pokok,
          )
        }}
      </td>
      <td></td>
      <td>
        <span class="mr-2">Potongan Hari Kerja</span>
        <!--({{
          data.temp_payslip_data
            ? data.temp_payslip_data.owner_payslip &&
              userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.deductions.jumlah_potongan_hari + ' hari '
                : data.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_hari + ' hari '
          :''}}
        {{ data.temp_payslip_data ?
          data.temp_payslip_data.owner_payslip &&
          userRole[0] === 'owner'
            ? data.temp_payslip_data.owner_payslip.deductions.jumlah_potongan_izin + ' jam'
              : data.temp_payslip_data.payslip_meta.deductions.jumlah_potongan_izin + ' jam'
            : ''
        }})-->
      </td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.deductions
                  .potongan_hari_kerja
              : data.temp_payslip_data.payslip_meta.deductions
                  .potongan_hari_kerja,
          )
        }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Tunjangan Jabatan</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.base.tunjangan_jabatan
              : data.temp_payslip_data.payslip_meta.base.tunjangan_jabatan,
          )
        }}
      </td>
      <td></td>
      <td>
        Potongan Terlambat
        <!--({{
          data.temp_payslip_data
            ? data.temp_payslip_data.owner_payslip &&
              userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip
                  .attendance_calculation
              : data.temp_payslip_data.payslip_meta.attendance_calculation
                  .durasi_terlambat
            : '-'
        }}
        menit)-->
      </td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.deductions
                  .potongan_terlambat
              : data.temp_payslip_data.payslip_meta.deductions
                  .potongan_terlambat,
          )
        }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Upah 1 hari</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.base.upah_1_hari
              : data.temp_payslip_data.payslip_meta.base.upah_1_hari,
          )
        }}
      </td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.deductions.potongan_astek
              : data.temp_payslip_data.payslip_meta.deductions.potongan_astek,
          )
        }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Insentif</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.base.insentif
              : data.temp_payslip_data.payslip_meta.base.insentif,
          )
        }}
      </td>
      <td v-if="userRole && userRole[0] === 'owner'"></td>
      <td v-else colspan="4"></td>
      <td v-if="userRole && userRole[0] === 'owner'">Potongan Bon</td>
      <td v-if="userRole && userRole[0] === 'owner'">Rp</td>
      <td v-if="userRole && userRole[0] === 'owner'" align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.deductions.potongan_bon
              : data.temp_payslip_data.payslip_meta.deductions.potongan_bon,
          )
        }}
      </td>
    </tr>
    <tr v-if="userRole && userRole[0] === 'owner'">
      <td>Insentif Khusus</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.owner_rewards
                  .insentif_khusus
              : data.temp_payslip_data.payslip_meta.owner_rewards
                  .insentif_khusus,
          )
        }}
      </td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan Khusus</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.owner_deductions
              : data.temp_payslip_data.payslip_meta.owner_deductions
                  .owner_astek_deduction || 0,
          )
        }}
      </td>
    </tr>
    <tr v-if="userRole && userRole[0] === 'owner'">
      <td>Tambahan</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.owner_rewards.tambahan
              : data.temp_payslip_data.payslip_meta.owner_rewards.tambahan,
          )
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr v-if="userRole && userRole[0] === 'owner'">
      <td>Lembur</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.owner_rewards.lembur
              : data.temp_payslip_data.payslip_meta.owner_rewards.lembur,
          )
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr v-if="userRole && userRole[0] === 'owner'">
      <td>Bonus Khusus</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.owner_rewards.bonus_khusus
              : data.temp_payslip_data.payslip_meta.owner_rewards.bonus_khusus,
          )
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td>
        <strong>Total Pendapatan</strong>
      </td>
      <td>
        <strong>Rp</strong>
      </td>
      <td align="right">
        <strong>
          {{
            formatPrice(
              data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
                ? data.temp_payslip_data.owner_payslip.total_pendapatan
                : data.temp_payslip_data.payslip_meta.total_pendapatan,
            )
          }}
        </strong>
      </td>
      <td></td>
      <td>
        <strong>Total Potongan</strong>
      </td>
      <td>
        <strong>Rp</strong>
      </td>
      <td align="right">
        <strong>
          {{
            formatPrice(
              data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
                ? data.temp_payslip_data.owner_payslip.total_potongan
                : data.temp_payslip_data.payslip_meta.total_potongan,
            )
          }}
        </strong>
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7" align="center">
        ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
        <strong>
          PENDAPATAN GAJI = Rp{{
            formatPrice(
              data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
                ? data.temp_payslip_data.owner_payslip.pendapatan_gaji
                : data.temp_payslip_data.payslip_meta.pendapatan_gaji,
            )
          }}
        </strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
        <strong>
          {{
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.pendapatan_gaji_nominal
              : data.temp_payslip_data.payslip_meta.pendapatan_gaji_nominal
          }}
        </strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td v-if="userRole && userRole[0] === 'owner'" colspan="7" align="center">
        SISA SIMPANAN = Rp{{
          formatPrice(
            data.temp_payslip_data.owner_payslip && userRole[0] === 'owner'
              ? data.temp_payslip_data.owner_payslip.sisa_pinjaman
              : data.temp_payslip_data.payslip_meta.sisa_pinjaman,
          )
        }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7" align="center">
        ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      </td>
    </tr>
    <!-- <tr class="bo-l bo-r">
      <td colspan="7"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="5"></td>
      <td colspan="2">Kudus, {{ formatDate(dateNow, 'long') }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="5"></td>
      <td colspan="2">Disetujui Oleh</td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="5"></td>
      <td colspan="2" rowspan="2"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="5"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="5"></td>
      <td colspan="2">{{ userFullName }}</td>
    </tr>-->
  </tbody>
</template>

<script src="./officeMonthly.ts"></script>

<style>
.table-payslip-print td {
  font-family: 'Courier New', Courier, monospace !important;
}
.table-payslip-print span {
  font-family: 'Courier New', Courier, monospace !important;
}
</style>
