"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  Heart, 
  Share2, 
  Check, 
  ArrowLeft,
  User,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  healthStatus: string | null;
  vaccinationStatus: string;
  location: string;
  status: string;
  photos: string[];
  isFavorited: boolean;
  userApplication: any;
  pendingApplicationsCount: number;
  createdAt: string;
}

interface PetDetailContentProps {
  pet: Pet;
}

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" } } = {
  AVAILABLE: { label: "可领养", variant: "default" },
  PENDING: { label: "待审核", variant: "secondary" },
  ADOPTED: { label: "已领养", variant: "outline" },
};

const speciesMap: { [key: string]: string } = {
  DOG: "狗",
  CAT: "猫",
  OTHER: "其他",
};

const genderMap: { [key: string]: string } = {
  MALE: "公",
  FEMALE: "母",
};

const sizeMap: { [key: string]: string } = {
  SMALL: "小型",
  MEDIUM: "中型",
  LARGE: "大型",
};

const vaccinationMap: { [key: string]: { label: string; color: string } } = {
  NONE: { label: "未接种", color: "text-red-600" },
  PARTIAL: { label: "部分接种", color: "text-orange-600" },
  COMPLETE: { label: "已完成接种", color: "text-green-600" },
};

export function PetDetailContent({ pet }: PetDetailContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(pet.isFavorited);

  const ageYears = Math.floor(pet.age / 12);
  const ageMonths = pet.age % 12;
  const ageText =
    ageYears > 0
      ? `${ageYears}岁${ageMonths > 0 ? ageMonths + "个月" : ""}`
      : `${ageMonths}个月`;

  const status = statusMap[pet.status] || statusMap.AVAILABLE;
  const photos = pet.photos.length > 0 ? pet.photos : ["/placeholder-pet.jpg"];
  const vaccination = vaccinationMap[pet.vaccinationStatus] || vaccinationMap.NONE;

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?petId=${pet.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
          toast({
            title: "已取消收藏",
            description: "已从收藏列表中移除",
          });
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ petId: pet.id }),
        });

        if (response.ok) {
          setIsFavorited(true);
          toast({
            title: "收藏成功",
            description: "已添加到我的收藏",
          });
        } else {
          const data = await response.json();
          if (response.status === 401) {
            // Redirect to login
            router.push(`/login?returnUrl=/pets/${pet.id}`);
          } else {
            toast({
              title: "操作失败",
              description: data.error || "请稍后重试",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "操作失败",
        description: "请检查网络连接后重试",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.name} - 宠物领养`,
          text: `来看看这只可爱的${speciesMap[pet.species]}吧！`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "链接已复制",
          description: "可以分享给好友了",
        });
      } catch (err) {
        toast({
          title: "复制失败",
          description: "请手动复制链接",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container py-4 md:py-8">
      {/* Back link */}
      <Button variant="ghost" asChild className="mb-4" size="sm">
        <Link href="/pets">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">返回列表</span>
          <span className="sm:hidden">返回</span>
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Photo Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={photos[currentPhotoIndex]}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    currentPhotoIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`${pet.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pet Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold">{pet.name}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-xl text-muted-foreground">
              {speciesMap[pet.species]} · {pet.breed}
            </p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">年龄</div>
                <div className="text-lg font-semibold">{ageText}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">性别</div>
                <div className="text-lg font-semibold">
                  {genderMap[pet.gender]}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">体型</div>
                <div className="text-lg font-semibold">
                  {sizeMap[pet.size]}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  地区
                </div>
                <div className="text-lg font-semibold">{pet.location}</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {pet.status === "AVAILABLE" && (
              <Button asChild className="flex-1" size="lg">
                <Link href={`/pets/${pet.id}/apply`}>申请领养</Link>
              </Button>
            )}
            {pet.userApplication && (
              <Button variant="outline" size="lg" className="flex-1" disabled>
                <Check className="h-4 w-4 mr-2" />
                已申请
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleFavorite}
                className="flex-1 sm:flex-none"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorited ? "fill-current text-red-500" : ""
                  }`}
                />
                <span className="ml-2 sm:hidden">{isFavorited ? "已收藏" : "收藏"}</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleShare}
                className="flex-1 sm:flex-none"
              >
                <Share2 className="h-5 w-5" />
                <span className="ml-2 sm:hidden">分享</span>
              </Button>
            </div>
          </div>

          {/* Vaccination Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">健康信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  疫苗接种
                </div>
                <div className={`font-semibold ${vaccination.color}`}>
                  {vaccination.label}
                </div>
              </div>
              {pet.healthStatus && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    健康状况
                  </div>
                  <div className="text-sm">{pet.healthStatus}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>关于 {pet.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {pet.description}
          </p>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>联系方式</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            如有疑问，请通过平台申请系统提交领养申请，我们会尽快与您联系。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
