import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import {
  isAdmin,
  isBranchHRA,
  isBranchHRP,
  isBranchManager,
  isGeneralHRA,
  isGeneralHRP,
  isGeneralManager,
  isOwner,
} from '../../common/utils/config';
import {
  adminMenu,
  branchHRAttendanceMenu,
  branchHRPayslipMenu,
  branchManagerMenu,
  generalHRAttendanceMenu,
  generalHRPayslipMenu,
  generalManagerMenu,
  ownerMenu,
} from '../../common/utils/navigation';
import { AuthModule } from '../../store/modules/auth';
import { SettingsStore } from '../../store/modules/settings';

@Component({
  name: 'MenuNavigation',
})
export default class MenuNavigation extends Vue {
  // DATA
  menus: any = [];
  APP_VERSION: string = process.env.VUE_APP_VERSION;

  // METHODS
  mounted() {
    this.selectMenuNavigation();
  }

  selectMenuNavigation() {
    if (isAdmin()) {
      this.menus = adminMenu;
    } else if (isGeneralManager()) {
      this.menus = generalManagerMenu;
    } else if (isGeneralHRA()) {
      this.menus = generalHRAttendanceMenu;
    } else if (isGeneralHRP()) {
      this.menus = generalHRPayslipMenu;
    } else if (isBranchManager()) {
      this.menus = branchManagerMenu;
    } else if (isBranchHRA()) {
      this.menus = branchHRAttendanceMenu;
    } else if (isBranchHRP()) {
      this.menus = branchHRPayslipMenu;
    } else if (isOwner()) {
      this.menus = ownerMenu;
    }
  }

  confirmLogout() {
    this.$emit('confirmLogout');
  }

  // GETTERS
  get mini(): boolean {
    return SettingsStore.mini;
  }

  get drawer(): boolean {
    return SettingsStore.drawer;
  }

  get userRole(): string[] {
    return AuthModule.roles;
  }
}
