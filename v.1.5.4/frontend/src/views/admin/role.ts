import { InitQuery, IQuery } from '@/common/interfaces/query';
import { IRole } from '@/common/interfaces/role';
import { RoleStore } from '@/store/modules/role';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'Role',
})
export default class Role extends Vue {
  valid: boolean = true;
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  options: any = {};
  params: IQuery = {
    ...InitQuery,
  };
  headers: any[] = [
    {
      text: 'Nama Role',
      align: 'left',
      sortable: false,
      value: 'description',
    },
    { text: 'Ditambahkan pada', value: 'created_at' },
    // { text: 'Aksi', value: 'actions', sortable: false },
  ];

  // GETTERS
  get pagination(): any {
    return RoleStore.pagination;
  }

  get isLoading(): boolean {
    return RoleStore.isLoadingRole;
  }

  get role(): IRole {
    return RoleStore.role;
  }

  get listRole(): IRole[] {
    return RoleStore.listRole;
  }

  // WATCH
  @Watch('options')
  listenOptionsChanges() {
    this.getListRole();
  }

  // METHODS
  mounted() {
    this.getListRole();
  }

  getListRole() {
    RoleStore.getAllRole({});
  }

  closeForm() {
    this.$store.commit('SET_LOADING_ROLE', false);
    this.dialogForm = false;
  }

  showForm(id: string | null = null) {
    if (id) {
      RoleStore.getOneRoleFromList(id);
    } else {
      RoleStore.setInitDataRole();
    }
    this.dialogForm = true;
  }

  showConfirmDelete(id: string) {
    RoleStore.getOneRoleFromList(id);
    this.dialogDelete = true;
  }

  deleteData() {
    if (this.role.id) {
      RoleStore.deleteRole(this.role.id);
    }
    this.dialogDelete = false;
  }

  save() {
    RoleStore.saveRole(this.role);
    this.dialogForm = false;
  }
}
