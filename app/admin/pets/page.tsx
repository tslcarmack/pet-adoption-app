import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminPetsList } from "@/components/admin-pets-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "宠物管理 - 管理后台",
  description: "管理所有宠物信息",
};

export default async function AdminPetsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">宠物管理</h1>
          <p className="text-muted-foreground">
            管理所有宠物信息和状态
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pets/new">
            <Plus className="h-4 w-4 mr-2" />
            添加宠物
          </Link>
        </Button>
      </div>

      <AdminPetsList />
    </div>
  );
}
