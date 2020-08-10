import {
  formatDate,
  formatPrice,
  formatPricePayslip,
  openSnackbarNow,
} from '@/common/utils/config';
import { imageBase64 } from '@/common/utils/logo';
import OfficeMonthly from '@/components/print-template/OfficeMonthly.vue';
import ProduksiWeekly from '@/components/print-template/ProduksiWeekly.vue';
import TokoMonthly from '@/components/print-template/TokoMonthly.vue';
import TokoWeekly from '@/components/print-template/TokoWeekly.vue';
import { AuthModule } from '@/store/modules/auth';
import { DepartmentStore } from '@/store/modules/department';
import { OutcomeStore } from '@/store/modules/outcome';
import { PayslipStore } from '@/store/modules/payslip';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import OfficeOwner from '../../../components/print-template/OfficeOwner.vue';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'PrintPayslip',
  components: {
    TokoWeekly,
    TokoMonthly,
    ProduksiWeekly,
    OfficeMonthly,
    OfficeOwner,
  },
})
export default class PrintPayslip extends Vue {
  params: any = {
    filters: [
      {
        field: 'branch',
        value: 'join',
      },
    ],
  };
  printLoading: boolean = false;
  statusPrint: string = 'not-done';

  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.listPayslip.length > 0) {
      const answer = window.confirm(
        'Apakah anda ingin keluar dari halaman ini? Pastikan anda telah mencetak payslip.',
      );
      if (answer) {
        // this.removePayslipTemp();
        next();
      } else {
        next(false);
      }
    } else {
      PayslipStore.resetListPayslip();
      next();
    }
  }

  get userRole(): any {
    return AuthModule.roles;
  }

  get userId(): string {
    return AuthModule.id;
  }

  get periodePayslip() {
    if (this.$route.params.payslipFilter === '1') {
      return `${this.convertPeriodDate(
        this.$route.params.dateStart,
      )} - ${this.convertPeriodDate(this.$route.params.dateEnd)}`;
    } else if (this.$route.params.payslipFilter === '2') {
      return `${this.getMonthOnly(this.$route.params.dateStart)}`;
    }
  }

  get loadingPayslip() {
    return PayslipStore.loadingPayslip;
  }

  get listPayslip() {
    console.info('jajaj', PayslipStore.listPayslip);
    if (this.userRole[0] === 'owner') {
      return PayslipStore.listPayslip.filter((el: any) => {
        return (
          (el.temp_payslip_data.owner_payslip ||
            el.temp_payslip_data.payslip_meta.owner_payslip) &&
          el.payslips.length > 0
        );
      });
    } else {
      return PayslipStore.listPayslip;
    }
  }

  get listPayslipPreview() {
    if (this.userRole[0] === 'owner') {
      return PayslipStore.listPayslip.filter((el: any) => {
        return el.temp_payslip_data.owner_payslip && el.payslips.length > 0;
      });
    } else {
      return PayslipStore.listPayslip;
    }
  }

  get department() {
    return DepartmentStore.department;
  }

  get isPayslipGenerated() {
    return PayslipStore.isPayslipGenerated;
  }

  get totalEmployeeSalaryOfCurrentPeriod() {
    if (this.listPayslip.length > 0) {
      let totalSalary = 0;
      this.listPayslip.forEach((el: any) => {
        if (
          el.temp_payslip_data.payslip_meta.pendapatan_gaji &&
          el.payslips.length === 0
        ) {
          totalSalary += el.temp_payslip_data.payslip_meta.pendapatan_gaji;
        }
      });
      return totalSalary;
    } else {
      return 0;
    }
  }

  get totalEmployeeSalaryOfCurrentPeriodByOwner() {
    console.info('list', this.listPayslip);
    if (this.listPayslip.length > 0) {
      let totalSalary = 0;
      let nominal = 0;
      this.listPayslip.forEach((el: any) => {
        if (el.temp_payslip_data.owner_payslip && el.payslips.length > 0) {
          nominal =
            el.temp_payslip_data.owner_payslip.total_buku_2 -
            el.temp_payslip_data.owner_payslip.total_potongan_2;
          totalSalary += nominal;
        }
      });
      return totalSalary;
    } else {
      return 0;
    }
  }

  @Watch('isPayslipGenerated')
  async printPayslipAsFile() {
    if (this.isPayslipGenerated) {
      let typePayslip: any = '';
      const periodePayslip: any = this.periodePayslip;
      let durationPayslip: any = '';
      let typeTable: any = '';

      if (this.$route.params.payslipType === '1') {
        typePayslip = 'Produksi';
        typeTable = 'table-payslip-produksi';
      } else if (
        this.$route.params.payslipType === '2' &&
        this.$route.params.payslipFilter === '1'
      ) {
        typePayslip = 'Toko';
        durationPayslip = 'Mingguan';
        typeTable = 'table-payslip-toko-weekly';
      } else if (
        this.$route.params.payslipType === '2' &&
        this.$route.params.payslipFilter === '2'
      ) {
        typePayslip = 'Toko';
        durationPayslip = 'Bulanan';
        typeTable = 'table-payslip-toko-monthly';
      } else if (this.$route.params.payslipType === '3') {
        typePayslip = 'Kantor';
        typeTable = 'table-payslip-office';
      }
      if (
        this.userRole[0] === 'owner' &&
        this.$route.params.payslipType === '3' &&
        this.$route.params.payslipFilter === '2'
      ) {
        typeTable = 'table-payslip-office-owner';
      }
      const options = {
        tableWidth: 'auto',
        margin: {
          top:
            typeTable === 'table-payslip-toko-monthly'
            ? 15
            : typeTable === 'table-payslip-office-owner'
              ? 10
            :typeTable === 'table-payslip-toko-weekly'
              ? 12
            : 8,
          bottom:
            typeTable === 'table-payslip-toko-weekly'
              ? 22
              : typeTable === 'table-payslip-toko-monthly'
              ? 33
              : typeTable === 'table-payslip-produksi'
              ? 18
              : typeTable === 'table-payslip-office'
              ? 53
              : typeTable === 'table-payslip-office-owner'
              ? 20
              : 5,
          left: 8,
          right: 8,
        },
        theme: 'plain',
        styles: {
          fontSize: 8,
          overflow: 'linebreak',
          lineWidth: 0.01,
          lineColor: '#FFF',
          cellPadding: 0.4,
          minCellHeight: 1,
          minHeight: 3,
          width: 'auto',
        },
        tableLineColor: [255, 255, 255],
        head: false,
        // headStyles: {
        //   minCellHeight: 2,
        //   fontStyle: 'normal',
        //   halign: 'center',
        //   text: { minCellWidth: 'wrap' },
        //   // lineWidth: 0.02,
        //   fillColor: '#000000',
        //   // lineColor: [217, 216, 216],
        // },
        // drawHeaderRow() {
        //   return false;
        // },
        didDrawPage(HookData: any) {
          // if (imageBase64) {
          //   doc.addImage(
          //     imageBase64,
          //     'JPEG',
          //     HookData.settings.margin.left +
          //       (typeTable === 'table-payslip-toko-weekly'
          //         ? 6
          //         : typeTable === 'table-payslip-toko-monthly'
          //         ? 6
          //         : typeTable === 'table-payslip-office'
          //         ? 9
          //         : typeTable === 'table-payslip-office-owner'
          //         ? 9
          //         : 6), // xaxis
          //     typeTable === 'table-payslip-toko-weekly'
          //       ? 16
          //       : typeTable === 'table-payslip-toko-monthly'
          //       ? 16
          //       : typeTable === 'table-payslip-produksi'
          //       ? 10
          //       : typeTable === 'table-payslip-office'
          //       ? 16
          //       : typeTable === 'table-payslip-office-owner'
          //       ? 16
          //       : 6, // top
          //     30, // width
          //     10, // height
          //   );
          // }
          // HookData.doc.setFontSize(8);
          // HookData.doc.setTextColor(40);
          // HookData.doc.setFontStyle('normal');
          // HookData.doc.text(
          //   `Payslip ${typePayslip} ${
          //     durationPayslip !== '' ? ' - ' + durationPayslip : ''
          //   }`,
          //   HookData.settings.margin.left,
          //   10,
          // );
        },
        didParseCell(HookData: any, data: any) {
          // styling font to courier
          HookData.cell.styles.font = 'courier';

          if (HookData.cell === undefined) {
            return;
          }
          if (HookData.section === 'head') {
            HookData.cell.styles.fillColor = '#ffffff';
          }
          if (HookData.row.index === 0) {
            HookData.cell.styles.minCellHeight = 0;
            HookData.cell.styles.cellPadding = 0;
            HookData.cell.styles.fontSize = 0;
          }
          if (typeTable === 'table-payslip-toko-weekly') {
            // styling set max width for cells 5
            if (HookData.row.index === 0) {
              HookData.row.cells[5].styles.cellWidth = 10;
            }
            // styling title payslip and title pendapatan, potongan gaji
            if (
              HookData.row.index === 1 ||
              HookData.row.index === 9 ||
              HookData.row.index === 2
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontStyle = 'bold';
            }
            // styling total pendapatan and nominal terbilang
            if (
              HookData.row.index === 22 ||
              HookData.row.index === 23 ||
              HookData.row.index === 24
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontSize = 10;
            }
            // styling payslip component like gaji pokok etc, and potongan
            if (HookData.row.index >= 11 && HookData.row.index <= 20) {
              HookData.row.cells[2].styles.halign = 'right';
              if (HookData.row.cells[6]) {
                HookData.row.cells[6].styles.halign = 'right';
              }
            }
          } else if (typeTable === 'table-payslip-toko-monthly') {
            // styling set max width for cells 5
            if (HookData.row.index === 0) {
              HookData.row.cells[5].styles.cellWidth = 10;
            }
            // styling title payslip and title pendapatan, potongan gaji
            if (
              HookData.row.index === 1 ||
              HookData.row.index === 9 ||
              HookData.row.index === 2
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontStyle = 'bold';
            }
            // styling total pendapatan and nominal terbilang
            if (
              HookData.row.index === 19 ||
              HookData.row.index === 20 ||
              HookData.row.index === 21
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontSize = 10;
            }
            // styling payslip component like gaji pokok etc, and potongan
            if (HookData.row.index >= 11 && HookData.row.index <= 17) {
              HookData.row.cells[2].styles.halign = 'right';
              if (HookData.row.cells[6]) {
                HookData.row.cells[6].styles.halign = 'right';
              }
            }
          } else if (typeTable === 'table-payslip-produksi') {
            // styling set max width for cells 5
            if (HookData.row.index === 0) {
              HookData.row.cells[5].styles.cellWidth = 10;
            }
            // styling title payslip and title pendapatan, potongan gaji
            if (
              HookData.row.index === 1 ||
              HookData.row.index === 10 ||
              HookData.row.index === 2
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontStyle = 'bold';
            }
            // styling total pendapatan and nominal terbilang
            if (
              HookData.row.index === 24 ||
              HookData.row.index === 25 ||
              HookData.row.index === 26
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontSize = 10;
            }
            // styling payslip component like gaji pokok etc, and potongan
            if (HookData.row.index >= 12 && HookData.row.index <= 22) {
              HookData.row.cells[2].styles.halign = 'right';
              if (HookData.row.cells[6]) {
                HookData.row.cells[6].styles.halign = 'right';
              }
            }
          } else if (typeTable === 'table-payslip-office') {
            // styling set max width for cells 5
            if (HookData.row.index === 0) {
              HookData.row.cells[5].styles.cellWidth = 10;
            }
            // styling pendapatan gaji
            if (HookData.row.index === 16) {
              HookData.cell.styles.fontStyle = 'bold';
            }
            // styling title payslip and title pendapatan, potongan gaji
            if (
              HookData.row.index === 1 ||
              HookData.row.index === 9 ||
              HookData.row.index === 2
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontStyle = 'bold';
            }
            // styling total pendapatan and nominal terbilang
            if (HookData.row.index === 17 || HookData.row.index === 18) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontSize = 10;
            }
            // styling payslip component like gaji pokok etc, and potongan
            if (HookData.row.index >= 11 && HookData.row.index <= 15) {
              HookData.row.cells[2].styles.halign = 'right';
              if (HookData.row.cells[6]) {
                HookData.row.cells[6].styles.halign = 'right';
              }
            }
          } else if (typeTable === 'table-payslip-office-owner') {
            // styling set max width for cells 5
            if (HookData.row.index === 0) {
              HookData.row.cells[5].styles.cellWidth = 10;
            }
            // styling title payslip and title pendapatan, potongan gaji
            if (
              HookData.row.index === 1 ||
              HookData.row.index === 9 ||
              HookData.row.index === 2
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontStyle = 'bold';
            }
            // styling total pendapatan and nominal terbilang
            if (
              HookData.row.index === 22 ||
              HookData.row.index === 23 ||
              HookData.row.index === 24 ||
              HookData.row.index === 25
            ) {
              HookData.cell.styles.halign = 'center';
              HookData.cell.styles.fontSize = 10;
            }
            // styling payslip component like gaji pokok etc, and potongan
            if (HookData.row.index >= 11 && HookData.row.index <= 20) {
              HookData.row.cells[2].styles.halign = 'right';
              if (HookData.row.cells[6]) {
                HookData.row.cells[6].styles.halign = 'right';
              }
            }
          }
        },
      };
      const doc = new jsPDF('l', 'mm', 'a5');
      for (const i in this.listPayslipPreview) {
        if (this.listPayslipPreview.hasOwnProperty(i)) {
          const res: any = await doc.autoTableHtmlToJson(
            document.getElementById(`${typeTable}${i}`),
          );
          await doc.autoTable(res.columns, res.data, options);
        }
      }
      const now: string = new Date().toISOString().substr(0, 10);
      let payslip_type = this.filterPayslip(
        this.$route.params.payslipType,
        this.$route.params.payslipFilter,
      );
      if (
        this.userRole[0] === 'owner' &&
        this.$route.params.payslipType === '3' &&
        this.$route.params.payslipFilter === '2'
      ) {
        payslip_type = 'owner';
      }
      await doc.save(`${now}_${payslip_type}.pdf`);
      PayslipStore.setIsPayslipGenerate(false);
    }
  }

  mounted() {
    this.statusPrint = 'not-done';
    this.getDepartmentName();
    // this.convertBase64();
  }

  convertFormatPrice(value: number) {
    return formatPrice(value);
  }

  convertBase64() {
    // const reader = new FileReader();
    // reader.onload = (event: any) => {
    //   const res = event;
    //   // this.imageBase64 = reader.result;
    // };
    // reader.readAsDataURL('/src/assets/logo_mja.jpeg');
    // this.imageBase64 = btoa('/src/assets/logo_mja.jpeg');
  }

  getDepartmentName() {
    const departmentId: any = this.$route.params.departmentId;
    const params: any = this.params;
    DepartmentStore.getOneDepartment({ departmentId, params });
  }

  removePayslipTemp() {
    PayslipStore.removePayslipTemp();
  }

  getMonthOnly(date: any) {
    return moment(date)
      .locale('id')
      .format('MMMM YYYY');
  }

  cancelPrint() {
    this.$router.back();
  }

  finishPrint() {
    PayslipStore.removePayslipTemp();
    this.$router.push({ name: 'report-payslip-outcome' });
  }

  convertPeriodDate(date: string) {
    return formatDate(date, 'long');
  }

  async printPayslip() {
    this.printLoading = true;

    let dataBulk = await this.listPayslip.filter((item: any) => {
      if (
        this.userRole &&
        this.userRole[0] === 'owner' &&
        item.payslips.length > 0 &&
        this.$route.params.payslipFilter === '2' &&
        this.$route.params.payslipType === '3'
      ) {
        return item.payslips[0].payslip_meta.owner_payslip === undefined;
      } else {
        return !item.payslips || (item.payslips && item.payslips.length === 0);
      }
    });

    const employeesOutcome: any = [];

    if (dataBulk.length > 0) {
      dataBulk = await dataBulk.map((el: any) => {
        delete el.temp_payslip_data.attendances;
        delete el.temp_payslip_data.area;
        delete el.temp_payslip_data.department;
        delete el.temp_payslip_data.group;
        delete el.temp_payslip_data.position;
        let tambahan_owner: number = 0;
        if (this.userRole[0] === 'owner') {
          tambahan_owner +=
            el.temp_payslip_data.owner_payslip.total_buku_2 -
            el.temp_payslip_data.owner_payslip.total_potongan_2;
        }
        employeesOutcome.push({
          name: el.name,
          nik: el.nik,
          department: el.department.name,
          group: el.group.name,
          position: el.position.name,
          area: el.area.name,
          pendapatan_gaji: el.temp_payslip_data.payslip_meta.pendapatan_gaji,
          total_pendapatan: el.temp_payslip_data.payslip_meta.total_pendapatan,
          total_potongan: el.temp_payslip_data.payslip_meta.total_potongan,
          pendapatan_buku_2:
            this.userRole[0] === 'owner'
              ? el.temp_payslip_data.owner_payslip.total_buku_2
              : 0,
          potongan_buku_2:
            this.userRole[0] === 'owner'
              ? el.temp_payslip_data.owner_payslip.total_potongan_2
              : 0,
          tambahan_owner,
        });
        console.info('outcomePush', employeesOutcome);
        return {
          ...el.temp_payslip_data,
          id:
            this.userRole &&
            this.userRole[0] === 'owner' &&
            el.payslips.length > 0
              ? el.payslips[0].id
              : null,
          base_salary: String(el.temp_payslip_data.base_salary),
          total_day: String(el.temp_payslip_data.total_day),
          daily_base_salary: String(el.temp_payslip_data.daily_base_salary),
          total_base_daily: String(el.temp_payslip_data.total_base_daily),
          total_base: String(el.temp_payslip_data.total_base),
          total_reward: String(el.temp_payslip_data.total_reward),
          total_deduction: String(el.temp_payslip_data.total_deduction),
          total: String(el.temp_payslip_data.total),
          created_by_id: this.userId,
        };
      });
      await PayslipStore.generatePayslip({ bulk: dataBulk });
      // PayslipStore.setIsPayslipGenerate(true);

      const nominalPerPeriod: number =
        this.userRole[0] === 'owner'
          ? this.totalEmployeeSalaryOfCurrentPeriodByOwner
          : this.totalEmployeeSalaryOfCurrentPeriod;

      const dataOutcome: any = {
        employee_payslip: employeesOutcome,
        department_id: this.department.id,
        start_at: new Date(this.$route.params.dateStart).toISOString(),
        end_at: this.$route.params.dateEnd,
        created_by_id: this.userId,
        nominal_per_period: nominalPerPeriod,
      };

      await OutcomeStore.generateOutcomePayslip(dataOutcome);
    } else {
      PayslipStore.setIsPayslipGenerate(true);
    }
    this.printLoading = false;
    this.statusPrint = 'done';
  }

  filterPayslip(a: any, b: any) {
    if (a === '1' && b === '1') {
      return 'produksi';
    } else if (a === '3' && b === '2') {
      return 'office';
    } else if (a === '2' && b === '1') {
      return 'toko_mingguan';
    } else if (a === '2' && b === '2') {
      return 'toko_bulanan';
    } else if (
      a === '3' &&
      b === '2' &&
      this.userRole &&
      this.userRole[0] === 'owner'
    ) {
      return 'office-owner';
    }
  }

  pushBulk() {
    const dataBulk: any = this.listPayslip.map((el: any) => {
      delete el.temp_payslip_data.attendances;
      delete el.temp_payslip_data.area;
      delete el.temp_payslip_data.department;
      delete el.temp_payslip_data.group;
      delete el.temp_payslip_data.position;
      return {
        ...el.temp_payslip_data,
        attendances: el.attendances,
        base_salary: String(el.temp_payslip_data.base_salary),
        total_day: String(el.temp_payslip_data.total_day),
        daily_base_salary: String(el.temp_payslip_data.daily_base_salary),
        total_base_daily: String(el.temp_payslip_data.total_base_daily),
        total_base: String(el.temp_payslip_data.total_base),
        total_reward: String(el.temp_payslip_data.total_reward),
        total_deduction: String(el.temp_payslip_data.total_deduction),
        total: String(el.temp_payslip_data.total),
        created_by_id: this.userId,
      };
    });
    PayslipStore.generatePayslip({ bulk: dataBulk });
  }
}
