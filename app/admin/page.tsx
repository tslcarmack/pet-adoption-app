import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStats() {
  const [
    totalPets,
    availablePets,
    totalApplications,
    pendingApplications,
  ] = await Promise.all([
    prisma.pet.count(),
    prisma.pet.count({ where: { status: "AVAILABLE" } }),
    prisma.adoptionApplication.count(),
    prisma.adoptionApplication.count({ where: { status: "PENDING" } }),
  ]);

  return {
    totalPets,
    availablePets,
    totalApplications,
    pendingApplications,
  };
}

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getStats();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">管理后台</h1>
        <p className="text-muted-foreground">
          管理宠物信息和领养申请
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              总宠物数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs text-muted-foreground">
              可领养: {stats.availablePets}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              待审核申请
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              需要处理
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              总申请数
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              所有申请
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              可领养宠物
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availablePets}</div>
            <p className="text-xs text-muted-foreground">
              当前状态
            </p>
          </CardContent>
        </Card>
      </div>

             {/* Quick Actions */}
             <div className="grid md:grid-cols-2 gap-4">
               <Card>
                 <CardHeader>
                   <CardTitle>待审核申请</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-4">
                     当前有 {stats.pendingApplications} 个申请等待审核
                   </p>
                   <Button asChild>
                     <Link href="/admin/applications">查看待审核申请</Link>
                   </Button>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle>宠物管理</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-4">
                     管理所有宠物信息和状态
                   </p>
                   <div className="flex gap-2">
                     <Button asChild>
                       <Link href="/admin/pets">管理宠物</Link>
                     </Button>
                     <Button asChild variant="outline">
                       <Link href="/admin/pets/new">添加宠物</Link>
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>
    </div>
  );
}
