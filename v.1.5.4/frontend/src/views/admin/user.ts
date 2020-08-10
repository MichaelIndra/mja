import { InitQuery, IQuery } from '@/common/interfaces/query';
import { InitSnackbar } from '@/common/interfaces/snackbar';
import { InitUser, IUser } from '@/common/interfaces/user';
import { openSnackbarNow } from '@/common/utils/config';
import { BranchStore } from '@/store/modules/branch';
import { RoleStore } from '@/store/modules/role';
import { UserModule } from '@/store/modules/user';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import { email, required } from 'vuelidate/lib/validators';
import { ISnackbar } from '../../common/interfaces/snackbar';

@Component({
  mixins: [validationMixin],
  name: 'User',
})
export default class User extends Vue {
  // VALIDATION
  @Validations()
  validations = {
    user: {
      first_name: { required },
      last_name: { required },
      email: { required, email },
      username: { required },
      role: { required },
      branch_id: { required },
    },
  };

  // DATA
  user: any = InitUser;
  snackbar: ISnackbar = InitSnackbar;
  valid: boolean = true;
  something: string = '';
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  options: any = {};
  keyword: string = '';
  params: IQuery = {
    ...InitQuery,
  };
  headers: any[] = [
    {
      text: 'Nama',
      align: 'left',
      sortable: false,
      value: 'full_name',
    },
    { text: 'Username', value: 'username' },
    { text: 'Email', value: 'email' },
    { text: 'Role', value: 'role_text' },
    // { text: 'Role', value: 'roles' },
    { text: 'Ditambahkan pada', value: 'created_at' },
    { text: 'Aksi', value: 'actions', sortable: false },
  ];

  get listBranch() {
    return BranchStore.listBranch;
  }

  // WATCH
  @Watch('options')
  listenOptionsChanges() {
    this.getListUser({});
  }

  @Watch('keyword')
  searchTitle() {
    if (this.keyword === '') {
      this.getListUser({});
    }
  }

  // METHODS
  mounted() {
    this.getListUser({});
    this.getRoles();
    this.getListBranch();
  }
  getListBranch() {
    BranchStore.getAllBranch({});
  }
  closeForm() {
    this.user = {
      ...this.user,
      ...InitUser,
    };
    this.dialogForm = false;
    this.$store.commit('SET_LOADING_USER', false);
    this.$v.$reset();
  }

  searchKeyword() {
    if (this.keyword !== '') {
      const params: any = {
        ...this.params,
        filters: [
          {
            field: 'first_name',
            operator: 'cont',
            value: this.keyword,
          },
        ],
      };
      this.getListUser(params);
    } else {
      this.getListUser({});
    }
  }

  getListUser(params: any) {
    UserModule.getAllUser(params);
  }

  getRoles() {
    RoleStore.getAllRole({});
  }

  showForm(id: string | null = null) {
    if (id) {
      UserModule.getOneUserFromList(id);
      const newDataUser = {
        ...this.dataUser,
        role: this.dataUser.roles[0].id,
      };
      this.user = {
        ...this.user,
        ...newDataUser,
      };
    } else {
      UserModule.setInitDataUser();
      this.user = {
        ...this.dataUser,
      };
    }
    this.dialogForm = true;
  }

  showConfirmDelete(id: string) {
    UserModule.getOneUserFromList(id);
    this.user = {
      ...this.dataUser,
    };
    this.dialogDelete = true;
  }

  deleteData() {
    if (this.user.id) {
      UserModule.deleteUser(this.user.id);
    }
    this.dialogDelete = false;
  }

  save() {
    if (
      this.user.first_name === '' ||
      this.user.last_name === '' ||
      this.user.username === '' ||
      this.user.email === '' ||
      this.user.role === ''
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    } else {
      let newUser;
      const role = this.listRole.find(
        (item: any) => item.id === this.user.role,
      );
      if (this.user.id) {
        newUser = {
          ...this.user,
          password: '12345',
          roles: role ? [role] : [],
        };
      } else {
        newUser = {
          ...this.user,
          password: '12345',
          roles: role ? [role] : [],
        };
      }
      delete newUser.role;
      delete newUser.created_at;
      delete newUser.updated_at;
      delete newUser.full_name;
      UserModule.saveUser(newUser);
      this.user = InitUser;
      this.$v.$reset();
      this.dialogForm = false;
    }
  }

  convertlabel(name: string): string {
    return name.replace('_', ' ').toUpperCase();
  }

  // GETTERS
  get pagination(): any {
    return UserModule.pagination;
  }

  get isLoading(): boolean {
    return UserModule.isLoadingUser;
  }

  get dataUser(): IUser {
    return UserModule.user;
  }

  get listUser(): IUser[] {
    const list = UserModule.listUser.map((item: any) => {
      const roleNames = item.roles.map((el: any) => el.description);
      return {
        ...item,
        role_text:
          roleNames && Array.isArray(roleNames) && roleNames.length > 0
            ? roleNames.join(',')
            : '-',
      };
    });
    return list;
  }

  get listRole(): IUser[] {
    return RoleStore.listRole;
  }
}
