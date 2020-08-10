import {
  getUserInfo,
  login,
  resetPasswordByToken,
  updateAccount,
} from '@/common/api/auth';
import { fullName, setError } from '@/common/utils/config';
import { getToken, removeToken, setToken } from '@/common/utils/cookies';
import { decodeToken } from '@/common/utils/jwt';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IAuthState {
  token: string;
  name: string;
  email: string;
  avatar: string;
  introduction: string;
  roles: string[];
  id: string;
}

@Module({ dynamic: true, store, name: 'auth' })
class Auth extends VuexModule implements IAuthState {
  token = getToken() || '';
  name = '';
  avatar = '';
  introduction = '';
  roles: string[] = [];
  email = '';
  id = '';

  @Action async changeUserData(data: any) {
    try {
      const res: any = await updateAccount(data);
      console.info('success update account', res);
    } catch (error) {
      console.error('error update account', error);
    }
  }

  @Action
  async Login(userInfo: { username: string; password: string }) {
    let { username, password } = userInfo;
    username = username.trim();
    password = password.trim();
    const authData: any = await login({ username, password });
    if (authData.status || authData.statusCode) {
      setError(authData);
    } else {
      const {
        roles,
        first_name,
        last_name,
        avatar,
        introduction,
        email,
        id,
      } = decodeToken(authData.access_token);
      if (roles.length === 0) {
        const newData = {
          status: 404,
          message: 'Role anda belum di set oleh admin',
        };
        setError(newData);
      } else {
        setToken(authData.access_token);
        this.SET_TOKEN(authData.access_token);
        this.SET_ROLES(roles);
        this.SET_NAME(fullName(first_name, last_name));
        this.SET_AVATAR(avatar);
        this.SET_INTRODUCTION(introduction);
        this.SET_EMAIL(email);
        this.SET_ID(id);
      }
    }
  }

  @Action
  ResetToken() {
    removeToken();
    this.SET_TOKEN('');
    this.SET_ROLES([]);
  }

  @Action
  async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!');
    }
    const { data } = await getUserInfo({
      /* Your params here */
    });
    if (!data) {
      throw Error('Verification failed, please Login again.');
    }
    const {
      roles,
      first_name,
      last_name,
      avatar,
      introduction,
      email,
      id,
    } = data.user;
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!');
    }
    this.SET_ROLES(roles);
    this.SET_NAME(fullName(first_name, last_name));
    this.SET_AVATAR(avatar);
    this.SET_INTRODUCTION(introduction);
    this.SET_EMAIL(email);
    this.SET_ID(id);
  }

  @Action
  setUserData(data: any) {
    const {
      roles,
      first_name,
      last_name,
      avatar,
      introduction,
      email,
      id,
    } = data;
    this.SET_ROLES(roles);
    this.SET_NAME(fullName(first_name, last_name));
    this.SET_AVATAR(avatar);
    this.SET_INTRODUCTION(introduction);
    this.SET_EMAIL(email);
    this.SET_ID(id);
  }

  @Action
  async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token';
    this.SET_TOKEN(token);
    setToken(token);
    await this.GetUserInfo();
    // resetRouter();
    // Generate dynamic accessible routes based on roles
    // PermissionModule.GenerateRoutes(this.roles);
    // Add generated routes
    // router.addRoutes(PermissionModule.dynamicRoutes);
    // Reset visited views and cached views
    // TagsViewModule.delAllViews();
  }

  @Action
  async LogoutUser() {
    if (this.token === '') {
      throw Error('LogoutUser: token is undefined!');
    }
    // await logout();
    removeToken();
    this.SET_TOKEN('');
    this.SET_ROLES([]);
  }

  @Action async changePassowrdByUser(data: any) {
    try {
      await resetPasswordByToken(data);
    } catch (error) {
      console.info('failed change password');
      setError(error.response.data);
    }
  }

  @Action
  async SetToken(token: string) {
    this.SET_TOKEN(token);
  }

  @Action
  async changeDisplayName(data: any) {
    const full_name =
      data.first_name + data.last_name &&
      data.last_name !== '' &&
      data.last_name !== null
        ? data.last_name
        : '';
    this.SET_NAME(full_name);
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  private SET_NAME(full_name: string) {
    this.name = full_name;
  }

  @Mutation
  private SET_ID(id: string) {
    this.id = id;
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar;
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction;
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles;
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email;
  }
}

export const AuthModule = getModule(Auth);
