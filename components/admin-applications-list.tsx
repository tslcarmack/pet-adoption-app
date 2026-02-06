"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface Application {
  id: string;
  submittedAt: Date;
  fullName: string;
  email: string;
  phone: string;
  motivation: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    photos: string[];
  };
  user: {
    name: string | null;
    email: string;
  };
}

export function AdminApplicationsList({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async (applicationId: string, action: "approve" | "reject") => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/applications/${applicationId}/review`, {
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
        router.refresh();
        setSelectedId(null);
        setReviewerNotes("");
      } else {
        const data = await response.json();
        alert(data.error || "操作失败");
      }
    } catch (error) {
      alert("操作失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">暂无待审核申请</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={app.pet.photos[0] || "/placeholder-pet.jpg"}
                  alt={app.pet.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{app.pet.name}</h3>
                  <p className="text-sm text-muted-foreground">{app.pet.breed}</p>
                </div>

                <div className="text-sm">
                  <p><strong>申请人:</strong> {app.fullName} ({app.email})</p>
                  <p><strong>手机:</strong> {app.phone}</p>
                  <p><strong>提交时间:</strong> {new Date(app.submittedAt).toLocaleString("zh-CN")}</p>
                </div>

                {selectedId === app.id ? (
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <Label htmlFor={`notes-${app.id}`}>审核意见</Label>
                      <Textarea
                        id={`notes-${app.id}`}
                        value={reviewerNotes}
                        onChange={(e) => setReviewerNotes(e.target.value)}
                        placeholder="（可选）填写审核意见..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReview(app.id, "approve")}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        通过
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReview(app.id, "reject")}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        拒绝
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedId(null);
                          setReviewerNotes("");
                        }}
                        disabled={isLoading}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedId(app.id)}
                    >
                      审核此申请
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/admin/applications/${app.id}`}>
                        查看完整信息
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
