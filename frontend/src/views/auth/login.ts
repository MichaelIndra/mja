import {
  isAdmin,
  isBranchHRA,
  isBranchHRP,
  isBranchManager,
  isGeneralHRA,
  isGeneralHRP,
  isGeneralManager,
  isOwner,
} from '@/common/utils/config';
import { AuthModule } from '@/store/modules/auth';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'Login',
})
export default class Login extends Vue {
  username: string = '';
  password: string = '';
  loading: boolean = true;
  dialog: boolean = false;

  setUser(type: string) {
    this.username = type;
    this.password = 'secret';
    this.dialog = false;
    this.login();
  }

  async login() {
    const auth = {
      username: this.username,
      password: this.password,
    };
    await AuthModule.Login(auth);
    if (isAdmin()) {
      this.$router.push({ name: 'admin' });
    } else if (isGeneralManager()) {
      this.$router.push({ name: 'general' });
    } else if (isGeneralHRA()) {
      this.$router.push({ name: 'general-hr-attendance' });
    } else if (isGeneralHRP()) {
      this.$router.push({ name: 'general-hr-payroll' });
    } else if (isBranchManager()) {
      this.$router.push({ name: 'branch' });
    } else if (isBranchHRA()) {
      this.$router.push({ name: 'branch-hr-attendance' });
    } else if (isBranchHRP()) {
      this.$router.push({ name: 'branch-hr-payroll' });
    } else if (isOwner()) {
      this.$router.push({ name: 'owner' });
    }
  }
}
