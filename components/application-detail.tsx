import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
  PENDING: { label: "待审核", variant: "secondary" },
  APPROVED: { label: "已通过", variant: "default" },
  REJECTED: { label: "未通过", variant: "destructive" },
  WITHDRAWN: { label: "已撤回", variant: "outline" },
};

const housingTypeMap: { [key: string]: string } = {
  OWN: "自有",
  RENT: "租赁",
};

const livingSituationMap: { [key: string]: string } = {
  HOUSE: "独栋房屋",
  APARTMENT: "公寓",
  OTHER: "其他",
};

export function ApplicationDetail({ application }: { application: any }) {
  const status = statusMap[application.status] || statusMap.PENDING;

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/applications">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回申请列表
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold">领养申请详情</h1>
          <Badge variant={status.variant} className="text-base px-4 py-2">
            {status.label}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          申请编号: {application.id}
        </p>
      </div>

      {/* Pet Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
              <Image
                src={application.pet.photos[0] || "/placeholder-pet.jpg"}
                alt={application.pet.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{application.pet.name}</h2>
              <p className="text-muted-foreground">{application.pet.breed}</p>
              <Button asChild variant="link" className="px-0 mt-2">
                <Link href={`/pets/${application.pet.id}`}>查看宠物详情</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>申请时间线</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold">申请已提交</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(application.submittedAt).toLocaleString("zh-CN")}
                </div>
              </div>
            </div>

            {application.reviewedAt && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className={`h-5 w-5 mt-0.5 ${
                  application.status === "APPROVED" ? "text-green-600" : "text-red-600"
                }`} />
                <div>
                  <div className="font-semibold">审核完成</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(application.reviewedAt).toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>
            )}

            {application.status === "PENDING" && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-semibold">等待审核中</div>
                  <div className="text-sm text-muted-foreground">
                    通常在3-5个工作日内完成审核
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviewer Notes */}
      {application.reviewerNotes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>审核意见</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{application.reviewerNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle>申请信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="font-semibold mb-3">个人信息</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">姓名: </span>
                <span>{application.fullName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">邮箱: </span>
                <span>{application.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">手机: </span>
                <span>{application.phone}</span>
              </div>
              {application.occupation && (
                <div>
                  <span className="text-muted-foreground">职业: </span>
                  <span>{application.occupation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Housing */}
          <div>
            <h3 className="font-semibold mb-3">居住环境</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">地址: </span>
                <span>{application.address}</span>
              </div>
              <div>
                <span className="text-muted-foreground">住房类型: </span>
                <span>{housingTypeMap[application.housingType]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">居住类型: </span>
                <span>{livingSituationMap[application.livingSituation]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">家庭成员: </span>
                <span>{application.householdMembers}人</span>
              </div>
              <div>
                <span className="text-muted-foreground">院子: </span>
                <span>{application.hasYard ? "有" : "无"}</span>
              </div>
            </div>
          </div>

          {/* Pet Experience */}
          <div>
            <h3 className="font-semibold mb-3">宠物经验</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">养宠经验: </span>
                <span>{application.hasPetExperience ? "有" : "无"}</span>
              </div>
              {application.hasPetExperience && application.previousPetType && (
                <>
                  <div>
                    <span className="text-muted-foreground">之前养过: </span>
                    <span>{application.previousPetType}</span>
                  </div>
                  {application.yearsOfExperience && (
                    <div>
                      <span className="text-muted-foreground">经验年限: </span>
                      <span>{application.yearsOfExperience}年</span>
                    </div>
                  )}
                </>
              )}
              <div>
                <span className="text-muted-foreground">现养宠物: </span>
                <span>{application.hasCurrentPets ? "有" : "无"}</span>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div>
            <h3 className="font-semibold mb-3">领养理由</h3>
            <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
              {application.motivation}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
