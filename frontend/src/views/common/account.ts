import { IUser } from '@/common/interfaces/user';
import { AuthModule } from '@/store/modules/auth';
import { RoleStore } from '@/store/modules/role';
import { UserModule } from '@/store/modules/user';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'Account',
})
export default class Account extends Vue {
  editPassword: boolean = false;
  newPassword: string = '';
  reTypePassword: string = '';
  checkReTypePassword: boolean = false;
  visibility: boolean = false;
  modalChangeAccount: boolean = false;
  account: any = {};
  dialogConfirmPassword: boolean = false;
  displayRole: string = '';

  @Watch('reTypePassword')
  checkRetypePassword() {
    if (this.reTypePassword !== this.newPassword) {
      this.checkReTypePassword = true;
    } else {
      this.checkReTypePassword = false;
    }
  }

  get user() {
    return UserModule.user;
  }

  get userRole() {
    return AuthModule.roles[0];
  }

  get listRole(): IUser[] {
    return RoleStore.listRole;
  }

  get token(): any {
    return AuthModule.token;
  }

  mounted() {
    this.getAccountInfo();
    this.checkDisplayRole();
  }

  checkDisplayRole() {
    const role: any = AuthModule.roles[0].split('_');
    if (role.length > 1) {
      this.displayRole = role.join(' ').toUpperCase();
    } else {
      this.displayRole = role.toUpperCase();
    }
  }

  async save() {
    let newUser: any;
    const role = this.listRole.find((item: any) => item.name === this.userRole);
    newUser = {
      ...this.account,
      roles: role ? [role] : [],
    };
    delete newUser.role;
    delete newUser.created_at;
    delete newUser.updated_at;
    delete newUser.full_name;
    await UserModule.saveUser(newUser);

    const full_name = `${this.account.first_name} ${
      this.account.last_name &&
      this.account.last_name !== '' &&
      this.account.last_name !== null
        ? this.account.last_name
        : ''
    }`;
    UserModule.setUserFullName(full_name);
    this.modalChangeAccount = false;
    this.getAccountInfo();
  }

  async savePassword() {
    const data: any = {
      password: this.newPassword,
      re_password: this.reTypePassword,
      email: this.user.email,
      token: this.token,
    };
    await AuthModule.changePassowrdByUser(data);
    this.logout();
  }

  async logout() {
    await AuthModule.LogoutUser();
    await UserModule.setInitDataUser();
    this.$router.push({
      path: '/login',
    });
  }

  confirmPassword() {
    this.dialogConfirmPassword = true;
  }

  confirmChangePassword() {
    this.editPassword = true;
  }

  changeAccountInfo() {
    this.account = JSON.parse(JSON.stringify(this.user));
    this.modalChangeAccount = true;
  }

  cancelChangePassword() {
    this.dialogConfirmPassword = false;
    this.editPassword = false;
    this.newPassword = '';
    this.reTypePassword = '';
  }

  getAccountInfo() {
    UserModule.getOneUser(AuthModule.id);
    RoleStore.getAllRole({});
  }
}
