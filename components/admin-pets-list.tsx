"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  status: string;
  location: string;
  photos: string[];
  createdAt: string;
  _count: {
    adoptionApplications: number;
    favorites: number;
  };
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

export function AdminPetsList() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPets();
  }, [statusFilter]);

  const fetchPets = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter === "all" 
        ? "/api/admin/pets"
        : `/api/admin/pets?status=${statusFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setPets(data.pets);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPets(pets.filter((pet) => pet.id !== id));
        setDeleteId(null);
      } else {
        const data = await response.json();
        alert(data.error || "删除失败");
      }
    } catch (error) {
      alert("删除失败，请稍后重试");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          全部
        </Button>
        <Button
          variant={statusFilter === "AVAILABLE" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("AVAILABLE")}
        >
          可领养
        </Button>
        <Button
          variant={statusFilter === "PENDING" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("PENDING")}
        >
          待审核
        </Button>
        <Button
          variant={statusFilter === "ADOPTED" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("ADOPTED")}
        >
          已领养
        </Button>
      </div>

      {/* Pets List */}
      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">暂无宠物</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pets.map((pet) => {
            const status = statusMap[pet.status] || statusMap.AVAILABLE;
            const ageYears = Math.floor(pet.age / 12);
            const ageMonths = pet.age % 12;
            const ageText =
              ageYears > 0
                ? `${ageYears}岁${ageMonths > 0 ? ageMonths + "个月" : ""}`
                : `${ageMonths}个月`;

            return (
              <Card key={pet.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={pet.photos[0] || "/placeholder-pet.jpg"}
                        alt={pet.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-xl">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {speciesMap[pet.species]} · {pet.breed} · {ageText}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📍 {pet.location}
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <span>申请: {pet._count.adoptionApplications}</span>
                        <span>收藏: {pet._count.favorites}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/pets/${pet.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/pets/${pet.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(pet.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这只宠物吗？此操作无法撤销。
              <br />
              <br />
              注意：如果该宠物有关联的申请，将无法删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
