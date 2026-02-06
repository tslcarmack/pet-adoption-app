import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminApplicationDetail } from "@/components/admin-application-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchApplication(id: string) {
  const application = await prisma.adoptionApplication.findUnique({
    where: { id },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });

  return application;
}

export default async function AdminApplicationDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const application = await fetchApplication(id);

  if (!application) {
    notFound();
  }

  return <AdminApplicationDetail application={application} />;
}
