import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { PetStatus, PetSpecies, PetGender, PetSize, VaccinationStatus } from "@prisma/client";

const petUpdateSchema = z.object({
  name: z.string().min(1, "请输入宠物名字").optional(),
  species: z.nativeEnum(PetSpecies).optional(),
  breed: z.string().min(1, "请输入品种").optional(),
  age: z.number().int().min(0, "年龄必须大于等于0").optional(),
  gender: z.nativeEnum(PetGender).optional(),
  size: z.nativeEnum(PetSize).optional(),
  description: z.string().min(10, "描述至少需要10个字符").optional(),
  healthStatus: z.string().optional(),
  vaccinationStatus: z.nativeEnum(VaccinationStatus).optional(),
  location: z.string().min(1, "请输入所在地区").optional(),
  photos: z.array(z.string().url()).min(1, "至少需要一张照片").optional(),
  status: z.nativeEnum(PetStatus).optional(),
});

// Get single pet (admin view)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权限" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            adoptionApplications: true,
            favorites: true,
          },
        },
        adoptionApplications: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            fullName: true,
            email: true,
          },
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "宠物不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json(
      { error: "获取宠物信息失败" },
      { status: 500 }
    );
  }
}

// Update pet
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权限" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = petUpdateSchema.parse(body);

    // Check if pet exists
    const existingPet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      return NextResponse.json(
        { error: "宠物不存在" },
        { status: 404 }
      );
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      message: "宠物信息已更新",
      pet,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating pet:", error);
    return NextResponse.json(
      { error: "更新宠物信息失败" },
      { status: 500 }
    );
  }
}

// Delete pet (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权限" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if pet exists
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            adoptionApplications: true,
          },
        },
      },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "宠物不存在" },
        { status: 404 }
      );
    }

    // Don't allow deletion if there are pending applications
    if (pet._count.adoptionApplications > 0) {
      return NextResponse.json(
        { error: "该宠物有关联的申请，无法删除" },
        { status: 400 }
      );
    }

    // Delete the pet
    await prisma.pet.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "宠物已删除",
    });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { error: "删除宠物失败" },
      { status: 500 }
    );
  }
}
