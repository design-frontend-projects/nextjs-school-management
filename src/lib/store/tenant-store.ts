import { create } from "zustand";
import { Role, Permission } from "@/lib/rbac/definitions";

export interface TenantState {
  schoolId: string | null;
  schoolName: string | null;
  userRole: Role | null;
  permissions: Permission[];
  setSchool: (id: string, name: string) => void;
  setUserRole: (role: Role, perms: Permission[]) => void;
  reset: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  schoolId: null,
  schoolName: null,
  userRole: null,
  permissions: [],
  setSchool: (id, name) => set({ schoolId: id, schoolName: name }),
  setUserRole: (role, perms) => set({ userRole: role, permissions: perms }),
  reset: () =>
    set({ schoolId: null, schoolName: null, userRole: null, permissions: [] }),
}));
