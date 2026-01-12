import { create } from "zustand";
import { Role, Permission } from "@/lib/rbac/definitions";

interface TenantState {
  tenantId: string | null;
  tenantName: string | null;
  userRole: Role | null;
  permissions: Permission[];
  setTenant: (id: string, name: string) => void;
  setUserRole: (role: Role, perms: Permission[]) => void;
  reset: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenantId: null,
  tenantName: null,
  userRole: null,
  permissions: [],
  setTenant: (id, name) => set({ tenantId: id, tenantName: name }),
  setUserRole: (role, perms) => set({ userRole: role, permissions: perms }),
  reset: () =>
    set({ tenantId: null, tenantName: null, userRole: null, permissions: [] }),
}));
