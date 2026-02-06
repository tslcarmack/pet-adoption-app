import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileContent } from "@/components/profile-content";

export const metadata = {
  title: "个人中心 - 宠物领养平台",
  description: "管理您的个人信息和领养记录",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?returnUrl=/profile");
  }

  return <ProfileContent />;
}
