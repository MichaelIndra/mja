import { IBranch, InitBranch } from '@/common/interfaces/branch';
import { InitQuery, IQuery } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { openSnackbarNow } from '@/common/utils/config';
import { BranchStore } from '@/store/modules/branch';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import {
  maxLength,
  minLength,
  numeric,
  required,
} from 'vuelidate/lib/validators';

@Component({
  mixins: [validationMixin],
  name: 'Branch',
})
export default class Branch extends Vue {
  // VALIDATION
  @Validations()
  validations = {
    branch: {
      name: { required },
      address: { required },
      telp: { required },
      postal_code: {
        required,
        maxLength: maxLength(5),
        numeric,
        minLength: minLength(5),
      },
    },
  };

  snackbar: ISnackbar = InitSnackbar;
  branch: any = InitBranch;
  baseBranch: any = InitBranch;
  valid: boolean = true;
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  options: any = {};
  params: IQuery = {
    ...InitQuery,
  };
  keyword: string = '';
  headers: any[] = [
    {
      text: 'Nama Cabang',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    { text: 'Alamat', value: 'address' },
    { text: 'Nomor Telepon', value: 'telp' },
    { text: 'Kode Pos', value: 'postal_code' },
    { text: 'Ditambahkan pada', value: 'created_at' },
    { text: 'Aksi', align: 'center', value: 'actions', sortable: false },
  ];

  // GETTERS
  get pagination(): any {
    return BranchStore.pagination;
  }

  get isLoading(): boolean {
    return BranchStore.isLoadingBranch;
  }

  get dataBranch(): IBranch {
    const result = {
      ...BranchStore.branch,
      errors: {
        name: false,
        address: false,
        postal_code: false,
        telp: false,
      },
    };
    return result;
  }

  get listBranch(): IBranch[] {
    return BranchStore.listBranch;
  }

  // WATCH
  @Watch('options')
  listenOptionsChanges() {
    this.getListBranch();
  }

  // WATCH
  @Watch('keyword')
  searchTitleArea() {
    if (this.keyword === '') {
      this.getListBranch();
    }
  }

  // METHODS
  mounted() {
    this.getListBranch();
  }

  getListBranch() {
    if (this.keyword === '') {
      BranchStore.getAllBranch({});
    } else {
      BranchStore.searchBranch(this.keyword);
    }
  }

  closeForm() {
    this.$v.$reset();
    BranchStore.setInitDataBranch();
    this.branch = {
      ...this.baseBranch,
    };
    delete this.branch.id;
    this.$store.commit('SET_LOADING_BRANCH', false);
    this.dialogForm = false;
  }

  showForm(id: string | null = null) {
    if (id) {
      BranchStore.getOneBranchFromList(id);
    } else {
      BranchStore.setInitDataBranch();
    }
    this.branch = {
      ...this.dataBranch,
    };
    this.dialogForm = true;
  }

  showConfirmDelete(id: string) {
    BranchStore.getOneBranchFromList(id);
    this.branch = {
      ...this.dataBranch,
    };
    this.dialogDelete = true;
  }

  deleteData() {
    if (this.branch.id) {
      BranchStore.deleteBranch(this.branch.id);
    }
    this.dialogDelete = false;
  }

  async save() {
    if (
      this.branch.name === '' ||
      this.branch.address === '' ||
      this.branch.telp === '' ||
      this.branch.postal_code === ''
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
      this.branch = {
        ...this.branch,
        errors: {
          name: this.branch.name === '' ? true : false,
          address: this.branch.address === '' ? true : false,
          postal_code: this.branch.postal_code === '' ? true : false,
          telp: this.branch.telp === '' ? true : false,
        },
      };
    } else {
      await BranchStore.saveBranch(this.branch);
      BranchStore.setInitDataBranch();
      this.$v.$reset();
      this.branch = {
        ...this.dataBranch,
      };
      this.dialogForm = false;
      this.getListBranch();
    }
  }
}
