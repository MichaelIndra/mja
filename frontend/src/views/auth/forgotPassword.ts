import { resetAndGenerateToken, resetPasswordByToken } from '@/common/api/auth';
import { InitSnackbar } from '@/common/interfaces/snackbar';
import { openSnackbarNow } from '@/common/utils/config';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'ForgotPassword',
})
export default class ForgotPassword extends Vue {
  email: any = null;
  token: any = null;
  redirect_url: string = '';
  password: any = null;
  re_password: any = null;
  isSuccess: boolean = false;
  isLoading: boolean = false;

  mounted() {
    const origin = window.location.origin;
    const hostAndPath = origin.concat(window.location.pathname);
    this.redirect_url = hostAndPath;
    if (this.$route.query.token) {
        this.token = this.$route.query.token;
    }
    if (this.$route.query.email) {
        this.email = this.$route.query.email;
    }
  }

  async resetPassword() {
    this.isLoading = true;
    this.isSuccess = false;
    try {
        const data: any = {
            email: this.email,
            redirect_url: this.redirect_url,
        };

        await resetAndGenerateToken(data);
        this.isSuccess = true;
        this.isLoading = false;
    } catch (err) {
        openSnackbarNow({
            ...InitSnackbar,
            value: true,
            color: 'error',
            message: err.response.data.message || err.message || JSON.stringify(err),
        });
        this.isSuccess = false;
        this.isLoading = false;
    }
  }

  async changePassword() {
    this.isLoading = true;
    this.isSuccess = false;
    try {
        const data: any = {
            email: this.email,
            token: this.token,
            password: this.password,
            re_password: this.re_password,
        };

        await resetPasswordByToken(data);
        openSnackbarNow({
            ...InitSnackbar,
            value: true,
            color: 'success',
            message: 'Berhasil mengubah password',
        });
        this.isSuccess = true;
        this.isLoading = false;
    } catch (err) {
        openSnackbarNow({
            ...InitSnackbar,
            value: true,
            color: 'error',
            message: err.response.data.message || err.message || JSON.stringify(err),
        });
        this.isSuccess = false;
        this.isLoading = false;
    }
  }
}
