import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { AddNewUser } from "@/features/user-management/components/add-new-user";

export default async function UserManagement() {
  const { user } = await checkAuthentication();

  if (!user) {
    return <div>You are not authorized to access this page</div>;
  }

  if (user.role !== "SUPER_ADMIN") {
    return <div>You are not authorized to access this page</div>;
  }
  return (
    <>
      <AddNewUser />
    </>
  );
}
