export type Role = "admin" | "teacher" | "student" | "parent";

export const PERMISSIONS = {
  // Admin
  MANAGE_USERS: "users:manage",
  MANAGE_ROLES: "roles:manage",
  VIEW_ANALYTICS: "analytics:view",

  // Academic
  CREATE_EXAM: "exam:create",
  GRADE_EXAM: "exam:grade",
  VIEW_EXAM: "exam:view",

  // Student
  VIEW_OWN_GRADES: "grades:view_own",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_EXAM,
  ],
  teacher: [
    PERMISSIONS.CREATE_EXAM,
    PERMISSIONS.GRADE_EXAM,
    PERMISSIONS.VIEW_EXAM,
  ],
  student: [PERMISSIONS.VIEW_OWN_GRADES, PERMISSIONS.VIEW_EXAM],
  parent: [PERMISSIONS.VIEW_OWN_GRADES],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
