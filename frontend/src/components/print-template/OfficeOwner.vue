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
    <tr v-if="data.payslips && data.payslips.length > 0" class="bo-1 bo-r">
      <td>Total Hari Kerja:</td>
      <td colspan="2">
        {{ data.temp_payslip_data.owner_payslip.base.jumlah_hari_kerja || 0 }}
        hari
      </td>
      <td></td>
      <td>Total Hari Libur/Tanggal Merah :</td>
      <td colspan="2">
        {{
          data.temp_payslip_data.owner_payslip.attendance_calculation
            .total_hari_libur || '-'
        }}
        hari
      </td>
    </tr>
    <tr v-else class="bo-1 bo-r">
      <td>Total Hari Kerja:</td>
      <td colspan="2">
        {{
          data.temp_payslip_data && data.temp_payslip_data.owner_payslip
            ? data.temp_payslip_data.owner_payslip.base.jumlah_hari_kerja
            : 0
        }}
        hari
      </td>
      <td></td>
      <td>Total Hari Libur/Tanggal Merah :</td>
      <td colspan="2">
        {{
          data.temp_payslip_data && data.temp_payslip_data.owner_payslip
            ? data.temp_payslip_data.owner_payslip.attendance_calculation
                .total_hari_libur
            : '-'
        }}
        hari
      </td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0">
      <td>Total Hari Masuk</td>
      <td colspan="2">
        {{
          data.temp_payslip_data &&
          data.temp_payslip_data.owner_payslip &&
          userRole[0] === 'owner'
            ? data.temp_payslip_data.owner_payslip.total_hari_masuk
            : 0
        }}
        hari
        {{
          data.temp_payslip_data &&
          data.temp_payslip_data.owner_payslip &&
          userRole[0] === 'owner'
            ? data.temp_payslip_data.owner_payslip.attendance_calculation
                .workDuration.currentWorkHours
            : 0
        }}
        jam
      </td>
      <td></td>
      <td>Total Hari Tidak Masuk</td>
      <td colspan="2">
        {{
          data.temp_payslip_data.owner_payslip.attendance_calculation
            .total_hari_tidak_masuk || '-'
        }}
      </td>
    </tr>
    <tr v-else>
      <td>Total Hari Masuk</td>
      <td colspan="2">
        {{
          data.temp_payslip_data && data.temp_payslip_data.owner_payslip
            ? data.temp_payslip_data.owner_payslip.total_hari_masuk
            : 0
        }}
        hari
      </td>
      <td></td>
      <td>Total Hari Tidak Masuk:</td>
      <td colspan="2">
        {{
          data.temp_payslip_data && data.temp_payslip_data.owner_payslip
            ? data.temp_payslip_data.owner_payslip.attendance_calculation
                .total_hari_tidak_masuk
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
    <tr v-if="data.payslips && data.payslips.length > 0" class="bo-l bo-r">
      <td>Gaji Pokok</td>
      <td>Rp</td>
      <td align="right">
        {{ formatPrice(data.temp_payslip_data.owner_payslip.base.gaji_pokok) }}
      </td>
      <td></td>
      <td>
        <span class="mr-2">Potongan Hari Kerja</span>
      </td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_hari_kerja,
          )
        }}
      </td>
    </tr>
    <tr v-else class="bo-l bo-r">
      <td>Gaji Pokok</td>
      <td>Rp</td>
      <td align="right">
        {{ formatPrice(data.temp_payslip_data.owner_payslip.base.gaji_pokok) }}
      </td>
      <td></td>
      <td>
        <span class="mr-2">Potongan Hari Kerja</span>
      </td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_hari_kerja,
          )
        }}
      </td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0" class="bo-l bo-r">
      <td>Tunjangan Jabatan</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.base.tunjangan_jabatan,
          )
        }}
      </td>
      <td></td>
      <td>Potongan Terlambat</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_terlambat,
          )
        }}
      </td>
    </tr>
    <tr v-else class="bo-l bo-r">
      <td>Tunjangan Jabatan</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.base.tunjangan_jabatan,
          )
        }}
      </td>
      <td></td>
      <td>Potongan Terlambat</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_terlambat,
          )
        }}
      </td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0" class="bo-l bo-r">
      <td>Insentif</td>
      <td>Rp</td>
      <td align="right">
        {{ formatPrice(data.temp_payslip_data.owner_payslip.base.insentif) }}
      </td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_astek,
          )
        }}
      </td>
    </tr>
    <tr v-else class="bo-l bo-r">
      <td>Insentif</td>
      <td>Rp</td>
      <td align="right">
        {{ formatPrice(data.temp_payslip_data.owner_payslip.base.insentif) }}
      </td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_astek,
          )
        }}
      </td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0" class="bo-l bo-r">
      <td>Total Buku 1</td>
      <td>Rp</td>
      <td>
        {{ formatPrice(data.temp_payslip_data.owner_payslip.total_buku_1) }}
      </td>
      <td></td>
      <td>Total Potongan 1</td>
      <td>Rp</td>
      <td>
        {{ formatPrice(data.temp_payslip_data.owner_payslip.total_potongan_1) }}
      </td>
    </tr>
    <tr v-else class="bo-l bo-r">
      <td>Total Buku 1</td>
      <td>Rp</td>
      <td>
        {{ formatPrice(data.temp_payslip_data.owner_payslip.total_buku_1) }}
      </td>
      <td></td>
      <td>Total Potongan 1</td>
      <td>Rp</td>
      <td>
        {{ formatPrice(data.temp_payslip_data.owner_payslip.total_potongan_1) }}
      </td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0">
      <td>Insentif Khusus</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.owner_rewards
              .insentif_khusus || 0,
          )
        }}
      </td>
      <td></td>
      <td>Potongan Bon</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_bon,
          )
        }}
      </td>
    </tr>
    <tr v-else>
      <td>Insentif Khusus</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.owner_rewards.insentif_khusus,
          )
        }}
      </td>
      <td></td>
      <td>Potongan Bon</td>
      <td>Rp</td>
      <td align="right">
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.deductions.potongan_bon,
          )
        }}
      </td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0">
      <td>Tambahan</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.owner_rewards.tambahan,
          )
        }}
      </td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan Khusus</td>
      <td>Rp</td>
      <td align="right">
        {{ formatPrice(data.temp_payslip_data.owner_payslip.owner_deductions) }}
      </td>
    </tr>
    <tr v-else>
      <td>Tambahan</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.owner_rewards.tambahan,
          )
        }}
      </td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan Khusus</td>
      <td>Rp</td>
      <td align="right">
        {{ formatPrice(data.temp_payslip_data.owner_payslip.owner_deductions) }}
      </td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0">
      <td>Lembur</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(data.temp_payslip_data.owner_payslip.owner_rewards.lembur)
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr v-else>
      <td>Lembur</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(data.temp_payslip_data.owner_payslip.owner_rewards.lembur)
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr v-if="data.payslips && data.payslips.length > 0">
      <td>Bonus Khusus</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.owner_rewards.bonus_khusus,
          )
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr v-else>
      <td>Bonus Khusus</td>
      <td>Rp</td>
      <td>
        {{
          formatPrice(
            data.temp_payslip_data.owner_payslip.owner_rewards.bonus_khusus,
          )
        }}
      </td>
      <td colspan="4"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td>
        <strong>Total Buku 2</strong>
      </td>
      <td>
        <strong>Rp</strong>
      </td>
      <td align="right">
        <strong v-if="data.payslips && data.payslips.length > 0">
          {{ formatPrice(data.temp_payslip_data.owner_payslip.total_buku_2) }}
        </strong>
        <strong v-else>
          {{ formatPrice(data.temp_payslip_data.owner_payslip.total_buku_2) }}
        </strong>
      </td>
      <td></td>
      <td>
        <strong>Total Potongan 2</strong>
      </td>
      <td>
        <strong>Rp</strong>
      </td>
      <td align="right">
        <strong v-if="data.payslips && data.payslips.length > 0">
          {{
            formatPrice(data.temp_payslip_data.owner_payslip.total_potongan_2)
          }}
        </strong>
        <strong v-else>
          {{
            formatPrice(data.temp_payslip_data.owner_payslip.total_potongan_2)
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
          Total bersih buku 1 Rp{{
            formatPrice(
              data.temp_payslip_data.owner_payslip.total_buku_1 -
                data.temp_payslip_data.owner_payslip.total_potongan_1,
            )
          }}
        </strong>
        <strong>
          Total bersih buku 2 Rp{{
            formatPrice(
              data.temp_payslip_data.owner_payslip.total_buku_2 -
                data.temp_payslip_data.owner_payslip.total_potongan_2,
            )
          }}
        </strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
        <strong v-if="data.payslips && data.payslips.length > 0">
          PENDAPATAN GAJI = Rp{{
            formatPrice(data.temp_payslip_data.owner_payslip.pendapatan_gaji)
          }}
        </strong>
        <strong v-else>
          PENDAPATAN GAJI = Rp{{
            formatPrice(data.temp_payslip_data.owner_payslip.pendapatan_gaji)
          }}
        </strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
        <strong v-if="data.payslips && data.payslips.length > 0">{{
          data.temp_payslip_data.owner_payslip.pendapatan_gaji_nominal
        }}</strong>
        <strong v-else>{{
          data.temp_payslip_data.owner_payslip.pendapatan_gaji_nominal
        }}</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td
        v-if="data.payslips && data.payslips.length > 0"
        colspan="7"
        align="center"
      >
        SISA SIMPANAN = Rp{{
          formatPrice(data.temp_payslip_data.owner_payslip.sisa_pinjaman)
        }}
      </td>
      <td v-else colspan="7" align="center">
        SISA SIMPANAN = Rp{{
          formatPrice(data.temp_payslip_data.owner_payslip.sisa_pinjaman)
        }}
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td colspan="7" align="center">
        ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      </td>
    </tr>
  </tbody>
</template>

<script src="./officeOwner.ts"></script>

<style>
.table-payslip-print td {
  font-family: 'Courier New', Courier, monospace !important;
}
.table-payslip-print span {
  font-family: 'Courier New', Courier, monospace !important;
}
</style>
