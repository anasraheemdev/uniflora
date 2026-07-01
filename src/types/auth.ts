export type UserRole = "admin" | "contributor" | "student";

export type SessionUser = {
  role: UserRole;
  email: string;
  name: string;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  contributor: "Contributor",
  student: "Student",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: "Manage species, users, approvals, and platform analytics.",
  contributor: "Review submissions, curate specimens, and verify identifications.",
  student: "Submit observations, photos, and campus plant sightings.",
};

export const DEMO_ACCOUNTS: { role: UserRole; email: string; password: string; name: string }[] = [
  { role: "admin", email: "admin@uniflora.edu", password: "admin123", name: "Dr. A. Rehman" },
  { role: "contributor", email: "curator@uniflora.edu", password: "contrib123", name: "S. Iqbal" },
  { role: "student", email: "student@uniflora.edu", password: "student123", name: "M. Zahra" },
];

export function roleDashboardPath(role: UserRole): string {
  return `/dashboard/${role}`;
}
