"use client";
import { UserRole } from "@prisma/client";

interface Props {
  className?: string;
  userRole: UserRole;
}

function UserRoleBadge({ userRole, className }: Props) {
  return (
    <span
      className={`flex flex-row items-center justify-center ${
        userRole === "OWNER"
          ? "bg-rose-500/70  border-rose-400"
          : userRole === "ADMIN"
          ? "bg-sky-500/70 border-sky-400"
          : "bg-emerald-500/70 border-emerald-400"
      } border-[1px] font-rubik ${className}`}
    >
      <p className="text-rose-50">
        {userRole === "OWNER"
          ? "Owner"
          : userRole === "ADMIN"
          ? "Admin"
          : "User"}
      </p>
    </span>
  );
}

export default UserRoleBadge;
