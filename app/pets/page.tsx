import { Suspense } from "react";
import { PetList } from "@/components/pet-list";
import { PetListSkeleton } from "@/components/pet-list-skeleton";
import { PetFilters } from "@/components/pet-filters";

export const metadata = {
  title: "浏览宠物 - 宠物领养平台",
  description: "浏览所有可领养的宠物",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PetsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">可领养的宠物</h1>
        <p className="text-muted-foreground">
          找到你的完美伴侣，给流浪宠物一个温暖的家
        </p>
      </div>

      <div className="mb-8">
        <PetFilters />
      </div>

      <Suspense fallback={<PetListSkeleton />}>
        <PetList searchParams={params} />
      </Suspense>
    </div>
  );
}
