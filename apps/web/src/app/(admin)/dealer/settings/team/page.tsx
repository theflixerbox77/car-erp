import { Metadata } from "next";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/dal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import TeamRoleSelect from "@/components/settings/TeamRoleSelect";
import TeamStatusToggle from "@/components/settings/TeamStatusToggle";
import InviteTeamMemberForm from "@/components/settings/InviteTeamMemberForm";
import type { TeamMember, TeamRole } from "@/lib/types/settings";

export const metadata: Metadata = { title: "Team Settings" };

export default async function TeamSettingsPage() {
  const currentUser = await getCurrentUser();
  // Platform admins have no tenant, so /users/team (TenantScopedGuard) isn't reachable for them.
  if (currentUser?.isPlatformAdmin) redirect("/dealer/settings/profile");

  let team: TeamMember[];
  let roles: TeamRole[];
  try {
    [team, roles] = await Promise.all([api.get<TeamMember[]>("/users/team"), api.get<TeamRole[]>("/users/roles")]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Only the dealership owner can manage the team.</p>
        </div>
      );
    }
    throw err;
  }

  return (
    <div className="space-y-6">
      <InviteTeamMemberForm roles={roles} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Role
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {team.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No team members yet.</TableCell>
                </TableRow>
              )}
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {member.fullName}
                    {member.id === currentUser?.id && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{member.email}</TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {member.role ? <TeamRoleSelect id={member.id} roleId={member.role.id} roles={roles} /> : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm capitalize text-gray-500 dark:text-gray-400">{member.status}</TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {member.id !== currentUser?.id && <TeamStatusToggle id={member.id} status={member.status} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
