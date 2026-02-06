import { Suspense } from "react";
import { FavoritesList } from "@/components/favorites-list";
import { PetListSkeleton } from "@/components/pet-list-skeleton";

export const metadata = {
  title: "我的收藏 - 宠物领养平台",
  description: "查看您收藏的宠物",
};

export default function FavoritesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">我的收藏</h1>
        <p className="text-muted-foreground">
          您收藏的所有宠物
        </p>
      </div>

      <Suspense fallback={<PetListSkeleton />}>
        <FavoritesList />
      </Suspense>
    </div>
  );
}
