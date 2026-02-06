import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PetStatus } from "@prisma/client";

export async function POST(
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

    const { action, reviewerNotes } = await req.json();
    const { id: applicationId } = await params;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "无效的操作" },
        { status: 400 }
      );
    }

    const application = await prisma.adoptionApplication.findUnique({
      where: { id: applicationId },
      include: { pet: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "申请不存在" },
        { status: 404 }
      );
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: "该申请已被处理" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Approve application
      await prisma.$transaction(async (tx) => {
        // Update application status
        await tx.adoptionApplication.update({
          where: { id: applicationId },
          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
            reviewerNotes,
          },
        });

        // Update pet status
        await tx.pet.update({
          where: { id: application.petId },
          data: { status: PetStatus.PENDING },
        });

        // Reject all other pending applications for this pet
        await tx.adoptionApplication.updateMany({
          where: {
            petId: application.petId,
            id: { not: applicationId },
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            reviewerNotes: "该宠物已有其他申请被批准",
          },
        });
      });

      // TODO: Send approval email
      // TODO: Send rejection emails to other applicants

      return NextResponse.json({
        message: "申请已批准",
      });
    } else {
      // Reject application
      await prisma.adoptionApplication.update({
        where: { id: applicationId },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          reviewerNotes,
        },
      });

      // TODO: Send rejection email

      return NextResponse.json({
        message: "申请已拒绝",
      });
    }
  } catch (error) {
    console.error("Error reviewing application:", error);
    return NextResponse.json(
      { error: "审核失败" },
      { status: 500 }
    );
  }
}
