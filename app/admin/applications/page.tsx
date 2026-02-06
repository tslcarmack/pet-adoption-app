import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminApplicationsList } from "@/components/admin-applications-list";

async function fetchPendingApplications() {
  const applications = await prisma.adoptionApplication.findMany({
    where: { status: "PENDING" },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          breed: true,
          photos: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { submittedAt: "asc" },
  });

  return applications;
}

export default async function AdminApplicationsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const applications = await fetchPendingApplications();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">待审核申请</h1>
        <p className="text-muted-foreground">
          共 {applications.length} 个待审核申请
        </p>
      </div>

      <AdminApplicationsList applications={applications} />
    </div>
  );
}
