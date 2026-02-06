import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PetStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Get filters
    const species = searchParams.get("species");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const location = searchParams.get("location");
    const ageRange = searchParams.get("age");
    const search = searchParams.get("q");

    // Build where clause
    const where: any = {
      status: PetStatus.AVAILABLE,
    };

    if (species) {
      where.species = species;
    }

    if (gender) {
      where.gender = gender;
    }

    if (size) {
      where.size = size;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    // Age range filtering
    if (ageRange) {
      switch (ageRange) {
        case "young": // 0-1 years (0-12 months)
          where.age = { lte: 12 };
          break;
        case "adult": // 1-7 years (12-84 months)
          where.age = { gte: 12, lte: 84 };
          break;
        case "senior": // 7+ years (84+ months)
          where.age = { gte: 84 };
          break;
      }
    }

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { breed: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch pets with pagination
    const [pets, total] = await Promise.all([
      prisma.pet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.pet.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      pets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
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
