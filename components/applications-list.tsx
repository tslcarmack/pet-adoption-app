import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
  PENDING: { label: "待审核", variant: "secondary" },
  APPROVED: { label: "已通过", variant: "default" },
  REJECTED: { label: "未通过", variant: "destructive" },
  WITHDRAWN: { label: "已撤回", variant: "outline" },
};

async function fetchApplications() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const applications = await prisma.adoptionApplication.findMany({
    where: { userId: session.user.id },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          photos: true,
          status: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return applications;
}

export async function ApplicationsList() {
  const applications = await fetchApplications();

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">您还没有提交过领养申请</p>
          <p className="text-sm text-muted-foreground mt-2">
            浏览宠物列表，找到心仪的宠物后提交申请
          </p>
        </div>
        <Button asChild>
          <Link href="/pets">浏览宠物</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const status = statusMap[application.status] || statusMap.PENDING;
        
        return (
          <Card key={application.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={application.pet.photos[0] || "/placeholder-pet.jpg"}
                    alt={application.pet.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {application.pet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {application.pet.breed}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">
                    提交时间: {new Date(application.submittedAt).toLocaleDateString("zh-CN")}
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/applications/${application.id}`}>
                      查看详情
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
