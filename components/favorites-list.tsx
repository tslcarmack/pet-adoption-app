import { auth } from "@/lib/auth";
import { PetCard } from "@/components/pet-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";

async function fetchFavorites() {
  const session = await auth();

  if (!session?.user) {
    return { favorites: [], count: 0 };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/favorites`,
    {
      cache: "no-store",
      headers: {
        Cookie: `authjs.session-token=${session}`, // This won't work in server component
      },
    }
  );

  // Since we can't easily pass cookies in server component, let's query directly
  const prisma = (await import("@/lib/prisma")).default;
  
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          gender: true,
          size: true,
          location: true,
          status: true,
          photos: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    favorites: favorites.map((f) => f.pet),
    count: favorites.length,
  };
}

export async function FavoritesList() {
  const { favorites, count } = await fetchFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">您还没有收藏任何宠物</p>
          <p className="text-sm text-muted-foreground mt-2">
            浏览宠物列表，点击心形图标添加收藏
          </p>
        </div>
        <Button asChild>
          <Link href="/pets">浏览宠物</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        共收藏 {count} 只宠物 (最多50只)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((pet: any) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
