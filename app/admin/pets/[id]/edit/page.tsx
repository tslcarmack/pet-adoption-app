import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PetForm } from "@/components/pet-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPet(id: string) {
  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  return pet;
}

export default async function EditPetPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const pet = await fetchPet(id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin/pets">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回宠物列表
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">编辑宠物信息</h1>
        <p className="text-muted-foreground">
          更新 {pet.name} 的信息
        </p>
      </div>

      <PetForm pet={pet} />
    </div>
  );
}
