"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  petId: string;
  initialIsFavorited?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
}

export function FavoriteButton({
  petId,
  initialIsFavorited = false,
  size = "default",
  variant = "ghost",
  showLabel = false,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside Link
    e.stopPropagation();

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?petId=${petId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
          router.refresh();
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
          body: JSON.stringify({ petId }),
        });

        if (response.ok) {
          setIsFavorited(true);
          router.refresh();
          toast({
            title: "收藏成功",
            description: "已添加到我的收藏",
          });
        } else {
          const data = await response.json();
          if (response.status === 401) {
            // Redirect to login
            router.push(`/login?returnUrl=/pets/${petId}`);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleFavorite}
      disabled={isLoading}
      className={`${isFavorited ? "text-red-500 hover:text-red-600" : ""}`}
    >
      <Heart
        className={`h-4 w-4 ${isFavorited ? "fill-current" : ""} ${
          showLabel ? "mr-2" : ""
        }`}
      />
      {showLabel && (isFavorited ? "已收藏" : "收藏")}
    </Button>
  );
}
