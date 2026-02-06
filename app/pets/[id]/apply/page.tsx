import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdoptionApplicationForm } from "@/components/adoption-application-form";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPet(id: string) {
  const pet = await prisma.pet.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      photos: true,
      status: true,
    },
  });

  return pet;
}

export default async function ApplyPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect(`/login?returnUrl=/pets/${id}/apply`);
  }

  const pet = await fetchPet(id);

  if (!pet) {
    notFound();
  }

  if (pet.status !== "AVAILABLE") {
    redirect(`/pets/${id}`);
  }

  // Check if user already applied
  const existingApplication = await prisma.adoptionApplication.findFirst({
    where: {
      userId: session.user.id,
      petId: id,
    },
  });

  if (existingApplication) {
    redirect(`/applications/${existingApplication.id}`);
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">申请领养</h1>
        <p className="text-muted-foreground">
          填写以下信息，我们会尽快审核您的申请
        </p>
      </div>

      <AdoptionApplicationForm pet={pet} user={session.user} />
    </div>
  );
}
