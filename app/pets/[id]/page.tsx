import { notFound } from "next/navigation";
import { PetDetailContent } from "@/components/pet-detail-content";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPet(id: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/pets/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const pet = await fetchPet(id);

  if (!pet) {
    return {
      title: "宠物不存在 - 宠物领养平台",
    };
  }

  return {
    title: `${pet.name} - ${pet.breed} - 宠物领养平台`,
    description: pet.description.slice(0, 160),
    openGraph: {
      title: `${pet.name} - ${pet.breed}`,
      description: pet.description.slice(0, 160),
      images: pet.photos[0] ? [pet.photos[0]] : [],
    },
  };
}

export default async function PetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pet = await fetchPet(id);

  if (!pet) {
    notFound();
  }

  return <PetDetailContent pet={pet} />;
}
