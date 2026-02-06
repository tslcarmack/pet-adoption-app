import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: petId } = await params;

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        adoptionApplications: session?.user
          ? {
              where: {
                userId: session.user.id,
              },
              select: {
                id: true,
                status: true,
                submittedAt: true,
              },
            }
          : false,
        favorites: session?.user
          ? {
              where: {
                userId: session.user.id,
              },
              select: {
                id: true,
              },
            }
          : false,
        _count: {
          select: {
            adoptionApplications: {
              where: {
                status: "PENDING",
              },
            },
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

    // Format response
    const response = {
      ...pet,
      isFavorited: pet.favorites && pet.favorites.length > 0,
      userApplication: pet.adoptionApplications?.[0] || null,
      pendingApplicationsCount: pet._count.adoptionApplications,
    };

    // Remove internal fields
    delete (response as any).favorites;
    delete (response as any).adoptionApplications;
    delete (response as any)._count;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json(
      { error: "获取宠物信息失败" },
      { status: 500 }
    );
  }
}
