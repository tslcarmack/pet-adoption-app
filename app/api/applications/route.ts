import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { PetStatus } from "@prisma/client";
import { rateLimiters } from "@/lib/rate-limit";

const applicationSchema = z.object({
  petId: z.string(),
  fullName: z.string().min(1, "请输入姓名"),
  email: z.string().email("请输入有效的邮箱"),
  phone: z.string().min(1, "请输入手机号"),
  address: z.string().min(1, "请输入地址"),
  housingType: z.enum(["OWN", "RENT"]),
  livingSituation: z.enum(["HOUSE", "APARTMENT", "OTHER"]),
  householdMembers: z.number().int().min(1),
  occupation: z.string().optional(),
  monthlyIncome: z.string().optional(),
  hasYard: z.boolean(),
  hasPetExperience: z.boolean(),
  previousPetType: z.string().optional(),
  yearsOfExperience: z.number().int().optional(),
  previousPetOutcome: z.string().optional(),
  hasCurrentPets: z.boolean(),
  currentPetsInfo: z.string().optional(),
  motivation: z.string().min(50, "请至少输入50个字符说明领养理由"),
});

// Submit adoption application
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.strict(req);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "提交过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = applicationSchema.parse(body);

    // Check if pet exists and is available
    const pet = await prisma.pet.findUnique({
      where: { id: validatedData.petId },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "宠物不存在" },
        { status: 404 }
      );
    }

    if (pet.status !== PetStatus.AVAILABLE) {
      return NextResponse.json(
        { error: "此宠物已不再接受新申请" },
        { status: 400 }
      );
    }

    // Check for existing application
    const existingApplication = await prisma.adoptionApplication.findFirst({
      where: {
        userId: session.user.id,
        petId: validatedData.petId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "您已提交过此宠物的领养申请" },
        { status: 400 }
      );
    }

    // Check for other approved applications
    const approvedApplication = await prisma.adoptionApplication.findFirst({
      where: {
        userId: session.user.id,
        status: "APPROVED",
      },
    });

    if (approvedApplication) {
      return NextResponse.json(
        { error: "您有一个待完成的领养，请完成后再申请其他宠物" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.adoptionApplication.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to applicant

    return NextResponse.json(
      {
        message: "申请已提交",
        application: {
          id: application.id,
          submittedAt: application.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "提交申请失败" },
      { status: 500 }
    );
  }
}

// Get user's applications
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    const applications = await prisma.adoptionApplication.findMany({
      where: { userId: session.user.id },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            photos: true,
            status: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "获取申请列表失败" },
      { status: 500 }
    );
  }
}
