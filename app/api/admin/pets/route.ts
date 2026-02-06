import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { PetStatus, PetSpecies, PetGender, PetSize, VaccinationStatus } from "@prisma/client";

const petSchema = z.object({
  name: z.string().min(1, "请输入宠物名字"),
  species: z.nativeEnum(PetSpecies),
  breed: z.string().min(1, "请输入品种"),
  age: z.number().int().min(0, "年龄必须大于等于0"),
  gender: z.nativeEnum(PetGender),
  size: z.nativeEnum(PetSize),
  description: z.string().min(10, "描述至少需要10个字符"),
  healthStatus: z.string().optional(),
  vaccinationStatus: z.nativeEnum(VaccinationStatus),
  location: z.string().min(1, "请输入所在地区"),
  photos: z.array(z.string().url()).min(1, "至少需要一张照片"),
});

// Get all pets for admin
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权限" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = status ? { status: status as PetStatus } : {};

    const [pets, total] = await Promise.all([
      prisma.pet.findMany({
        where,
        include: {
          _count: {
            select: {
              adoptionApplications: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.pet.count({ where }),
    ]);

    return NextResponse.json({
      pets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "获取宠物列表失败" },
      { status: 500 }
    );
  }
}

// Create new pet
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权限" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = petSchema.parse(body);

    const pet = await prisma.pet.create({
      data: {
        ...validatedData,
        status: PetStatus.AVAILABLE,
      },
    });

    return NextResponse.json(
      { message: "宠物添加成功", pet },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating pet:", error);
    return NextResponse.json(
      { error: "添加宠物失败" },
      { status: 500 }
    );
  }
}
