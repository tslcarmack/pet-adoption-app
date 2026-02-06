import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PetForm } from "@/components/pet-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "添加宠物 - 管理后台",
  description: "添加新的宠物信息",
};

export default async function NewPetPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin/pets">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回宠物列表
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">添加宠物</h1>
        <p className="text-muted-foreground">
          填写宠物信息并上传照片
        </p>
      </div>

      <PetForm />
    </div>
  );
}
