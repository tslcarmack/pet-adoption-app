import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Add to favorites
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    const { petId } = await req.json();

    if (!petId) {
      return NextResponse.json(
        { error: "缺少宠物ID" },
        { status: 400 }
      );
    }

    // Check if pet exists
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "宠物不存在" },
        { status: 404 }
      );
    }

    // Check favorites count
    const favoritesCount = await prisma.favorite.count({
      where: { userId: session.user.id },
    });

    if (favoritesCount >= 50) {
      return NextResponse.json(
        { error: "收藏已达上限 (50只)" },
        { status: 400 }
      );
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        petId,
      },
    });

    return NextResponse.json({
      message: "已添加到收藏",
      favorite,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "已在收藏中" },
        { status: 400 }
      );
    }

    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "添加收藏失败" },
      { status: 500 }
    );
  }
}

// Remove from favorites
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("petId");

    if (!petId) {
      return NextResponse.json(
        { error: "缺少宠物ID" },
        { status: 400 }
      );
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        petId,
      },
    });

    return NextResponse.json({
      message: "已取消收藏",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "取消收藏失败" },
      { status: 500 }
    );
  }
}

// Get user's favorites
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      favorites: favorites.map((f) => f.pet),
      count: favorites.length,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "获取收藏列表失败" },
      { status: 500 }
    );
  }
}
