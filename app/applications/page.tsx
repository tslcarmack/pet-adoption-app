import { Suspense } from "react";
import { ApplicationsList } from "@/components/applications-list";
import { PetListSkeleton } from "@/components/pet-list-skeleton";

export const metadata = {
  title: "我的申请 - 宠物领养平台",
  description: "查看您的领养申请",
};

export default function ApplicationsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">我的申请</h1>
        <p className="text-muted-foreground">
          查看和管理您的领养申请
        </p>
      </div>

      <Suspense fallback={<PetListSkeleton />}>
        <ApplicationsList />
      </Suspense>
    </div>
  );
}
