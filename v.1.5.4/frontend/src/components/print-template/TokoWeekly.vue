<template>
  <tbody>
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
      <td rowspan="5" colspan="2"></td>
     <td colspan="3">Cabang Pusat</td>
     <td colspan="2">Tanggal Cetak</td>
    </tr>
    <tr>
      <td colspan="5">
       <strong>CV. Makmur Jaya Abadi</strong>
       <div>Jl. Jend. Sudirman No.168 A, Kudus</div>
      </td>
      <td colspan="2">{{ formatDate(dateNow, 'long') }}</td>
    </tr>-->
    <tr class="bo-l bo-r bo-t">
      <td colspan="7" align="center">
        <strong>SLIP GAJI KARYAWAN</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-b">
      <td
        colspan="7"
        align="center"
      >Periode {{ convertPeriodDate($route.params.dateStart) }} - {{ convertPeriodDate($route.params.dateEnd) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td
        colspan="7"
        align="center"
      >——————————————————————————————————————————————————————————————————————————————————————————————————————————————————</td>
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
      <td
        colspan="2"
      >{{ data.area ? data.area.name : '-' }} / {{ data.position ? data.position.name : '-' }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Total Hari Kerja</td>
      <td
        colspan="2"
      >{{ data.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_kerja }} hari</td>
      <td></td>
      <td>Total Hari Libur/Tanggal Merah</td>
      <td
        colspan="2"
      >{{ data.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_libur }} hari</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Total Hari Masuk</td>
      <td
        colspan="2"
      >{{ data.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_masuk }} hari</td>
      <td></td>
      <td>Total Hari Tidak Masuk</td>
      <td
        colspan="2"
      >{{ data.temp_payslip_data.payslip_meta.attendance_calculation.total_hari_tidak_masuk }} hari</td>
    </tr>
    <tr class="bo-l bo-r">
      <td
        colspan="7"
        align="center"
      >——————————————————————————————————————————————————————————————————————————————————————————————————————————————————</td>
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
      <td
        colspan="7"
        align="center"
      >——————————————————————————————————————————————————————————————————————————————————————————————————————————————————</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Gaji Pokok</td>
      <td>Rp</td>
      <td align="right">{{ formatPrice(data.temp_payslip_data.payslip_meta.base.gaji_pokok) }}</td>
      <td></td>
      <td>
        Potongan Hari Kerja
        <!--        ({{data.temp_payslip_data.payslip_meta.attendance_calculation.durasi_izin}}-->
        <!--        {{data.temp_payslip_data.payslip_meta.attendance_calculation.satuan_izin==='hours' ? 'jam' : 'menit'}})-->
      </td>
      <td>Rp</td>
      <td
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.deductions.potongan_hari_kerja) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Lama Kerja</td>
      <td>Rp</td>
      <td align="right">{{ formatPrice(data.temp_payslip_data.payslip_meta.base.lama_kerja) }}</td>
      <td></td>
      <td>
        Potongan Terlambat
        <!--        ({{data.temp_payslip_data.payslip_meta.attendance_calculation.durasi_terlambat}})-->
      </td>
      <td>Rp</td>
      <td
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.deductions.potongan_terlambat) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Lembur Extra</td>
      <td class="bi-b" style="border-bottom: 1px solid #000;">Rp</td>
      <td
        class="bi-b"
        style="border-bottom: 1px solid #000;"
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.base.lembur_extra) }}</td>
      <td></td>
      <td>Pot.BPJS TK & Kesehatan</td>
      <td>Rp</td>
      <td
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.deductions.potongan_astek) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>
        <strong>Upah 1 hari</strong>
      </td>
      <td>
        <strong>Rp</strong>
      </td>
      <td align="right">
        <strong>{{ formatPrice(data.temp_payslip_data.payslip_meta.base.upah_1_hari) }}</strong>
      </td>
      <td></td>
      <td>Potongan SPSI</td>
      <td>Rp</td>
      <td
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.deductions.potongan_spsi) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Upah 1 minggu ({{ data.temp_payslip_data.payslip_meta.base.hari_masuk }} hari masuk)</td>
      <td>Rp</td>
      <td align="right">{{ formatPrice(data.temp_payslip_data.payslip_meta.rewards.upah_1_minggu) }}</td>
      <td></td>
      <td>Potongan Bon</td>
      <td>Rp</td>
      <td
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.deductions.potongan_bon) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Extra Full</td>
      <td>Rp</td>
      <td align="right">{{ formatPrice(data.temp_payslip_data.payslip_meta.rewards.extra_full) }}</td>
      <td colspan="4"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Hari ke-7</td>
      <td>Rp</td>
      <td align="right">{{ formatPrice(data.temp_payslip_data.payslip_meta.rewards.hari_ke_7) }}</td>
      <td colspan="4"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Tambahan hari minggu</td>
      <td>Rp</td>
      <td
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.rewards.tambahan_hari_minggu) }}</td>
      <td colspan="4"></td>
    </tr>
    <tr class="bo-l bo-r">
      <td>Premi hari besar</td>
      <td class="bi-b" style="border-bottom: 1px solid #000;">Rp</td>
      <td
        class="bi-b"
        style="border-bottom: 1px solid #000;"
        align="right"
      >{{ formatPrice(data.temp_payslip_data.payslip_meta.rewards.premi_hari_besar) }}</td>
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
        <strong>{{ formatPrice(data.temp_payslip_data.payslip_meta.total_pendapatan) }}</strong>
      </td>
      <td></td>
      <td>
        <strong>Total Potongan</strong>
      </td>
      <td>
        <strong>Rp</strong>
      </td>
      <td align="right">
        <strong>{{ formatPrice(data.temp_payslip_data.payslip_meta.total_potongan) }}</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r">
      <td
        colspan="7"
        align="center"
      >——————————————————————————————————————————————————————————————————————————————————————————————————————————————————</td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
        <strong>PENDAPATAN GAJI = Rp{{ formatPrice(data.temp_payslip_data.payslip_meta.pendapatan_gaji) }}</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td colspan="7" align="center" style="background: rgb(225, 225, 225);">
        <strong>{{ data.temp_payslip_data.payslip_meta.pendapatan_gaji_nominal }}</strong>
      </td>
    </tr>
    <tr class="bo-l bo-r bo-t bo-b">
      <td
        colspan="7"
        align="center"
      >SISA SIMPANAN = Rp{{ formatPrice(data.temp_payslip_data.payslip_meta.sisa_pinjaman) }}</td>
    </tr>
    <tr class="bo-l bo-r">
      <td
        colspan="7"
        align="center"
      >——————————————————————————————————————————————————————————————————————————————————————————————————————————————————</td>
    </tr>
    <!-- <tr class="bo-l bo-r">
      <td colspan="5"></td>
      <td colspan="2">Kudus, {{ formatDate(dateNow, 'long') }}</td>
    </tr>-->
    <!--<tr class="bo-l bo-r">
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

<script src="./tokoWeekly.ts"></script>