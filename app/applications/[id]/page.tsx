import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApplicationDetail } from "@/components/application-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchApplication(id: string, userId: string) {
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
    },
  });

  if (!application) {
    return null;
  }

  // Check if user owns this application
  if (application.userId !== userId) {
    return null;
  }

  return application;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const application = await fetchApplication(id, session.user.id);

  if (!application) {
    notFound();
  }

  return <ApplicationDetail application={application} />;
}
