"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, User, Home, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export function AdminApplicationDetail({ application }: { application: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const status = statusMap[application.status] || statusMap.PENDING;

  const handleReview = async (action: "approve" | "reject") => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/applications/${application.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          reviewerNotes,
        }),
      });

      if (response.ok) {
        toast({
          title: action === "approve" ? "申请已批准" : "申请已拒绝",
          description: "操作成功",
        });
        router.push("/admin/applications");
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: "操作失败",
          description: data.error || "请稍后重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "请检查网络连接后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin/applications">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回申请列表
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">申请详情</h1>
          <p className="text-sm text-muted-foreground">
            申请编号: {application.id}
          </p>
        </div>
        <Badge variant={status.variant} className="text-base px-4 py-2 self-start sm:self-auto">
          {status.label}
        </Badge>
      </div>

      {/* Pet Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>申请宠物</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
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

      {/* Applicant Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>申请人信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">姓名</div>
                <div className="font-medium">{application.fullName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">邮箱</div>
                <div className="font-medium text-sm">{application.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">手机</div>
                <div className="font-medium">{application.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">提交时间</div>
                <div className="font-medium text-sm">
                  {new Date(application.submittedAt).toLocaleString("zh-CN")}
                </div>
              </div>
            </div>
          </div>

          {application.occupation && (
            <>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-1">职业</div>
                <div>{application.occupation}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* All Application Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>详细信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Housing */}
          <div>
            <h3 className="font-semibold mb-3">居住环境</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
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

          <Separator />

          {/* Pet Experience */}
          <div>
            <h3 className="font-semibold mb-3">宠物经验</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">养宠经验: </span>
                <span>{application.hasPetExperience ? "有" : "无"}</span>
              </div>
              {application.hasPetExperience && (
                <>
                  {application.previousPetType && (
                    <div>
                      <span className="text-muted-foreground">之前养过: </span>
                      <span>{application.previousPetType}</span>
                    </div>
                  )}
                  {application.yearsOfExperience && (
                    <div>
                      <span className="text-muted-foreground">经验年限: </span>
                      <span>{application.yearsOfExperience}年</span>
                    </div>
                  )}
                  {application.previousPetOutcome && (
                    <div>
                      <span className="text-muted-foreground">之前宠物结局: </span>
                      <span>{application.previousPetOutcome}</span>
                    </div>
                  )}
                </>
              )}
              <div>
                <span className="text-muted-foreground">现养宠物: </span>
                <span>{application.hasCurrentPets ? "有" : "无"}</span>
              </div>
              {application.hasCurrentPets && application.currentPetsInfo && (
                <div>
                  <span className="text-muted-foreground">当前宠物信息: </span>
                  <span>{application.currentPetsInfo}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Motivation */}
          <div>
            <h3 className="font-semibold mb-3">领养理由</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
              {application.motivation}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      {application.status === "PENDING" && (
        <Card>
          <CardHeader>
            <CardTitle>审核操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reviewerNotes">审核意见（可选）</Label>
              <Textarea
                id="reviewerNotes"
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="填写审核意见..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleReview("approve")}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                批准申请
              </Button>
              <Button
                onClick={() => handleReview("reject")}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                拒绝申请
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review History */}
      {application.reviewedAt && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>审核记录</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">审核时间</div>
              <div className="font-medium">
                {new Date(application.reviewedAt).toLocaleString("zh-CN")}
              </div>
            </div>
            {application.reviewerNotes && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">审核意见</div>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {application.reviewerNotes}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
